/**
 * Supported locale codes. Single source of truth for app-wide language/locale typing.
 */
export const LOCALE_CODES = ['en', 'hu', 'de', 'nl'] as const;

export type LocaleCode = (typeof LOCALE_CODES)[number];

export const DEFAULT_LOCALE: LocaleCode = 'en';

export function isValidLocale(value: string): value is LocaleCode {
	return (LOCALE_CODES as readonly string[]).includes(value);
}

/** Returns the locale to use for API calls: current locale if valid, otherwise DEFAULT_LOCALE. */
export function getLocaleForApi(locale?: string | null): LocaleCode {
	return locale && isValidLocale(locale) ? locale : DEFAULT_LOCALE;
}
