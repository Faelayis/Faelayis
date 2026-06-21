<script lang="ts">
	import { revealOnView, inView } from "$utils/anime";
	import { revealTitle, revealHint } from "$utils/reveal-presets";
	import { FRAMEWORKS } from "$data/tech/frameworks";
	import { TOOLS } from "$data/tech/tools";
	import { LANGUAGES } from "$data/tech/languages";
	import { slugify } from "$utils/text";
	import type { RenderedTechItem, ResolvedIcon } from "$types/icons";
	import type { TechItem } from "$types/data/tech/types";

	function toRenderedItem(item: TechItem): RenderedTechItem {
		const ic = item.icon;
		const icon: ResolvedIcon | null = ic ? { title: item.name, slug: ic.slug, hex: ic.hex, path: ic.path, svg: "", source: "" } : null;
		const slug = ic?.slug ?? slugify(item.name);
		return { name: item.name, slug, percent: 0, totalSeconds: 0, icon };
	}

	const languageSkills: RenderedTechItem[] = $derived(dedupeBySlug(LANGUAGES.map(toRenderedItem)));
	const frameworkSkills: RenderedTechItem[] = $derived(dedupeBySlug(FRAMEWORKS.map(toRenderedItem)));
	const toolSkills: RenderedTechItem[] = $derived(dedupeBySlug(TOOLS.map(toRenderedItem)));

	function dedupeBySlug(items: RenderedTechItem[]): RenderedTechItem[] {
		const seen = new Set<string>();
		const out: RenderedTechItem[] = [];
		for (const item of items) {
			if (seen.has(item.slug)) continue;
			seen.add(item.slug);
			out.push(item);
		}
		return out;
	}
</script>

<section id="tech-skills" class="tech-skills">
	<div class="wrap">
		<header class="head section-head" use:inView>
			<h2 class="section-title" use:revealOnView={revealTitle}>Tech Skills</h2>
			<p class="hint" use:revealOnView={revealHint}>Languages, frameworks, and tools I work with.</p>
		</header>

		<div class="categories" use:inView>
			{#if languageSkills.length}
				<div class="category">
					<h3 class="category-label">Languages</h3>
					<ul class="items">
						{#each languageSkills as languageSkill, index (languageSkill.slug)}
							{#if languageSkill.icon}
								<li class="item" style="--i: {index}">
									<svg class="item-icon" viewBox="0 0 24 24" width="16" height="16" fill="#{languageSkill.icon.hex}" aria-hidden="true">
										<path d={languageSkill.icon.path} />
									</svg>
									<span class="item-name">{languageSkill.name}</span>
								</li>
							{:else}
								<li class="item item-bare" style="--i: {index}">
									<span class="item-name">{languageSkill.name}</span>
								</li>
							{/if}
						{/each}
					</ul>
				</div>
			{/if}

			<div class="category">
				<h3 class="category-label">Frameworks</h3>
				<ul class="items">
					{#each frameworkSkills as frameworkSkill, index (frameworkSkill.slug)}
						{#if frameworkSkill.icon}
							<li class="item" style="--i: {index}">
								<svg class="item-icon" viewBox="0 0 24 24" width="16" height="16" fill="#{frameworkSkill.icon.hex}" aria-hidden="true">
									<path d={frameworkSkill.icon.path} />
								</svg>
								<span class="item-name">{frameworkSkill.name}</span>
							</li>
						{:else}
							<li class="item item-bare" style="--i: {index}">
								<span class="item-name">{frameworkSkill.name}</span>
							</li>
						{/if}
					{/each}
				</ul>
			</div>

			<div class="category">
				<h3 class="category-label">Tools</h3>
				<ul class="items">
					{#each toolSkills as toolSkill, index (toolSkill.slug)}
						{#if toolSkill.icon}
							<li class="item" style="--i: {index}">
								<svg class="item-icon" viewBox="0 0 24 24" width="16" height="16" fill="#{toolSkill.icon.hex}" aria-hidden="true">
									<path d={toolSkill.icon.path} />
								</svg>
								<span class="item-name">{toolSkill.name}</span>
							</li>
						{:else}
							<li class="item item-bare" style="--i: {index}">
								<span class="item-name">{toolSkill.name}</span>
							</li>
						{/if}
					{/each}
				</ul>
			</div>
		</div>
	</div>
</section>

<style>
	.tech-skills {
		padding-block: clamp(3rem, 6vw, 5rem);
		border-top: 1px solid var(--line);
	}
	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1.5rem;
		flex-wrap: wrap;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--line);
	}
	.section-title {
		font-family: var(--font-display);
		font-size: clamp(1.4rem, 1.1rem + 1vw, 1.85rem);
		font-weight: 500;
		letter-spacing: -0.02em;
		margin-bottom: 1.5rem;
	}
	.head .section-title {
		margin-bottom: 0;
	}
	.hint {
		font-size: 0.9rem;
		color: var(--ink-muted);
	}

	.categories {
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
	}
	.category {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}
	.category-label {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: var(--ink-muted);
		font-weight: 500;
	}
	.items {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}
	.item {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.45rem 0.9rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--bg);
		font-size: 0.85rem;
		color: var(--ink-2);
		white-space: nowrap;
		transition:
			color var(--duration-fast) var(--easing-soft),
			border-color var(--duration-fast) var(--easing-soft),
			background var(--duration-fast) var(--easing-soft),
			transform var(--duration-fast) var(--easing-out);
		opacity: 0;
		transform: translateY(-14px);
	}
	.item-bare {
		padding-left: 0.9rem;
	}
	.item:hover {
		color: var(--ink);
		border-color: var(--ink);
		background: var(--bg-elev);
		transform: translateY(-1px);
	}
	.categories:global(.in) .item {
		animation: item-in 560ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
		animation-delay: calc(var(--i) * 30ms);
	}
	@keyframes item-in {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.item {
			opacity: 1;
			transform: none;
			animation: none;
		}
	}
	.item-icon {
		flex-shrink: 0;
		display: inline-block;
	}
</style>
