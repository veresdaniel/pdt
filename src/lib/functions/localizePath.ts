import { isValidLocale, type LocaleCode } from '$lib/types/locale.type';

function isExternalLike(value: string): boolean {
	return /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\?)/i.test(value);
}

export function localizePath(path: string, locale?: LocaleCode | string | null): string {
	const raw = String(path ?? '').trim();
	if (!raw) return raw;
	if (!locale || !isValidLocale(locale)) return raw;
	if (isExternalLike(raw)) return raw;

	const value = raw.startsWith('/') ? raw : `/${raw}`;
	if (!value.startsWith('/')) return raw;
	if (value === '/') return `/${locale}/`;

	const match = value.match(/^([^?#]*)([?#].*)?$/);
	const pathname = match?.[1] ?? value;
	const suffix = match?.[2] ?? '';
	const trailingSlash = pathname.endsWith('/');
	const segments = pathname.split('/').filter(Boolean);

	if (segments.length > 0 && isValidLocale(segments[0])) {
		segments[0] = locale;
	} else {
		segments.unshift(locale);
	}

	return `/${segments.join('/')}${trailingSlash ? '/' : ''}${suffix}`;
}
