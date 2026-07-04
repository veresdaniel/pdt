import { DEFAULT_LOCALE, isValidLocale, type LocaleCode } from '$lib/types/locale.type';

const MISSING_TRANSLATION_BY_LOCALE: Record<LocaleCode, string> = {
	en: 'Missing translation — {key}',
	hu: 'Nyelvesítés hiányzik — {key}',
	de: 'Fehlende Übersetzung — {key}',
	nl: 'Ontbrekende vertaling — {key}'
};

export type FormatMissingFn = (translationKey: string) => string;

export function resolveActiveLocale(activeLocale?: string | null): LocaleCode {
	return activeLocale && isValidLocale(activeLocale) ? activeLocale : DEFAULT_LOCALE;
}

export function formatMissingTranslation(
	translationKey: string,
	activeLocale?: string | null
): string {
	const locale = resolveActiveLocale(activeLocale);
	const template =
		MISSING_TRANSLATION_BY_LOCALE[locale] ?? MISSING_TRANSLATION_BY_LOCALE[DEFAULT_LOCALE];
	return template.replace('{key}', translationKey);
}

export function createFormatMissing(activeLocale?: string | null): FormatMissingFn {
	return (translationKey: string) => formatMissingTranslation(translationKey, activeLocale);
}
