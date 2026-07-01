import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import {
	type LocaleCode,
	LOCALE_CODES,
	DEFAULT_LOCALE,
	isValidLocale
} from '$lib/types/locale.type';

const STORAGE_KEY = 'language';
const COOKIE_NAME = 'language';
const COOKIE_MAX_AGE_DAYS = 365;

export function getLocaleCookieName() {
	return COOKIE_NAME;
}

function getInitialLocale(): LocaleCode {
	if (!browser || typeof localStorage === 'undefined') {
		return DEFAULT_LOCALE;
	}
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored && isValidLocale(stored)) {
		return stored;
	}
	return DEFAULT_LOCALE;
}

function createLocaleStore() {
	const { subscribe, set, update } = writable<LocaleCode>(getInitialLocale());

	return {
		subscribe,
		set(value: LocaleCode) {
			if (LOCALE_CODES.includes(value)) {
				set(value);
			}
		},
		update
	};
}

export const localeStore = createLocaleStore();
export type { LocaleCode } from '$lib/types/locale.type';

if (browser) {
	localeStore.subscribe((value) => {
		localStorage.setItem(STORAGE_KEY, value);
		document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE_DAYS * 24 * 60 * 60}; SameSite=Lax`;
	});
}
