import type { LayoutServerLoad } from './$types';
import { API_BASE_URL } from '$env/static/private';
import { uxServicesCategories } from '$lib/mockData/services-menu.mock';
import { loadMenuItems } from '$lib/services/menu.service';
import { PublicContentService } from '$lib/services/public-content.service';
import { PageEnum } from '$lib/enums/page.enum';
import { ComponentEnum } from '$lib/enums/component.enum';
import type { PrimaryNavigationCategoryItem } from '@ergodot/ui-kit';
import { DEFAULT_LOCALE, getLocaleForApi, isValidLocale } from '$lib/types/locale.type';

export const trailingSlash = 'always';

export const load: LayoutServerLoad = async ({ params, fetch }) => {
	const paramLocale = (params as Record<string, string>)?.lang;
	const locale = paramLocale && isValidLocale(paramLocale) ? paramLocale : DEFAULT_LOCALE;
	const apiLocale = getLocaleForApi(locale);

	const menuItems = await loadMenuItems(
		fetch,
		API_BASE_URL,
		apiLocale,
		uxServicesCategories as PrimaryNavigationCategoryItem[]
	);

	const publicContentService = new PublicContentService(fetch, API_BASE_URL);
	const footerContent = await publicContentService.getByPageAndComponent(
		PageEnum.Common,
		ComponentEnum.Footer,
		apiLocale
	);
	const footerContactPersons = await publicContentService.fetchIndexedContents(
		PageEnum.Common,
		ComponentEnum.FooterContactPerson,
		apiLocale
	);

	return { locale, menuItems, footerContent, footerContactPersons };
};
