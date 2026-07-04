import { localizePath } from '$lib/functions/localizePath';
import type { LocaleCode } from '$lib/types/locale.type';

export function isExternalLike(value: string): boolean {
	return /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\?)/i.test(value);
}

/** Paths that belong to the PDT app (not ergomania.eu). */
export function isPdtInternalPath(path: string): boolean {
	const normalized = String(path ?? '').trim().toLowerCase();
	return /(^|\/)events(\/|$|\?|#)/.test(normalized);
}

export function toErgomaniaSiteUrl(
	path: string,
	locale: LocaleCode | string | null,
	siteBase: string
): string {
	const raw = String(path ?? '').trim();
	if (!raw || isExternalLike(raw)) return raw;

	const base = siteBase.replace(/\/$/, '');
	const localized = localizePath(raw, locale);
	return localized.startsWith('/') ? `${base}${localized}` : `${base}/${localized}`;
}

export function resolveMenuUrl(
	path: string,
	locale: LocaleCode,
	siteBase: string
): string {
	if (isExternalLike(path)) return path;
	if (isPdtInternalPath(path)) return localizePath(path, locale);
	return toErgomaniaSiteUrl(path, locale, siteBase);
}
