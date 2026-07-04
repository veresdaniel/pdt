import { isValidLocale, type LocaleCode } from '$lib/types/locale.type';

type ErrorCopy = {
	title404: string;
	titleGeneric: string;
	message404: string;
	messageGeneric: string;
	homeLabel: string;
};

const COPY: Record<'en' | 'hu', ErrorCopy> = {
	en: {
		title404: 'Page not found',
		titleGeneric: 'Something went wrong',
		message404: 'The page you are looking for may have been moved, removed, or never existed.',
		messageGeneric: 'An unexpected error occurred. Please try again or return to the events page.',
		homeLabel: 'Back to events'
	},
	hu: {
		title404: 'Az oldal nem található',
		titleGeneric: 'Valami hiba történt',
		message404: 'A keresett oldal áthelyezésre került, törölve lett, vagy soha nem létezett.',
		messageGeneric: 'Váratlan hiba történt. Próbáld újra, vagy térj vissza az eseményekhez.',
		homeLabel: 'Vissza az eseményekhez'
	}
};

export function resolveErrorPageLocale(pathname: string): 'en' | 'hu' {
	const firstSegment = pathname.split('/').filter(Boolean)[0];
	if (firstSegment === 'hu') return 'hu';
	return 'en';
}

export function getErrorPageCopy(
	locale: 'en' | 'hu',
	status: number
): {
	title: string;
	message: string;
	homeLabel: string;
} {
	const copy = COPY[locale] ?? COPY.en;
	const is404 = status === 404;

	return {
		title: is404 ? copy.title404 : copy.titleGeneric,
		message: is404 ? copy.message404 : copy.messageGeneric,
		homeLabel: copy.homeLabel
	};
}

export function errorPageHomeHref(locale: 'en' | 'hu'): string {
	return `/${locale}/events/`;
}
