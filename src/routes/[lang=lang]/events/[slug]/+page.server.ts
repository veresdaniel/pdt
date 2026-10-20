import type { PageServerLoad } from './$types';
import { API_BASE_URL } from '$env/static/private';
import type { EventInfo } from '$lib/models/event-info.model';
import { error } from '@sveltejs/kit';
import { PublicContentService } from '$lib/services/public-content.service';
import { PageEnum } from '$lib/enums/page.enum';
import { ComponentEnum } from '$lib/enums/component.enum';
import type { LocaleCode } from '$lib/types/locale.type';

export const load: PageServerLoad = async ({ params, locals, fetch }) => {
  const lang = params.lang;

  const eventsResponse = await fetch(`${API_BASE_URL}/events`, {
    headers: {
      'x-language': lang
    }
  })

  const events: EventInfo[] = await eventsResponse.json();

  // Shared texts of the event pages (Event CMS page), e.g. the intro per event type (eventIntroTitleBb, ...)
  const pageContent =
    (await new PublicContentService(fetch, API_BASE_URL)
      .getByPageAndComponent(PageEnum.Event, ComponentEnum.Page, lang as LocaleCode)
      .catch(() => null)) ?? {};

  if (locals.upcomingEvent && params.slug === locals.upcomingEvent.slug) {
    return { event: locals.upcomingEvent, events: events, pageContent, pastEvents: await loadPastEvents(fetch, lang, locals.upcomingEvent) };
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

  return { event, events, pageContent, pastEvents: await loadPastEvents(fetch, lang, event) };
};

/** "Past events" block (Figma): the two most recent past events of the same type, without the current one */
async function loadPastEvents(
  fetchFn: typeof fetch,
  lang: string,
  current: { slug?: string; type?: number | string }
): Promise<EventInfo[]> {
  const res = await fetchFn(`${API_BASE_URL}/events/past?count=12`, { headers: { 'x-language': lang } }).catch(
    () => null
  );
  if (!res?.ok) return [];
  const past = (await res.json()) as EventInfo[];
  return past
    .filter((e) => e.slug !== current.slug && String(e.type) === String(current.type))
    .slice(0, 2);
}
