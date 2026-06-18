<script lang="ts">
	import { onMount } from "svelte";
	import { scroll } from "$utils/scroll.svelte";
	import { prefersReducedMotion } from "$utils/browser";

	let headEl: HTMLElement | null = $state(null);

	const reduce = prefersReducedMotion();

	onMount(() => {
		scroll.start();
		return () => scroll.stop();
	});
</script>

<div class="track" aria-hidden="true">
	<div class="bar" style="transform: scaleX({scroll.scrollProgress})"></div>
	<div class="head" bind:this={headEl} style="left: {scroll.scrollProgress * 100}%; --v: {Math.min(1, Math.abs(scroll.velocity) * 1.4)}"></div>
</div>

<style>
	.track {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		z-index: 60;
		pointer-events: none;
		background: color-mix(in oklch, var(--ink) 6%, transparent);
	}
	.bar {
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, var(--accent), color-mix(in oklch, var(--accent) 55%, var(--ink)));
		transform-origin: left center;
		transform: scaleX(0);
		will-change: transform;
	}
	.head {
		position: absolute;
		top: -3px;
		width: 14px;
		height: 8px;
		margin-left: -7px;
		border-radius: 999px;
		background: var(--accent);
		filter: blur(4px);
		opacity: calc(0.5 + var(--v, 0) * 0.5);
		transform: scale(calc(1 + var(--v, 0) * 0.9));
		mix-blend-mode: plus-lighter;
		will-change: transform, opacity, left;
		pointer-events: none;
	}
	:global([data-theme="dark"]) .head,
	:global(:root:not([data-theme])) .head {
		mix-blend-mode: screen;
	}
	@media (prefers-reduced-motion: reduce) {
		.head {
			display: none;
		}
	}
</style>
