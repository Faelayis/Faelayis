<script lang="ts">
	import { onMount } from "svelte";
	import { scroll } from "$utils/scroll.svelte";
	import { magnetic } from "$actions/magnetic";
	import { heroNavProgress, smoothstep } from "$utils/hero-nav.svelte";
	import { prefersReducedMotion } from "$utils/browser";
	import { scrollThenReplay } from "$utils/replay";

	const navItems = [
		{ href: "#part-of-work", label: "Work" },
		{ href: "#tech-skills", label: "Skill" },
		{ href: "#about", label: "About" },
		{ href: "#contact", label: "Contact" },
	];

	let navEl: HTMLElement | null = $state(null);
	let brandInnerEl: HTMLElement | null = $state(null);
	let navItemEls: (HTMLElement | null)[] = $state([null, null, null, null, null]);
	let indicatorEl: HTMLElement | null = $state(null);
	let indicatorStyle = $state({ left: "0px", width: "0px", opacity: 0 });

	function handleNavClick(event: MouseEvent): void {
		const anchor = event.currentTarget as HTMLAnchorElement | null;
		if (!anchor) return;
		scrollThenReplay(anchor.getAttribute("href") ?? "");
	}

	onMount(() => {
		scroll.start();
		return () => scroll.stop();
	});

	$effect(() => {
		const id = scroll.activeSection;
		if (!id) return;
		const index = navItems.findIndex((navItem) => navItem.href === `#${id}`);
		const navItem = navItemEls[index];
		if (!navItem) return;
		indicatorStyle = {
			left: `${navItem.offsetLeft}px`,
			width: `${navItem.offsetWidth}px`,
			opacity: 1,
		};
	});

	$effect(() => {
		if (!brandInnerEl) return;
		const scrollY = scroll.scrollY;
		const { easedProgress } = heroNavProgress(scrollY);
		if (prefersReducedMotion()) {
			brandInnerEl.style.opacity = scrollY > 80 ? "1" : "0";
			return;
		}
		brandInnerEl.style.opacity = String(smoothstep(0.5, 0.9, easedProgress));
	});
</script>

<header class="nav" class:scrolled={scroll.scrollY > 12} class:shrink={scroll.scrollY > 80}>
	<div class="wrap row" bind:this={navEl}>
		<span class="brand-mag" use:magnetic={{ strength: 0.4, range: 1.2 }}>
			<a href="#top" class="brand" onclick={handleNavClick}><span class="brand-inner" bind:this={brandInnerEl}>Faelayis</span></a>
		</span>
		<nav class="nav-items" aria-label="Primary">
			{#each navItems as navItem, index}
				<a
					href={navItem.href}
					bind:this={navItemEls[index]}
					class:active={scroll.activeSection === navItem.href.slice(1)}
					use:magnetic={{ strength: 0.3, range: 1.4 }}
					onclick={handleNavClick}
				>
					{navItem.label}
				</a>
			{/each}
			<span
				class="indicator"
				bind:this={indicatorEl}
				style="left: {indicatorStyle.left}; width: {indicatorStyle.width}; opacity: {indicatorStyle.opacity}"
				aria-hidden="true"
			></span>
		</nav>
	</div>
</header>

<style>
	.nav {
		position: fixed;
		inset: 0 0 auto 0;
		z-index: 50;
		padding-block: 1.1rem;
		background: color-mix(in oklch, var(--bg) 70%, transparent);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--line);
		transition:
			padding-block var(--duration-base) var(--easing-soft),
			background-color var(--duration-base) var(--easing-soft),
			border-color var(--duration-base) var(--easing-soft),
			box-shadow var(--duration-base) var(--easing-soft);
		will-change: padding-block, background-color;
	}
	.nav.shrink {
		padding-block: 0.5rem;
		background: color-mix(in oklch, var(--bg) 88%, transparent);
		border-bottom-color: var(--line-strong);
		box-shadow: 0 6px 24px -18px color-mix(in oklch, var(--ink) 60%, transparent);
	}
	.nav .row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1.5rem;
	}
	.brand-mag {
		display: inline-block;
		will-change: transform;
	}
	.brand {
		font-family: var(--font-display);
		font-size: 1.05rem;
		font-weight: 400;
		letter-spacing: -0.04em;
		line-height: 0.92;
		display: inline-block;
		transition: font-size var(--duration-base) var(--easing-soft);
	}
	.brand-inner {
		display: inline-block;
		opacity: 0;
		will-change: opacity;
	}
	.nav.shrink .brand {
		font-size: 0.95rem;
	}
	.nav .nav-items {
		position: relative;
		display: flex;
		gap: 1.25rem;
		font-size: 0.9rem;
		color: var(--ink-2);
		transition: font-size var(--duration-base) var(--easing-soft);
	}
	.nav.shrink .nav-items {
		font-size: 0.85rem;
	}
	.nav .nav-items a {
		position: relative;
		display: inline-block;
		padding-block: 0.15rem;
		color: var(--ink-2);
		transition: color var(--duration-fast) var(--easing-soft);
	}
	.nav .nav-items a.active {
		color: var(--ink);
	}
	.nav .nav-items a:hover {
		color: var(--ink);
	}
	.indicator {
		position: absolute;
		bottom: -4px;
		height: 1.5px;
		background: var(--accent);
		transform-origin: left center;
		transition:
			left 520ms var(--easing-soft),
			width 520ms var(--easing-soft),
			opacity 320ms var(--easing-soft);
		pointer-events: none;
		border-radius: 2px;
	}
	.indicator::after {
		content: "";
		position: absolute;
		inset: -3px 0;
		background: var(--accent);
		filter: blur(6px);
		opacity: 0.5;
		z-index: -1;
	}
	@media (max-width: 720px) {
		.nav .nav-items {
			gap: 0.9rem;
			font-size: 0.82rem;
		}
	}
	@media (max-width: 520px) {
		.nav .nav-items {
			gap: 0.7rem;
		}
	}
</style>
