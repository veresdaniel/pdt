import { resolveMenuUrl } from '$lib/functions/ergomaniaSiteUrl';
import { createHeadersWithAuthorization } from '$lib/functions/httpHelper';
import { localizePath } from '$lib/functions/localizePath';
import { isEventsMenuItem, mapEventMenuCategories } from '$lib/services/eventMenu.mapper';
import { getLocaleForApi, type LocaleCode } from '$lib/types/locale.type';
import { PUBLIC_ERGOMANIA_SITE_URL } from '$env/static/public';
import type { PrimaryNavigationCategoryItem, PrimaryNavigationMenuItemPayload } from '@ergodot/ui-kit';

type MenuItemPayload = PrimaryNavigationMenuItemPayload;

function readApiString(raw: Record<string, unknown>, ...keys: string[]): string | undefined {
	for (const key of keys) {
		const value = raw[key];
		if (value != null && String(value).trim() !== '') {
			return String(value);
		}
	}
	return undefined;
}

function stripHtml(html: string): string {
	return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function mapUxServiceCategoryItems(items: unknown): PrimaryNavigationCategoryItem[] {
	if (!Array.isArray(items)) return [];

	return items.map((raw: Record<string, unknown>) => {
		const services = Array.isArray(raw.services ?? raw.Services)
			? ((raw.services ?? raw.Services) as Record<string, unknown>[])
			: [];
		const title = readApiString(raw, 'title', 'Title') ?? '';
		let subtitle = readApiString(raw, 'subtitle', 'Subtitle', 'subTitle', 'SubTitle');
		const description = readApiString(raw, 'description', 'Description');

		if (
			!subtitle ||
			subtitle.trim().length > 80 ||
			(description != null && subtitle.trim() === stripHtml(description))
		) {
			subtitle = `${title} Methodologies`;
		}

		return {
			...(raw.icon != null && { icon: String(raw.icon) }),
			title,
			subtitle,
			...(description && { description }),
			services: services.map((service) => ({
				title: String(service.title ?? service.Title ?? ''),
				url: String(service.url ?? service.Url ?? '')
			}))
		};
	});
}

function getLanguageIdForLocale(code: LocaleCode): number {
	switch (code) {
		case 'hu':
			return 2;
		case 'en':
			return 1;
		case 'de':
			return 3;
		case 'nl':
			return 4;
		default:
			return 1;
	}
}

function ensureTrailingSlash(path: string): string {
	if (!path || path === '/') return '/';
	const hashIdx = path.indexOf('#');
	const queryIdx = path.indexOf('?');
	const splitIdx = hashIdx >= 0 ? hashIdx : queryIdx >= 0 ? queryIdx : path.length;
	const base = path.slice(0, splitIdx);
	const suffix = path.slice(splitIdx);
	if (base.endsWith('/')) return path;
	return `${base}/${suffix}`;
}

function localizeMenuItems(
	items: MenuItemPayload[],
	locale: LocaleCode,
	siteBase: string
): MenuItemPayload[] {
	return items.map((item) => ({
		...item,
		path: resolveMenuUrl(item.path, locale, siteBase),
		headerChildren: localizeMenuItems(item.headerChildren ?? [], locale, siteBase),
		footerChildren: localizeMenuItems(item.footerChildren ?? [], locale, siteBase),
		categoryChildren: item.categoryChildren?.map((cat) => ({
			...cat,
			services: cat.services.map((service) => ({
				...service,
				url: resolveMenuUrl(service.url, locale, siteBase)
			}))
		})),
		eventChildren: item.eventChildren?.map((cat) => ({
			...cat,
			comingEvents: cat.comingEvents.map((event) => ({
				...event,
				url: localizePath(event.url, locale)
			})),
			pastEvents: cat.pastEvents.map((event) => ({
				...event,
				url: localizePath(event.url, locale)
			}))
		}))
	}));
}

function parseMenuResponse(menuData: unknown, localeForApi: LocaleCode): MenuItemPayload[] {
	const items =
		(menuData as { items?: unknown[] })?.items ?? (Array.isArray(menuData) ? menuData : []);
	const rawItems = Array.isArray(items) ? items : [];
	const expectedLanguageId = getLanguageIdForLocale(localeForApi);

	return rawItems
		.filter((item: Record<string, unknown>) => {
			const lang = item.languageId ?? item.LanguageId;
			if (lang === undefined || lang === null) return true;
			return Number(lang) === expectedLanguageId;
		})
		.filter((item: Record<string, unknown>) => {
			const show = item.showInHeader ?? item.ShowInHeader;
			return show === true || show === 'true' || show === 1;
		})
		.sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
			const ia = a.headerIndex ?? a.HeaderIndex ?? 0;
			const ib = b.headerIndex ?? b.HeaderIndex ?? 0;
			return Number(ia) - Number(ib);
		})
		.map((item: Record<string, unknown>) => ({
			path: String(item.path ?? item.Path ?? ''),
			text: String(item.text ?? item.Text ?? ''),
			showInHeader: true,
			headerIndex: Number(item.headerIndex ?? item.HeaderIndex ?? 0),
			headerChildren: Array.isArray(item.headerChildren ?? item.HeaderChildren)
				? ((item.headerChildren ?? item.HeaderChildren) as MenuItemPayload[])
				: [],
			showInFooter: item.showInFooter === true || item.ShowInFooter === true,
			footerIndex: Number(item.footerIndex ?? item.FooterIndex ?? 0),
			footerChildren: Array.isArray(item.footerChildren ?? item.FooterChildren)
				? ((item.footerChildren ?? item.FooterChildren) as MenuItemPayload[])
				: []
		})) as MenuItemPayload[];
}

