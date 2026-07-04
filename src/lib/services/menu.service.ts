import { localizePath } from '$lib/functions/localizePath';
import { isEventsMenuItem, mapEventMenuCategories } from '$lib/services/eventMenu.mapper';
import { getLocaleForApi, type LocaleCode } from '$lib/types/locale.type';
import type { PrimaryNavigationCategoryItem, PrimaryNavigationMenuItemPayload } from '@ergodot/ui-kit';

type MenuItemPayload = PrimaryNavigationMenuItemPayload;

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

function localizeMenuItems(items: MenuItemPayload[], locale: LocaleCode): MenuItemPayload[] {
  return items.map((item) => ({
    ...item,
    path: localizePath(item.path, locale),
    headerChildren: localizeMenuItems(item.headerChildren ?? [], locale),
    footerChildren: localizeMenuItems(item.footerChildren ?? [], locale),
    categoryChildren: item.categoryChildren?.map((cat) => ({
      ...cat,
      services: cat.services.map((service) => ({
        ...service,
        url: localizePath(service.url, locale)
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

function parseMenuResponse(menuData: unknown): MenuItemPayload[] {
  const items = (menuData as { items?: unknown[] })?.items ?? (Array.isArray(menuData) ? menuData : []);
  const rawItems = Array.isArray(items) ? items : [];

  return rawItems
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
        ? (item.headerChildren ?? item.HeaderChildren) as MenuItemPayload[]
        : [],
      showInFooter: item.showInFooter === true || item.ShowInFooter === true,
      footerIndex: Number(item.footerIndex ?? item.FooterIndex ?? 0),
      footerChildren: Array.isArray(item.footerChildren ?? item.FooterChildren)
        ? (item.footerChildren ?? item.FooterChildren) as MenuItemPayload[]
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
  locale: string | undefined,
  uxServiceCategories: PrimaryNavigationCategoryItem[]
): Promise<MenuItemPayload[]> {
  const currentLang = getLocaleForApi(locale);

  const menuRes = await fetchFn(`${apiBaseUrl}/MenuItems/GetMenuItems`, {
    headers: { 'x-language': currentLang }
  });
  const menuItems = menuRes.ok ? parseMenuResponse(await menuRes.json()) : [];

  if (menuItems[0] && uxServiceCategories.length > 0) {
    menuItems[0] = { ...menuItems[0], categoryChildren: uxServiceCategories };
  }

  const eventsRes = await fetchFn(`${apiBaseUrl}/events/menu`, {
    headers: { 'x-language': currentLang }
  });
  const eventsMenuData = eventsRes.ok ? await eventsRes.json() : null;
  const eventCategories = eventsMenuData ? mapEventMenuCategories(eventsMenuData, currentLang) : [];

  const merged = mergeEventsMenuItem(menuItems, eventCategories);
  const localized = localizeMenuItems(merged, currentLang);
  normalizeMenuPaths(localized);

  return localized;
}
