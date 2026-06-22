<script lang="ts">
	import { revealOnView } from "$utils/anime";
	import { revealHint, revealMeta, revealTiltX } from "$utils/reveal-presets";

	interface Props {
		role: string;
		location: string;
		longBio: string;
	}

	let { role, location, longBio }: Props = $props();
</script>

<section id="about" class="about">
	<div class="wrap">
		<div class="title-3d">
			<h2 class="section-title" use:revealOnView={revealTiltX}>About</h2>
		</div>
		{#if longBio.trim()}
			<p class="bio" use:revealOnView={revealHint}>{longBio}</p>
		{/if}
		<p class="meta-line" use:revealOnView={revealMeta}>{role} · {location}</p>
	</div>
</section>

<style>
	.about {
		padding-block: clamp(3rem, 6vw, 5rem);
		border-top: 1px solid var(--line);
	}
	.title-3d {
		perspective: 900px;
		perspective-origin: 50% 100%;
		margin-bottom: 1.5rem;
	}
	.section-title {
		font-family: var(--font-display);
		font-size: clamp(1.4rem, 1.1rem + 1vw, 1.85rem);
		font-weight: 500;
		letter-spacing: -0.02em;
		transform-style: preserve-3d;
		transform-origin: bottom center;
		backface-visibility: hidden;
	}
	.bio {
		font-size: clamp(1rem, 0.95rem + 0.4vw, 1.15rem);
		line-height: 1.6;
		color: var(--ink-2);
		max-width: 60ch;
		margin-bottom: 1.5rem;
	}
	.meta-line {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--ink-muted);
	}
</style>
