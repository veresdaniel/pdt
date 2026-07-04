import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { EventService } from '$lib/services/event-service';
import type { Locale } from '$lib/i18n/i18n';

const eventService = new EventService();
export const load: PageServerLoad = async ({ fetch, locals, request }) => {

  const acceptLanguage: string = request.headers.get('accept-language') ?? '';

  const languages = acceptLanguage
    .split(',')
    .map((l) => l.split(';')[0].trim().toLowerCase());

  const lang: Locale = languages.some((l) => l.startsWith('hu'))
    ? 'hu'
    : 'en';

  const upcomingEvent = await eventService.getUpcomingEvent(fetch, lang);

  locals.upcomingEvent = upcomingEvent;
  throw redirect(302, `/${lang}/events/${upcomingEvent.slug}`);
};