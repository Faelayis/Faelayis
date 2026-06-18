<script lang="ts">
	import { revealOnView } from "$utils/anime";
	import { revealTitle, revealHint, revealMeta } from "$utils/reveal-presets";

	interface Props {
		role: string;
		location: string;
		longBio: string;
	}

	let { role, location, longBio }: Props = $props();
</script>

<section id="about" class="about">
	<div class="wrap">
		<h2 class="section-title" use:revealOnView={revealTitle}>About</h2>
		<p class="bio" use:revealOnView={revealHint}>{longBio}</p>
		<p class="meta-line" use:revealOnView={revealMeta}>{role} · {location}</p>
	</div>
</section>

<style>
	.about {
		padding-block: clamp(3rem, 6vw, 5rem);
		border-top: 1px solid var(--line);
	}
	.section-title {
		font-family: var(--font-display);
		font-size: clamp(1.4rem, 1.1rem + 1vw, 1.85rem);
		font-weight: 500;
		letter-spacing: -0.02em;
		margin-bottom: 1.5rem;
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
