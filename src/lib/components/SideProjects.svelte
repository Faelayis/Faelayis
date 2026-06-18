<script lang="ts">
	import { revealOnView, inView } from "$utils/anime";
	import { revealTitle, revealHint } from "$utils/reveal-presets";
	import { prettify } from "$utils/text";
	import { languageColor } from "$utils/format";

	interface SideProject {
		id: string;
		name: string;
		url: string;
		image: string | null;
		createdAt: string;
		topics: string[];
		primaryLanguage: { name: string; color?: string | null } | null;
		stargazerCount: number;
		isArchived: boolean;
		pushedAt: string;
	}

	interface Props {
		sideProjects: SideProject[];
		error: string | null;
		githubUsername: string;
	}

	let { sideProjects, error, githubUsername }: Props = $props();

	const INITIAL_VISIBLE = 9;
	let expanded = $state(false);

	const visibleProjects = $derived(expanded ? sideProjects : sideProjects.slice(0, INITIAL_VISIBLE));
	const hiddenCount = $derived(Math.max(0, sideProjects.length - INITIAL_VISIBLE));
	const canToggle = $derived(sideProjects.length > INITIAL_VISIBLE);

	function updatedLabel(project: SideProject): string {
		const createdYear = new Date(project.createdAt).getFullYear();
		const pushedDate = new Date(project.pushedAt);
		const pushedYear = pushedDate.getFullYear();
		if (pushedYear === createdYear) {
			return `Updated ${pushedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
		}
		return `Updated ${pushedDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}`;
	}
</script>

<section id="side-projects" class="side-projects">
	<div class="wrap">
		<header class="head section-head" use:inView>
			<h2 class="section-title" use:revealOnView={revealTitle}>
				Side Projects<span class="badge-soft">(Public)</span>
			</h2>
			<p class="hint" use:revealOnView={revealHint}>
				Nine things I've built. The rest lives on
				<a href="https://github.com/{githubUsername}" target="_blank" rel="noopener" class="ulink">GitHub</a>.
			</p>
		</header>

		{#if error}
			<p class="empty">Couldn't load projects: {error}</p>
		{:else if sideProjects.length === 0}
			<p class="empty">No projects to show yet.</p>
		{:else}
			<ol class="grid" use:inView>
				{#each visibleProjects as sideProject, index (sideProject.id)}
					<li class="cell" style="--i: {index}">
						<a
							class="cell-link"
							href={sideProject.url}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={prettify(sideProject.name)}
							data-cursor="View"
						>
							<span class="num-row">
								<span class="num">{String(index + 1).padStart(2, "0")}</span>
								{#if sideProject.isArchived}
									<span class="archive">
										<svg class="archive-icon" viewBox="0 0 24 24" width="11" height="11" aria-hidden="true">
											<path d="M3 4h18v3H3V4zm1 5h16v11H4V9zm5 2v2h6v-2H9z" fill="currentColor" />
										</svg>
									</span>
								{/if}
								<span class="updated-date">
									{updatedLabel(sideProject)}
								</span>
							</span>
							<h3 class="name">{prettify(sideProject.name)}</h3>
							<div class="meta">
								{#if sideProject.primaryLanguage}
									<span class="lang">
										<span
											class="dot"
											style="background: {sideProject.primaryLanguage.color || languageColor(sideProject.primaryLanguage.name)}"
										></span>
										{sideProject.primaryLanguage.name}
									</span>
								{/if}
								<span class="year-row">
									<span class="created-label">Created</span>
									<span class="year">{new Date(sideProject.createdAt).getFullYear()}</span>
								</span>
							</div>
							{#if sideProject.stargazerCount > 0}
								<span class="stars" title="{sideProject.stargazerCount} star{sideProject.stargazerCount === 1 ? '' : 's'} on GitHub">
									<svg class="star-icon" viewBox="0 0 24 24" width="11" height="11" aria-hidden="true">
										<path d="M12 2.5l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 18.9 5.9 21.1l1.4-6.8L2.2 9.6l6.9-.8z" fill="currentColor" />
									</svg>
									{sideProject.stargazerCount}
								</span>
							{/if}
							<span class="arrow" aria-hidden="true">↗</span>
						</a>
					</li>
				{/each}
			</ol>

			{#if canToggle}
				<div class="actions" use:inView>
					<button
						type="button"
						class="toggle"
						aria-expanded={expanded}
						aria-controls="side-projects-grid"
						onclick={() => (expanded = !expanded)}
					>
						<span class="toggle-rule" aria-hidden="true"></span>
						<span class="toggle-label">
							{expanded ? "Show less" : `Show ${hiddenCount} more`}
						</span>
						<span class="toggle-arrow" class:up={expanded} aria-hidden="true">↓</span>
					</button>
				</div>
			{/if}
		{/if}
	</div>
</section>

<style>
	.side-projects {
		padding-block: clamp(3rem, 6vw, 5rem);
		border-top: 1px solid var(--line);
	}
	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1.5rem;
		flex-wrap: wrap;
		margin-bottom: 2rem;
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
	.badge-soft {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--ink-muted);
		opacity: 0.6;
		margin-left: 0.35rem;
	}
	.empty {
		color: var(--ink-muted);
		font-size: 0.95rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
	}
	@media (max-width: 820px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (max-width: 520px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}

	.cell {
		border: 1px solid var(--line);
		background: var(--bg);
		transition: background 240ms var(--easing-soft);
		opacity: 0;
		transform: translateY(12px);
	}
	.grid:global(.in) .cell {
		animation: cell-in 380ms var(--easing-soft) forwards;
		animation-delay: calc(var(--i) * 45ms);
	}
	@keyframes cell-in {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.cell:hover,
	.cell:active,
	.cell:focus-within {
		background: var(--bg-elev);
	}
	.cell-link {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1.25rem 1.35rem;
		min-height: 150px;
	}
	.num {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.16em;
		color: var(--ink-muted);
	}
	.name {
		font-family: var(--font-display);
		font-size: clamp(1.1rem, 0.95rem + 0.5vw, 1.35rem);
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1.2;
		flex: 1;
	}
	.meta {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--ink-muted);
	}
	.lang {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		flex-shrink: 0;
	}
	.num-row {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		flex-wrap: wrap;
	}
	.stars {
		position: absolute;
		top: 1.15rem;
		right: 1.25rem;
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		color: var(--ink-2);
		font-family: var(--font-mono);
		font-size: 0.7rem;
		opacity: 0.85;
		transition:
			color 240ms var(--easing-soft),
			opacity 240ms var(--easing-soft);
	}
	.star-icon {
		color: oklch(82% 0.17 88);
		flex-shrink: 0;
	}
	.archive {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		color: var(--ink-2);
		font-family: var(--font-mono);
		font-size: 0.7rem;
		opacity: 0.8;
		transition:
			color 240ms var(--easing-soft),
			opacity 240ms var(--easing-soft);
	}
	.archive-icon {
		color: oklch(72% 0.13 65);
		flex-shrink: 0;
	}
	.updated-date {
		opacity: 0;
		max-width: 0;
		overflow: hidden;
		white-space: nowrap;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--ink-2);
		transition:
			opacity 240ms var(--easing-soft),
			max-width 320ms var(--easing-soft);
	}
	.year-row {
		display: inline-flex;
		align-items: center;
		gap: 0;
		flex-shrink: 0;
		margin-left: auto;
	}
	.created-label {
		opacity: 0;
		max-width: 0;
		overflow: hidden;
		white-space: nowrap;
		font: inherit;
		color: var(--ink-2);
		transition:
			opacity 240ms var(--easing-soft),
			max-width 320ms var(--easing-soft),
			margin-right 320ms var(--easing-soft);
	}
	.cell:hover .archive,
	.cell:active .archive,
	.cell:focus-within .archive {
		color: var(--ink);
		opacity: 1;
	}
	.cell:hover .updated-date,
	.cell:active .updated-date,
	.cell:focus-within .updated-date {
		opacity: 0.75;
		max-width: 24ch;
	}
	.cell:hover .created-label,
	.cell:active .created-label,
	.cell:focus-within .created-label {
		opacity: 0.75;
		max-width: 8ch;
		margin-right: 0.4rem;
	}
	@media (hover: none) {
		.cell .updated-date,
		.cell .created-label {
			transition-duration: 180ms;
		}
	}
	.cell:hover .stars,
	.cell:active .stars,
	.cell:focus-within .stars {
		opacity: 0;
	}
	.year {
		flex-shrink: 0;
	}
	.arrow {
		position: absolute;
		top: 1.15rem;
		right: 1.25rem;
		color: var(--ink-2);
		opacity: 0;
		transform: translate(-3px, 3px);
		transition:
			opacity 240ms var(--easing-soft),
			transform 240ms var(--easing-soft);
		font-size: 0.95rem;
	}
	.cell:hover .arrow,
	.cell:active .arrow,
	.cell:focus-within .arrow {
		opacity: 1;
		transform: translate(0, 0);
	}

	.actions {
		display: flex;
		justify-content: center;
		margin-top: 2rem;
	}
	.toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.85rem;
		padding: 0.7rem 1.1rem;
		background: transparent;
		border: 1px solid var(--line);
		color: var(--ink-2);
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		cursor: pointer;
		transition:
			color 240ms var(--easing-soft),
			border-color 240ms var(--easing-soft),
			background 240ms var(--easing-soft);
	}
	.toggle:hover {
		color: var(--ink);
		border-color: var(--line-strong);
		background: var(--bg-elev);
	}
	.toggle:focus-visible {
		outline: 1px solid var(--accent);
		outline-offset: 3px;
	}
	.toggle-rule {
		display: inline-block;
		width: 24px;
		height: 1px;
		background: currentColor;
		opacity: 0.4;
		transition:
			width 320ms var(--easing-soft),
			opacity 240ms var(--easing-soft);
	}
	.toggle:hover .toggle-rule {
		width: 40px;
		opacity: 0.8;
	}
	.toggle-arrow {
		display: inline-block;
		font-size: 0.85rem;
		line-height: 1;
		transition: transform 360ms var(--easing-soft);
	}
	.toggle-arrow.up {
		transform: rotate(180deg);
	}
</style>
