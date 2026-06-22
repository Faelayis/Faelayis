<script lang="ts">
	import { onMount } from "svelte";
	import { scroll } from "$utils/scroll.svelte";

	onMount(() => {
		scroll.start();
		return () => scroll.stop();
	});
</script>

<div class="track" aria-hidden="true">
	<div class="bar" style="transform: scaleX({scroll.scrollProgress})"></div>
	<div
		class="head"
		style="--v: {Math.min(1, Math.abs(scroll.velocity) * 1.4)}; transform: translate3d({scroll.scrollProgress *
			100}vw, 0, 0) translateX(-50%) scale(calc(1 + var(--v, 0) * 0.9))"
	></div>
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
		left: 0;
		width: 14px;
		height: 8px;
		border-radius: 999px;
		background: var(--accent);
		filter: blur(4px);
		opacity: calc(0.5 + var(--v, 0) * 0.5);
		mix-blend-mode: plus-lighter;
		will-change: transform, opacity;
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
