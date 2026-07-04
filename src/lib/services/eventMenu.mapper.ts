import { getEventMenuCopy } from '$lib/config/eventMenuCopy';
import type { LocaleCode } from '$lib/types/locale.type';
import type { PrimaryNavigationEventCategoryItem, PrimaryNavigationMenuItemPayload } from '@ergodot/ui-kit';

type ApiRecord = Record<string, unknown>;

function readApiArray(raw: ApiRecord, ...keys: string[]): ApiRecord[] {
  for (const key of keys) {
    const value = raw[key];
    if (Array.isArray(value)) {
      return value as ApiRecord[];
    }
  }
  return [];
}

function readApiString(raw: ApiRecord, ...keys: string[]): string {
  for (const key of keys) {
    const value = raw[key];
    if (value != null && String(value).trim() !== '') {
      return String(value);
    }
  }
  return '';
}

function buildEventUrl(slug: string): string {
  const clean = String(slug ?? '').trim().replace(/^\/+|\/+$/g, '');
  return clean ? `/events/${clean}/` : '/events/';
}

function formatEventDate(dateValue: unknown, locale: LocaleCode): string | undefined {
  if (!dateValue) return undefined;

  const date = new Date(String(dateValue));
  if (Number.isNaN(date.getTime())) return undefined;

  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

function mapUpcomingEvents(items: ApiRecord[], locale: LocaleCode) {
  return items.map((item) => {
    const location = readApiString(item, 'location', 'Location');
    return {
      title: readApiString(item, 'title', 'Title'),
      url: buildEventUrl(readApiString(item, 'slug', 'Slug')),
      date: formatEventDate(item.date ?? item.Date, locale),
      ...(location ? { location } : {})
    };
  });
}

function mapPastEvents(items: ApiRecord[]) {
  return items.map((item) => ({
    title: readApiString(item, 'title', 'Title'),
    url: buildEventUrl(readApiString(item, 'slug', 'Slug'))
  }));
}

export function mapEventMenuCategories(data: unknown, locale: LocaleCode): PrimaryNavigationEventCategoryItem[] {
  const raw = (data ?? {}) as ApiRecord;
  const copy = getEventMenuCopy(locale);

  return [
    {
      eventName: copy.pdt.title,
      title: copy.pdt.title,
      subtitle: copy.pdt.subtitle,
      description: copy.pdt.description,
      comingEvents: mapUpcomingEvents(readApiArray(raw, 'upcomingPDTs', 'UpcomingPDTs'), locale),
      pastEvents: mapPastEvents(readApiArray(raw, 'pastPDTs', 'PastPDTs'))
    },
    {
      eventName: copy.bb.title,
      title: copy.bb.title,
      subtitle: copy.bb.subtitle,
      description: copy.bb.description,
      comingEvents: mapUpcomingEvents(readApiArray(raw, 'upcomingBBs', 'UpcomingBBs'), locale),
      pastEvents: mapPastEvents(readApiArray(raw, 'pastBBs', 'PastBBs'))
    }
  ];
}

export function isEventsMenuItem(item: Pick<PrimaryNavigationMenuItemPayload, 'path' | 'text'>): boolean {
  const path = item.path.toLowerCase();
  if (/(^|\/)events(\/|$|\?|#)/.test(path)) {
    return true;
  }

  const text = item.text.trim().toLowerCase();
  return ['events', 'események', 'veranstaltungen', 'evenementen'].includes(text);
}
