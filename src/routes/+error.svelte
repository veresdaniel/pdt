<script lang="ts">
	import { page } from '$app/state';
	import ErrorPage from '$lib/components/ErrorPage/ErrorPage.svelte';
	import {
		errorPageHomeHref,
		getErrorPageCopy,
		resolveErrorPageLocale
	} from '$lib/functions/errorPageContent';

	const locale = $derived(resolveErrorPageLocale(page.url.pathname));
	const copy = $derived(getErrorPageCopy(locale, page.status ?? 500));
	const homeHref = $derived(errorPageHomeHref(locale));
</script>

<ErrorPage
	status={page.status ?? 500}
	title={copy.title}
	message={page.status === 404 ? copy.message : (page.error?.message ?? copy.message)}
	{homeHref}
	homeLabel={copy.homeLabel}
	embedded
/>
