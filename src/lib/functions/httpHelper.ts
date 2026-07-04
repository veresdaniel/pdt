import type { LocaleCode } from '$lib/types/locale.type';
import { DEFAULT_LOCALE } from '$lib/types/locale.type';

export const createHeadersWithAuthorization = (
	currentLanguage: LocaleCode = DEFAULT_LOCALE,
	sendContentType = true
) => {
	const headers = new Headers();
	if (sendContentType) {
		headers.append('Content-Type', 'application/json');
	}
	headers.append('x-language', currentLanguage);
	return headers;
};