function mergeEventsMenuItem(
	menuItems: MenuItemPayload[],
	eventCategories: ReturnType<typeof mapEventMenuCategories>
): MenuItemPayload[] {
	if (eventCategories.length === 0) return menuItems;

	const eventsIndex = menuItems.findIndex((item) => isEventsMenuItem(item));
	if (eventsIndex >= 0) {
		return menuItems.map((item, index) =>
			index === eventsIndex ? { ...item, eventChildren: eventCategories } : item
		);
	}

	const fallbackItem: MenuItemPayload = {
		text: 'Events',
		path: '/events/',
		showInHeader: true,
		headerIndex: menuItems.length > 0 ? menuItems[menuItems.length - 1].headerIndex : 0,
		headerChildren: [],
		showInFooter: false,
		footerIndex: 0,
		footerChildren: [],
		eventChildren: eventCategories
	};

	const next = [...menuItems];
	next.splice(Math.max(next.length - 1, 0), 0, fallbackItem);
	return next;
}

function mergeUxServicesMenuItem(
	menuItems: MenuItemPayload[],
	serviceCategories: PrimaryNavigationCategoryItem[]
): MenuItemPayload[] {
	if (serviceCategories.length === 0) return menuItems;

	return menuItems.map((item) => {
		const isUxServices = item.path.toLowerCase().includes('ux-services');
		if (!isUxServices) return item;

		return {
			...item,
			categoryChildren: serviceCategories
		};
	});
}

function normalizeMenuPaths(items: MenuItemPayload[]) {
	for (const item of items) {
		item.path = ensureTrailingSlash(item.path);
		for (const cat of item.categoryChildren ?? []) {
			for (const service of cat.services) {
				if (service.url && !service.url.startsWith('#') && !service.url.startsWith('http')) {
					service.url = ensureTrailingSlash(service.url);
				}
			}
		}
		for (const cat of item.eventChildren ?? []) {
			for (const event of [...cat.comingEvents, ...cat.pastEvents]) {
				if (event.url && !event.url.startsWith('#') && !event.url.startsWith('http')) {
					event.url = ensureTrailingSlash(event.url);
				}
			}
		}
	}
}

export async function loadMenuItems(
	fetchFn: typeof fetch,
	apiBaseUrl: string,
	locale: string | undefined
): Promise<MenuItemPayload[]> {
	const currentLang = getLocaleForApi(locale);
	const headers = createHeadersWithAuthorization(currentLang);

	const menuRes = await fetchFn(`${apiBaseUrl}/MenuItems/GetMenuItems`, { headers });
	const menuItems = menuRes.ok ? parseMenuResponse(await menuRes.json(), currentLang) : [];

	const servicesRes = await fetchFn(`${apiBaseUrl}/Service/menu`, { headers });
	const serviceCategories = servicesRes.ok
		? mapUxServiceCategoryItems(await servicesRes.json())
		: [];

	const eventsRes = await fetchFn(`${apiBaseUrl}/events/menu`, { headers });
	const eventsMenuData = eventsRes.ok ? await eventsRes.json() : null;
	const eventCategories = eventsMenuData
		? mapEventMenuCategories(eventsMenuData, currentLang)
		: [];

	const withServices = mergeUxServicesMenuItem(menuItems, serviceCategories);
	const merged = mergeEventsMenuItem(withServices, eventCategories);
	const siteBase = PUBLIC_ERGOMANIA_SITE_URL.replace(/\/$/, '');
	const localized = localizeMenuItems(merged, currentLang, siteBase);
	normalizeMenuPaths(localized);

	return localized;
}
