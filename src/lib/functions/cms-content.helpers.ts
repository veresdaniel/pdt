import type { FormatMissingFn } from '$lib/functions/formatMissingTranslation';
import { localizePath } from '$lib/functions/localizePath';
import type { LocaleCode } from '$lib/types/locale.type';

export type IndexedContentItem = {
	index: number;
	content: Record<string, string> | null;
};

export type { FormatMissingFn };

export function cmsKey(page: string, component: string, field: string, cmsIndex?: number): string {
	if (cmsIndex !== undefined) {
		return `${page}.${component}[${cmsIndex}].${field}`;
	}
	return `${page}.${component}.${field}`;
}

export function getCmsText(
	content: Record<string, string> | null,
	fieldKey: string,
	translationKey: string,
	formatMissing: FormatMissingFn
): string {
	const value = getValueByKey(content, fieldKey);
	if (isUsableCmsText(value)) {
		return value;
	}
	return formatMissing(translationKey);
}

export function getCmsTextFromKeys(
	content: Record<string, string> | null,
	fieldKeys: string[],
	translationKey: string,
	formatMissing: FormatMissingFn
): string {
	for (const fieldKey of fieldKeys) {
		const value = getValueByKey(content, fieldKey);
		if (isUsableCmsText(value)) {
			return value;
		}
	}
	return formatMissing(translationKey);
}

export function getValueByKey(content: Record<string, string> | null, key: string): string | undefined {
	if (!content) return undefined;

	const normalizedKey = key.trim().toLowerCase();
	const matchedEntry = Object.entries(content).find(
		([entryKey]) => entryKey.trim().toLowerCase() === normalizedKey
	);
	return typeof matchedEntry?.[1] === 'string' ? matchedEntry[1] : undefined;
}

export function isUnresolvedCmsPlaceholder(value: string): boolean {
	const trimmed = value.trim();
	if (!trimmed) return false;
	if (trimmed === 'COMMON.MISSING_TRANSLATION') return true;
	return /^[A-Z][A-Z0-9_]*(\.[A-Z0-9_]+)+$/.test(trimmed);
}

function isUsableCmsText(value: string | undefined): value is string {
	return typeof value === 'string' && value.trim().length > 0 && !isUnresolvedCmsPlaceholder(value);
}

export function getUrl(
	content: Record<string, string> | null,
	key: string,
	fallback = '#',
	locale?: LocaleCode | string | null
): string {
	const value = getValueByKey(content, key);
	return localizePath(typeof value === 'string' && value.trim().length > 0 ? value : fallback, locale);
}

export function resolvePrivacyLabelHtml(
	content: Record<string, string> | null,
	formatMissing: FormatMissingFn,
	page: string,
	component: string
): string {
	const htmlKeys = ['privacyLabelHtml', 'privacyTextHtml', 'privacyHtml'];
	for (const key of htmlKeys) {
		const value = getValueByKey(content, key);
		if (typeof value === 'string' && value.trim().length > 0 && !isUnresolvedCmsPlaceholder(value)) {
			return value.trim();
		}
	}

	return formatMissing(cmsKey(page, component, 'privacyLabelHtml'));
}
