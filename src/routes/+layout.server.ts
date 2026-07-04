import type { PageServerLoad } from './$types';
import { API_BASE_URL } from '$env/static/private';
import { uxServicesCategories } from '$lib/mockData/services-menu.mock';
import { loadMenuItems } from '$lib/services/menu.service';
import type { PrimaryNavigationCategoryItem } from '@ergodot/ui-kit';

export const trailingSlash = 'always';

export const load: PageServerLoad = async ({ params, fetch }) => {
    const lang = (params as Record<string, string>).lang;
    const currentLang = lang ?? 'hu';

    const menuItems = await loadMenuItems(
        fetch,
        API_BASE_URL,
        currentLang,
        uxServicesCategories as PrimaryNavigationCategoryItem[]
    );

    const footerContentRes = await fetch(`${API_BASE_URL}/content/public/6/11/0`, {
        headers: {
            'x-language': currentLang
        }
    });

    const footerContactPersonsRes = await fetch(`${API_BASE_URL}/content/public/6/12/1`, {
        headers: {
            'x-language': currentLang
        }
    });
    const footerContent = await footerContentRes.json();
    const footerContactPersons = await footerContactPersonsRes.json();

    return { menuItems, footerContent, footerContactPersons };
};
