import { locales, type Locale } from '$lib/i18n/i18n';
import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string): param is Locale => {
	return !!locales.find(locale => param === locale);
}) satisfies ParamMatcher;