import type { PageServerLoad } from './$types';
import { API_BASE_URL } from '$env/static/private';
import type { EventInfo } from '$lib/models/event-info.model';
import { error } from '@sveltejs/kit';
import { uxServicesCategories } from '$lib/mockData/services-menu.mock';

export const load: PageServerLoad = async ({ params, locals, fetch }) => {
  const lang = params.lang;

  const eventsResponse = await fetch(`${API_BASE_URL}/events`, {
    headers: {
      'x-language': lang
    }
  })

    const menuRes = await fetch(`${API_BASE_URL}/MenuItems/GetMenuItems`, {
      headers: {
      'x-language': lang
    }
    });
    const menuItems = await menuRes.json();
    menuItems[0].categoryChildren = uxServicesCategories;

  const events: EventInfo[] = await eventsResponse.json();

  if (locals.upcomingEvent && params.slug === locals.upcomingEvent.slug) {
    return { event: locals.upcomingEvent, events: events };
  }

  const eventResponse = await fetch(`${API_BASE_URL}/events/${params.slug}`, {
    headers: {
      'x-language': lang
    }
  });
  if (!eventResponse.ok) {
    error(404)
  }
  const event = await eventResponse.json();

  return { event, events, menuItems };
};