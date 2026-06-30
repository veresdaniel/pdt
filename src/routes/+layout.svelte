<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
  	import '../app.css';
	import '../lib/styles/event.css';
	import '../lib/styles/events.css';
	import '../lib/styles/registration.css';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
