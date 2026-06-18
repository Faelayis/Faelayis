<script lang="ts">
	import { onMount } from "svelte";
	import { animate, splitText, stagger } from "animejs";
	import { scroll } from "$utils/scroll.svelte";
	import { prefersReducedMotion } from "$utils/browser";
	import { heroNavProgress } from "$utils/hero-nav.svelte";

	interface Props {
		name: string;
		handle: string;
		role: string;
		location: string;
		bio: string;
	}

	let { name, role, handle, location, bio }: Props = $props();

	let heroNameEl: HTMLElement | null = $state(null);

	onMount(() => {
		const reduceMotion = prefersReducedMotion();

		scroll.start();

		if (heroNameEl && !reduceMotion) {
			const splitter = splitText(heroNameEl, {
				chars: { class: "hero-char" },
				includeSpaces: true,
			});
			animate(splitter.chars, {
				opacity: [0, 1],
				translateY: [28, 0],
				rotateZ: [4, 0],
				duration: 1000,
				delay: stagger(42),
				ease: "out(3)",
			});
		}

		return () => scroll.stop();
	});

	$effect(() => {
		if (!heroNameEl) return;
		const y = scroll.scrollY;
		const { e } = heroNavProgress(y);

		if (prefersReducedMotion()) {
			heroNameEl.style.opacity = String(y > 80 ? 0 : 1);
			heroNameEl.style.transform = "";
			return;
		}

		const ty = -48 * e;
		const s = 1 - 0.16 * e;
		heroNameEl.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0) scale(${s.toFixed(3)})`;
		heroNameEl.style.opacity = String(1 - e);
		heroNameEl.style.transformOrigin = "left center";

		const v = Math.min(1, Math.max(0, scroll.velocity) * 1.6);
		heroNameEl.style.setProperty("--v", String(v));
	});
</script>

<section id="top" class="hero">
	<div class="wrap">
		<p class="meta">{handle} — {role}, {location}</p>
		<h1 class="name" bind:this={heroNameEl}>{name}</h1>
		<p class="bio hero-bio">{bio}</p>
	</div>
</section>

<style>
	.hero {
		padding-block: clamp(7rem, 14vw, 11rem) clamp(3rem, 6vw, 5rem);
	}
	.meta {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		letter-spacing: 0.06em;
		color: var(--ink-muted);
		margin-bottom: 1.5rem;
	}
	.name {
		font-family: var(--font-display);
		font-size: clamp(3.5rem, 2.2rem + 8vw, 8rem);
		font-weight: 400;
		line-height: 0.92;
		letter-spacing: -0.04em;
		margin-bottom: 2rem;
		will-change: transform, opacity, filter;
		filter: blur(calc(var(--v, 0) * 2.5px));
		transition: filter 320ms var(--easing-soft);
	}
	:global(.hero-char) {
		display: inline-block;
		will-change: transform, opacity;
	}
	.hero-bio {
		font-size: clamp(1rem, 0.9rem + 0.5vw, 1.2rem);
		line-height: 1.5;
		color: var(--ink-2);
		max-width: 36ch;
	}
</style>
