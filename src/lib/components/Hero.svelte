<script lang="ts">
	import { onMount } from "svelte";
	import { animate, splitText, stagger } from "animejs";
	import { scroll } from "$utils/scroll.svelte";
	import { prefersReducedMotion } from "$utils/browser";
	import { heroNavProgress, smoothstep, easeInOutCubic } from "$utils/hero-nav.svelte";

	interface Props {
		name: string;
		handle: string;
		role: string;
		location: string;
		bio: string;
	}

	let { name, role, handle, location, bio }: Props = $props();

	let heroNameEl: HTMLElement | null = $state(null);
	let heroLeft = $state(0);
	let heroDocTop = $state(0);
	let heroH = $state(0);
	let measured = $state(false);

	let brandInnerEl: HTMLElement | null = null;
	let resizeRAF: number | null = null;

	function measureHero(): void {
		if (!heroNameEl) return;
		const rect = heroNameEl.getBoundingClientRect();
		heroLeft = rect.left;
		heroDocTop = rect.top + window.scrollY;
		heroH = rect.height;
		measured = true;
	}

	function getBrandInner(): HTMLElement | null {
		if (!brandInnerEl || !brandInnerEl.isConnected) {
			brandInnerEl = document.querySelector<HTMLElement>(".brand-inner");
		}
		return brandInnerEl;
	}

	function onResize(): void {
		if (resizeRAF !== null) return;
		resizeRAF = requestAnimationFrame(() => {
			resizeRAF = null;
			measureHero();
		});
	}

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

		measureHero();
		requestAnimationFrame(measureHero);
		setTimeout(measureHero, 50);
		setTimeout(measureHero, 200);
		if (document.fonts?.ready) document.fonts.ready.then(measureHero).catch(() => {});
		window.addEventListener("resize", onResize, { passive: true });
		window.addEventListener("orientationchange", onResize, { passive: true });

		return () => {
			scroll.stop();
			window.removeEventListener("resize", onResize);
			window.removeEventListener("orientationchange", onResize);
			if (resizeRAF !== null) cancelAnimationFrame(resizeRAF);
		};
	});

	$effect(() => {
		if (!heroNameEl) return;
		const y = scroll.scrollY;
		const { e } = heroNavProgress(y);

		if (prefersReducedMotion() || !measured) {
			heroNameEl.style.opacity = y > 80 ? "0" : "1";
			heroNameEl.style.transform = "";
			return;
		}

		const brand = getBrandInner();
		if (!brand) return;
		const brandRect = brand.getBoundingClientRect();

		const dx = brandRect.left - heroLeft;
		const dy = brandRect.top - heroDocTop;
		const s = brandRect.height / Math.max(heroH, 1);

		const tp = easeInOutCubic(e);
		const tx = dx * tp;
		const ty = dy * tp + y;
		const sc = 1 + (s - 1) * tp;

		heroNameEl.style.transformOrigin = "top left";
		heroNameEl.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${sc.toFixed(4)})`;
		heroNameEl.style.opacity = String(1 - smoothstep(0.55, 0.95, e));

		const v = Math.min(1, Math.max(0, scroll.velocity) * 1.6) * (1 - e);
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
		position: relative;
		z-index: 55;
		width: fit-content;
		transform-origin: top left;
		pointer-events: none;
		will-change: transform, opacity, filter;
		filter: blur(calc(var(--v, 0) * 2.5px));
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
	@media (max-width: 720px) {
		.hero {
			padding-block: clamp(6rem, 18vw, 9rem) clamp(2.5rem, 8vw, 4rem);
		}
		.name {
			filter: blur(calc(var(--v, 0) * 1.5px));
		}
	}
	@media (max-width: 380px) {
		.name {
			font-size: clamp(2.8rem, 14vw, 3.5rem);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.name {
			filter: none;
		}
	}
</style>
