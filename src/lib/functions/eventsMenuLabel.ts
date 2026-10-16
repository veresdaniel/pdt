import type { LocaleCode } from '$lib/types/locale.type';

/** Top-level Events menu label per language (same as frontend/src/lib/functions/eventsMenuLabel.ts). */
const EVENTS_MENU_LABELS: Record<LocaleCode, string> = {
	en: 'Events',
	hu: 'Események',
	de: 'Veranstaltungen',
	nl: 'Evenementen'
};

export function getEventsMenuLabel(locale: LocaleCode): string {
	return EVENTS_MENU_LABELS[locale] ?? EVENTS_MENU_LABELS.en;
}
