import type { PageServerLoad } from './$types';
import { API_BASE_URL } from '$env/static/private';
import { uxServicesCategories } from '$lib/mockData/services-menu.mock';
import { eventsMenu } from '$lib/mockData/events-menu.mock';

export const trailingSlash = 'always';

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

function normalizeMenuPaths(items: Array<{ path?: string; categoryChildren?: Array<{ url?: string }> }>) {
	for (const item of items) {
		if (item.path) item.path = ensureTrailingSlash(item.path);
		for (const child of item.categoryChildren ?? []) {
			if (child.url && !child.url.startsWith('#') && !child.url.startsWith('http')) {
				child.url = ensureTrailingSlash(child.url);
			}
		}
	}
}

export const load: PageServerLoad = async ({ params }) => {
    const lang = (params as Record<string, string>).lang; 
    const currentLang = lang ?? 'hu'; 

    const menuRes = await fetch(`${API_BASE_URL}/MenuItems/GetMenuItems`, {
        headers: {
            'x-language': currentLang
        }
    });
    const menuItems = await menuRes.json();
    menuItems.sort((a: any, b: any) => a.headerIndex - b.headerIndex);
    menuItems[0].categoryChildren = uxServicesCategories;
    menuItems.splice(menuItems.length - 1, 0, eventsMenu);
    normalizeMenuPaths(menuItems);

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