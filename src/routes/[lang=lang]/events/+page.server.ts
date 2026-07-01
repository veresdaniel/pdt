/*import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { EventService } from '$lib/services/event-service';

const eventService = new EventService();
export const load: PageServerLoad = async ({ params, fetch, locals }) => {
  const { lang } = params;
  
  const upcomingEvent = await eventService.getUpcomingEvent(fetch, lang);
  
  locals.upcomingEvent = upcomingEvent;
  throw redirect(302, `/${lang}/events/${upcomingEvent.slug}`);
};*/

import type { PageServerLoad } from './$types';
import { API_BASE_URL } from '$env/static/private';
import type { EventInfo } from '$lib/models/event-info.model';
import { error } from '@sveltejs/kit';
import { uxServicesCategories } from '$lib/mockData/services-menu.mock';
import { eventsMenu } from '$lib/mockData/events-menu.mock';
import type { IEvent } from '$lib/interfaces/eventInterface';

export const load: PageServerLoad = async ({ params, locals, fetch }) => {
  const lang = params.lang;

    const menuRes = await fetch(`${API_BASE_URL}/MenuItems/GetMenuItems`, {
      headers: {
      'x-language': lang
    }
    });

    const footerContentRes = await fetch(`${API_BASE_URL}/content/public/6/11/0`, {
    headers: {
      'x-language': lang
    }
  });

  const footerContactPersonsRes = await fetch(`${API_BASE_URL}/content/public/6/12/1`, {
    headers: {
      'x-language': lang
    }
  });
  const footerContent = await footerContentRes.json();
  const footerContactPersons = await footerContactPersonsRes.json();

    const alleventre = await fetch(`${API_BASE_URL}/events`, {
    headers: {
      'x-language': lang
    }
  });

  const allEvents = await alleventre.json();
  const pastEvents: Array<IEvent> = [];
  const futureEvents: Array<IEvent> = [];

  Object.values(allEvents).forEach((event: any) => {
    if(event.dateTime > new Date().toISOString()){
      futureEvents.push(event);
      futureEvents.push(event);
      pastEvents.push(event)
      pastEvents.push(event)
      pastEvents.push(event)
    } else {
      pastEvents.push(event)
    }
  });


  return { footerContent, footerContactPersons, allEvents, pastEvents, futureEvents };
};