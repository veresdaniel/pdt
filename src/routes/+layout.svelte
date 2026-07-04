<script lang="ts">
	import '@ergodot/ui-kit/styles.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { get } from 'svelte/store';
	import { localeStore } from '$lib/stores/locale.store.js';
	import { DEFAULT_LOCALE, isValidLocale, type LocaleCode } from '$lib/types/locale.type.js';
	import Footer from '$lib/components/Footer/Footer.svelte';
	import '../app.css';
	import '../lib/styles/event.css';
	import '../lib/styles/events.css';
	import '../lib/styles/registration.css';
	import { PrimaryNavigation, Section } from '@ergodot/ui-kit';
	import { PUBLIC_ERGOMANIA_SITE_URL } from '$env/static/public';
	import ErgomaniaLogo from '$lib/assets/ergomania-bk.svg';
	import { translations, type Locale } from '$lib/i18n/i18n.js';
	import { createFormatMissing } from '$lib/functions/formatMissingTranslation';
	import { buildFooterData, buildFooterContactPersons } from '$lib/functions/common-content.mappers';
	import type { IndexedContentItem } from '$lib/functions/cms-content.helpers';

	let { data, children } = $props();

	const LOCALE_OPTIONS = [
		{ title: 'EN', value: 'en' },
		{ title: 'HU', value: 'hu' }
	] as const;

	function localeFromPath(pathname: string): LocaleCode | null {
		const langParam = (page.params as Record<string, string>)?.lang;
		if (langParam && isValidLocale(langParam)) return langParam;

		const firstSeg = pathname.split('/').filter(Boolean)[0];
		if (firstSeg && isValidLocale(firstSeg)) return firstSeg;

		return null;
	}

	const activeLocale = $derived.by((): LocaleCode => {
		const fromUrl = localeFromPath(page.url.pathname);
		if (fromUrl) return fromUrl;
		if (data?.locale && isValidLocale(data.locale)) return data.locale;
		return get(localeStore) ?? DEFAULT_LOCALE;
	});

	const formatMissing = $derived.by(() => createFormatMissing(activeLocale));
	const footerData = $derived.by(() => buildFooterData(data?.footerContent ?? null, formatMissing));
	const footerContactPersons = $derived.by(() =>
		buildFooterContactPersons(
			(data?.footerContactPersons ?? []) as IndexedContentItem[],
			formatMissing,
			activeLocale
		)
	);

	const languages = $derived.by(() => {
		const active = LOCALE_OPTIONS.find((item) => item.value === activeLocale);
		if (!active) return [...LOCALE_OPTIONS];
		return [active, ...LOCALE_OPTIONS.filter((item) => item.value !== activeLocale)];
	});

	const eventMegaMenuLabels = $derived.by(() => {
		const locale = (activeLocale === 'hu' ? 'hu' : 'en') as Locale;
		return {
			upcoming: translations[locale].nav.eventMenuUpcoming,
			past: translations[locale].nav.eventMenuPast
		};
	});

	const ergomaniaSiteBase = PUBLIC_ERGOMANIA_SITE_URL.replace(/\/$/, '');
	const logo = $derived.by(() => ({
		url: `${ergomaniaSiteBase}/${activeLocale}/`,
		imageUrl: ErgomaniaLogo
	}));

	function onLanguageChange(item: { title: string; value?: string }) {
		const code = item.value ?? item.title.toLowerCase();
		if (!isValidLocale(code)) return;
		localeStore.set(code);

		const segments = page.url.pathname.split('/').filter(Boolean);
		if (segments.length > 0 && isValidLocale(segments[0])) {
			segments[0] = code;
			location.href = `/${segments.join('/')}/`;
			return;
		}

		location.href = `/${code}/`;
	}

	$effect(() => {
		localeStore.set(activeLocale);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Section marginTop={false} marginBottom={false} padding="none" class="app-content-wrapper full-width max-lg:px-0! px-10!">
	<div class="section">
		<PrimaryNavigation
			menuItems={data.menuItems}
			{logo}
			{onLanguageChange}
			{languages}
			{eventMegaMenuLabels}
			sticky={true}
			fullWidthSticky={true}
			layoutBoundary={{ maxWidth: '1770px', paddingInline: '2.5rem' }}
		/>
	</div>
</Section>

<main class="flex-1 w-full">
	{@render children?.()}
</main>

<Footer {footerData} contactPersons={footerContactPersons} ergomaniaSiteBase={ergomaniaSiteBase} locale={activeLocale} />
