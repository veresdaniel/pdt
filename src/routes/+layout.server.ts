import type { PageServerLoad } from './$types';
import { API_BASE_URL } from '$env/static/private';
import { uxServicesCategories } from '$lib/mockData/services-menu.mock';
import { eventsMenu } from '$lib/mockData/events-menu.mock';

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