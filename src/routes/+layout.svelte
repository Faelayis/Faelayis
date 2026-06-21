<script lang="ts">
	import "../app.css";
	import "$styles/fonts.css";
	import frauncesLatinUrl from "$lib/fonts/fraunces-latin.woff2?url";
	let { children } = $props();
</script>

<svelte:head>
	<link rel="preload" href={frauncesLatinUrl} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

{@render children()}
