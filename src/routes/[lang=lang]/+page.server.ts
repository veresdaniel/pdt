import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { EventService } from '$lib/services/event-service';
import type { Locale } from '$lib/i18n/i18n';

const eventService = new EventService();
export const load: PageServerLoad = async ({ params, fetch, locals }) => {
  const lang = params.lang as Locale;
  const upcomingEvent = await eventService.getUpcomingEvent(fetch, lang);
  
  locals.upcomingEvent = upcomingEvent;
  throw redirect(302, `/${lang}/events/${upcomingEvent.slug}`);
};