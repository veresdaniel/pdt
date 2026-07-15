/*import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { EventService } from '$lib/services/event-service';

const eventService = new EventService();
export const load: PageServerLoad = async ({ params, fetch, locals }) => {
  const { lang } = params;
  

  
  locals.upcomingEvent = upcomingEvent;
  throw redirect(302, `/${lang}/events/${upcomingEvent.slug}/`);
};*/

import type { PageServerLoad } from './$types';
import { API_BASE_URL } from '$env/static/private';
import type { IEvent } from '$lib/interfaces/eventInterface';
import { EventService } from '$lib/services/event-service';
import { PublicContentService } from '$lib/services/public-content.service';
import { PageEnum } from '$lib/enums/page.enum';

const eventService = new EventService();
export const load: PageServerLoad = async ({ params, fetch }) => {
  const publicContentService = new PublicContentService(fetch, API_BASE_URL);
  const lang = params.lang;
  const upcomingEvent = await eventService.getUpcomingEvent(fetch, lang);

  const alleventsResponse = await fetch(`${API_BASE_URL}/events`, {
    headers: {
      'x-language': lang
    }
  });

  const allEvents = await alleventsResponse.json();
  const pageContent = await publicContentService.fetchIndexedContents(PageEnum.Event, 0, lang);

  const pastEvents: Array<IEvent> = [];
  const futureEvents: Array<IEvent> = [];

  Object.values(allEvents).forEach((event: any) => {
    if (event.dateTime > new Date().toISOString()) {
      futureEvents.push(event);
    } else {
      pastEvents.push(event)
    }
  });

  const teamMembersResoponse = await fetch(`${API_BASE_URL}/Team/GetTeamMembers`, {
    headers: {
      'x-language': lang
    }
  });

  const teamMembers = await teamMembersResoponse.json();


  return { allEvents, pastEvents, futureEvents, upcomingEvent, pageContent, teamMembers};
};