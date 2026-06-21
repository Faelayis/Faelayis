<script lang="ts">
	import { onMount } from "svelte";
	import { animate } from "animejs";
	import { scroll } from "$utils/scroll.svelte";
	import { prefersReducedMotion } from "$utils/browser";
	import { heroNavProgress, smoothstep, easeInOutCubic } from "$utils/hero-nav.svelte";
	import { scrambleText } from "$utils/scramble";

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
	let heroHeight = $state(0);
	let measured = $state(false);

	let nameTiltEl: HTMLElement | null = $state(null);
	let tiltRAF: number | null = null;
	let tiltActive = false;

	let brandInnerEl: HTMLElement | null = null;
	let resizeRAF: number | null = null;

	function measureHero(): void {
		if (!heroNameEl) return;
		const rect = heroNameEl.getBoundingClientRect();
		heroLeft = rect.left;
		heroDocTop = rect.top + window.scrollY;
		heroHeight = rect.height;
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

	const tiltHandlers: {
		move: (event: PointerEvent) => void;
		leave: (event: PointerEvent) => void;
	} = {
		move: () => {},
		leave: () => {},
	};

	function handleNameCharSettle(_i: number, el: HTMLSpanElement, _ch: string): void {
		animate(el, {
			opacity: [0, 1],
			translateY: [40, 0],
			rotateX: [-86, 0],
			duration: 1100,
			ease: "out(4)",
		});
	}

	onMount(() => {
		const reduceMotion = prefersReducedMotion();

		scroll.start();

		const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
		if (nameTiltEl && finePointer && !reduceMotion) {
			tiltActive = true;
			tiltHandlers.move = (event: PointerEvent) => {
				if (!tiltActive || !nameTiltEl) return;
				const rect = nameTiltEl.getBoundingClientRect();
				if (rect.bottom < 0 || rect.top > window.innerHeight) return;
				const rawX = (event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
				const rawY = (event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
				const pointerXRatio = Math.max(-0.5, Math.min(0.5, rawX));
				const pointerYRatio = Math.max(-0.5, Math.min(0.5, rawY));
				if (tiltRAF !== null) return;
				tiltRAF = requestAnimationFrame(() => {
					tiltRAF = null;
					if (!nameTiltEl) return;
					const rotateXDeg = (-pointerYRatio * 18).toFixed(2);
					const rotateYDeg = (pointerXRatio * 26).toFixed(2);
					nameTiltEl.style.transform = `rotateX(${rotateXDeg}deg) rotateY(${rotateYDeg}deg)`;
				});
			};
			tiltHandlers.leave = (event: PointerEvent) => {
				if (event.relatedTarget !== null) return;
				if (tiltRAF !== null) {
					cancelAnimationFrame(tiltRAF);
					tiltRAF = null;
				}
				if (!nameTiltEl) return;
				nameTiltEl.style.transform = "rotateX(0deg) rotateY(0deg)";
			};
			window.addEventListener("pointermove", tiltHandlers.move, { passive: true });
			window.addEventListener("pointerout", tiltHandlers.leave, { passive: true });
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
			if (tiltRAF !== null) cancelAnimationFrame(tiltRAF);
			window.removeEventListener("pointermove", tiltHandlers.move);
			window.removeEventListener("pointerout", tiltHandlers.leave);
		};
	});

	$effect(() => {
		if (!heroNameEl) return;
		const scrollY = scroll.scrollY;
		const { easedProgress } = heroNavProgress(scrollY);

		if (easedProgress > 0.02 && tiltActive) {
			tiltActive = false;
			if (tiltRAF !== null) {
				cancelAnimationFrame(tiltRAF);
				tiltRAF = null;
			}
			if (nameTiltEl) nameTiltEl.style.transform = "rotateX(0deg) rotateY(0deg)";
		}

		if (prefersReducedMotion() || !measured) {
			heroNameEl.style.opacity = scrollY > 80 ? "0" : "1";
			heroNameEl.style.transform = "";
			return;
		}

		const brand = getBrandInner();
		if (!brand) return;
		const brandRect = brand.getBoundingClientRect();

		const deltaX = brandRect.left - heroLeft;
		const deltaY = brandRect.top - heroDocTop;
		const brandScale = brandRect.height / Math.max(heroHeight, 1);

		const transitionProgress = easeInOutCubic(easedProgress);
		const translateX = deltaX * transitionProgress;
		const translateY = deltaY * transitionProgress + scrollY;
		const scale = 1 + (brandScale - 1) * transitionProgress;

		heroNameEl.style.transformOrigin = "top left";
		heroNameEl.style.transform = `translate3d(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
		heroNameEl.style.opacity = String(1 - smoothstep(0.55, 0.95, easedProgress));

		const velocityFactor = Math.min(1, Math.max(0, scroll.velocity) * 1.6) * (1 - easedProgress);
		heroNameEl.style.setProperty("--v", String(velocityFactor));
	});
</script>

<section id="top" class="hero">
	<div class="wrap">
		<p class="meta" use:scrambleText={{ speed: 18, settleDelay: 10, settleDuration: 240 }}>{handle} — {role}, {location}</p>
		<div class="name-tilt" bind:this={nameTiltEl}>
			<h1
				class="name"
				bind:this={heroNameEl}
				use:scrambleText={{ speed: 24, settleDelay: 90, settleDuration: 360, charClass: "hero-char", onCharSettle: handleNameCharSettle }}
			>
				{name}
			</h1>
		</div>
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
	.name-tilt {
		width: fit-content;
		margin-bottom: 2rem;
		perspective: 1000px;
		perspective-origin: 50% 60%;
		transform-style: preserve-3d;
		will-change: transform;
	}
	.name {
		font-family: var(--font-display);
		font-size: clamp(3.5rem, 2.2rem + 8vw, 8rem);
		font-weight: 400;
		line-height: 0.92;
		letter-spacing: -0.04em;
		margin: 0;
		position: relative;
		z-index: 55;
		width: fit-content;
		transform-origin: top left;
		pointer-events: none;
		will-change: transform, opacity, filter;
		filter: blur(calc(var(--v, 0) * 2.5px));
		perspective: 1100px;
		perspective-origin: 50% 100%;
		transform-style: preserve-3d;
	}
	:global(.hero-char) {
		display: inline-block;
		will-change: transform, opacity;
		transform-style: preserve-3d;
		backface-visibility: hidden;
		transform-origin: bottom center;
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
		.name-tilt {
			transform: none !important;
		}
	}
	@media (hover: none), (pointer: coarse) {
		.name-tilt {
			transform: none !important;
		}
	}
</style>
