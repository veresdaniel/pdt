import type { PageServerLoad } from './$types';
import { API_BASE_URL } from '$env/static/private';
import type { EventInfo } from '$lib/models/event-info.model';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals, fetch }) => {
  const lang = params.lang;

  const eventsResponse = await fetch(`${API_BASE_URL}/events`, {
    headers: {
      'x-language': lang
    }
  })

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


  return { event, events, footerContent, footerContactPersons };
};