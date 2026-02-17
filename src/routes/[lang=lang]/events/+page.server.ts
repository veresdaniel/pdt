import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { EventService } from '$lib/services/event-service';

const eventService = new EventService();
export const load: PageServerLoad = async ({ params, fetch, locals }) => {
  const { lang } = params;
  
  const upcomingEvent = await eventService.getUpcomingEvent(fetch, lang);
  
  locals.upcomingEvent = upcomingEvent;
  throw redirect(302, `/${lang}/events/${upcomingEvent.slug}`);
};