<script lang="ts">
	import '@ergodot/ui-kit/styles.css';
	import favicon from "$lib/assets/favicon.svg";
    import { localeStore } from "$lib/stores/locale.store.js";
    import { isValidLocale } from "$lib/types/locale.type.js";
	//if its imported it will break the PrimaryNavigation and the footer CSS
	//import Footer from "$lib/components/Footer/Footer.svelte";
	import "../app.css";
	import "../lib/styles/event.css";
	import "../lib/styles/events.css";
	import "../lib/styles/registration.css";
	import { PrimaryNavigation, Section } from "@ergodot/ui-kit";

	let { data, children } = $props();

	const languages = [
		{ title: "EN", value: "en" },
		{ title: "HU", value: "hu" },
	];

	function onLanguageChange(item: { title: string; value?: string }) {
		const code = item.value ?? item.title.toLowerCase();
		if (!isValidLocale(code)) return;
		localeStore.set(code);
		location.href = `/${code}/`;
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<Section
	marginTop={false}
	marginBottom={false}
	padding="none"
	class="app-content-wrapper w-full"
>
	<PrimaryNavigation menuItems={data.menuItems} {onLanguageChange} {languages} sticky={true} />
</Section>
{@render children()}
