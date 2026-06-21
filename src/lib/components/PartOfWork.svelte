<script lang="ts">
	import { revealOnView, inView } from "$utils/anime";
	import { revealTitle, revealHint } from "$utils/reveal-presets";
	import type { PartOfWorkItem } from "$types/data/part-of-work";

	interface Props {
		partOfWork: PartOfWorkItem[];
	}

	let { partOfWork }: Props = $props();

	const isActive = (item: PartOfWorkItem) => item.end.trim().toLowerCase() === "present";
	const startYear = (item: PartOfWorkItem) => item.start.trim();

	function tiltEntry(node: HTMLElement): { destroy: () => void } {
		if (typeof window === "undefined") return { destroy: () => {} };
		const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (!finePointer || reduceMotion) return { destroy: () => {} };

		const mark = node.querySelector<HTMLElement>(".entry-mark");
		const name = node.querySelector<HTMLElement>(".entry-name");
		const arrow = node.querySelector<HTMLElement>(".arrow");
		let rafId: number | null = null;

		function onMove(event: PointerEvent) {
			const rect = node.getBoundingClientRect();
			if (event.clientY < rect.top || event.clientY > rect.bottom) return;
			const pointerXRatio = (event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
			const pointerYRatio = (event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
			if (rafId !== null) return;
			rafId = requestAnimationFrame(() => {
				rafId = null;
				const rotateXDeg = (-pointerYRatio * 14).toFixed(2);
				const rotateYDeg = (pointerXRatio * 20).toFixed(2);
				const nameDepth = (Math.abs(pointerXRatio) * 14 + 8).toFixed(2);
				const arrowDepth = (Math.abs(pointerXRatio) * 22 + 16).toFixed(2);
				if (mark) {
					mark.style.transition = "none";
					mark.style.transform = `perspective(500px) rotateX(${rotateXDeg}deg) rotateY(${rotateYDeg}deg)`;
				}
				if (name) {
					name.style.transition = "none";
					name.style.translate = "0 0";
					name.style.transform = `perspective(500px) translateZ(${nameDepth}px)`;
				}
				if (arrow) {
					arrow.style.transition = "none";
					arrow.style.translate = "0 0";
					arrow.style.transform = `perspective(500px) translateZ(${arrowDepth}px)`;
				}
			});
		}

		function onLeave() {
			if (rafId !== null) {
				cancelAnimationFrame(rafId);
				rafId = null;
			}
			if (mark) {
				mark.style.transition = "";
				mark.style.transform = "";
			}
			if (name) {
				name.style.transition = "";
				name.style.translate = "";
				name.style.transform = "";
			}
			if (arrow) {
				arrow.style.transition = "";
				arrow.style.translate = "";
				arrow.style.transform = "";
			}
		}

		node.addEventListener("pointermove", onMove, { passive: true });
		node.addEventListener("pointerleave", onLeave, { passive: true });
		return {
			destroy() {
				node.removeEventListener("pointermove", onMove);
				node.removeEventListener("pointerleave", onLeave);
				if (rafId !== null) cancelAnimationFrame(rafId);
			},
		};
	}
</script>

<section id="part-of-work" class="part-of-work">
	<div class="wrap">
		<header class="head section-head" use:inView>
			<h2 class="section-title" use:revealOnView={revealTitle}>Work I've Been Part Of</h2>
			<p class="hint" use:revealOnView={revealHint}>Things I've been part of, past and present.</p>
		</header>

		{#if partOfWork?.length}
			<ol class="entry-list">
				{#each partOfWork as item, index (item.name)}
					{@const active = isActive(item)}
					<li
						class="entry"
						class:is-active={active}
						aria-current={active ? "true" : undefined}
						use:revealOnView={{
							opacity: [0, 1],
							filter: ["blur(14px)", "blur(0px)"],
							scale: [1.06, 1],
							duration: 760,
							delay: index * 70,
							ease: "out(3)",
						}}
						use:tiltEntry
					>
						{#snippet mark()}
							<div class="entry-mark" aria-hidden="true">
								{#if item.logoUrl}
									<img src={item.logoUrl} alt="" loading="lazy" decoding="async" />
								{:else if item.logo}
									{item.logo}
								{:else}
									{item.name.charAt(0)}
								{/if}
							</div>
						{/snippet}
						{#snippet meta()}
							<div class="entry-meta">
								<span class="num mono">0{partOfWork.length - index}</span>
								<span class="status" class:active>
									<span class="pulse"></span>
									{active ? "Active" : "Past"}
								</span>
							</div>
						{/snippet}
						{#snippet body()}
							<div class="entry-body">
								<h3 class="entry-name">
									{item.name}
									{#if item.role}<span class="role">— {item.role}</span>{/if}
								</h3>
								{#if item.description}
									<p class="entry-desc">{item.description}</p>
								{/if}
								{#if item.tags?.length}
									<ul class="tags">
										{#each item.tags as tag}
											<li class="tag mono">{tag}</li>
										{/each}
									</ul>
								{/if}
							</div>
						{/snippet}
						{#snippet aside()}
							<div class="entry-aside">
								<time class="period mono" datetime={startYear(item)}>
									{startYear(item)} <span class="dash">—</span>
									{item.end}
								</time>
								<span class="arrow" aria-hidden="true">↗</span>
							</div>
						{/snippet}

						{#if item.url}
							<a class="entry-link" href={item.url} target="_blank" rel="noopener noreferrer" data-cursor="View">
								<span class="sr-only">Visit {item.name} (opens in new tab)</span>
								<div class="cell-mark">{@render mark()}</div>
								<div class="cell-main">
									{@render meta()}
									{@render body()}
								</div>
								<div class="cell-aside">{@render aside()}</div>
							</a>
						{:else}
							<div class="entry-link is-static">
								<div class="cell-mark">{@render mark()}</div>
								<div class="cell-main">
									{@render meta()}
									{@render body()}
								</div>
								<div class="cell-aside">{@render aside()}</div>
							</div>
						{/if}
					</li>
				{/each}
			</ol>
		{/if}
	</div>
</section>

<style>
	.part-of-work {
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
		font-size: var(--fs-h2);
		font-weight: 500;
		letter-spacing: var(--ls-tight);
		margin-bottom: 1.5rem;
	}
	.head .section-title {
		margin-bottom: 0;
	}
	.hint {
		font-size: 0.9rem;
		color: var(--ink-muted);
	}

	.entry-list {
		display: flex;
		flex-direction: column;
	}
	.entry {
		border-bottom: 1px solid var(--line);
		position: relative;
	}
	.entry:first-child {
		border-top: 1px solid var(--line);
	}

	.entry-link {
		display: grid;
		grid-template-columns: auto 1fr auto;
		column-gap: clamp(1rem, 3vw, 2rem);
		row-gap: 1rem;
		align-items: start;
		padding: clamp(1.2rem, 1rem + 0.8vw, 1.6rem) clamp(0.25rem, 0.5vw, 0.5rem);
		transition: background 320ms var(--easing-soft);
	}
	a.entry-link:hover {
		background: var(--bg-elev);
	}
	.entry-link.is-static {
		cursor: default;
	}

	.cell-mark {
		grid-row: span 2;
		padding-top: 0.15rem;
	}
	.entry-mark {
		width: 44px;
		height: 44px;
		display: grid;
		place-items: center;
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 500;
		letter-spacing: var(--ls-tight);
		color: var(--ink);
		background: var(--bg-elev);
		border: 1px solid var(--line);
		border-radius: 10px;
		transition:
			border-color var(--duration-base) var(--easing-soft),
			background var(--duration-base) var(--easing-soft),
			transform 320ms var(--easing-soft);
	}
	.entry-mark img {
		border-radius: 10px;
	}
	.entry-mark img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		display: block;
	}
	.entry.is-active .entry-mark {
		color: var(--ink);
	}
	a.entry-link:hover .entry-mark {
		border-color: var(--ink-faint);
	}

	.cell-main {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		min-width: 0;
	}
	.cell-aside {
		grid-row: span 2;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1rem;
		text-align: right;
	}

	.entry-meta {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
	}
	.num {
		font-size: 0.7rem;
		letter-spacing: 0.16em;
		color: var(--ink-muted);
	}
	.status {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font: 500 0.66rem/1 var(--font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-muted);
		padding: 4px 9px;
		border: 1px solid var(--line);
		border-radius: 999px;
	}
	.status.active {
		color: var(--ink-2);
		border-color: var(--ink-faint);
	}
	.pulse {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: currentColor;
	}

	.entry-name {
		font-family: var(--font-display);
		font-size: clamp(1.15rem, 0.95rem + 0.6vw, 1.5rem);
		font-weight: 500;
		letter-spacing: var(--ls-tight);
		line-height: 1.1;
		transition: transform 320ms var(--easing-soft);
	}
	.entry.is-active .entry-name {
		color: var(--ink);
	}
	.role {
		font-family: var(--font-body);
		font-size: 0.85rem;
		font-weight: 400;
		letter-spacing: 0;
		color: var(--ink-muted);
	}
	.entry-desc {
		font-size: 0.95rem;
		line-height: 1.55;
		color: var(--ink-2);
		max-width: 56ch;
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		margin-top: 0.15rem;
	}
	.tag {
		font-size: 0.66rem;
		letter-spacing: 0.04em;
		padding: 3px 8px;
		border: 1px solid var(--line);
		border-radius: 999px;
		color: var(--ink-muted);
		background: color-mix(in oklch, var(--bg) 70%, transparent);
		transition:
			color var(--duration-fast) var(--easing-soft),
			border-color var(--duration-fast) var(--easing-soft);
	}
	a.entry-link:hover .tag {
		color: var(--ink-2);
		border-color: var(--ink-faint);
	}

	.period {
		font-size: 0.72rem;
		color: var(--ink-muted);
		white-space: nowrap;
		letter-spacing: 0.02em;
		display: inline-flex;
		align-items: center;
		min-height: calc(0.66rem + 10px);
	}
	.period .dash {
		opacity: 0.5;
	}
	.arrow {
		font-size: 1.05rem;
		color: var(--ink-2);
		opacity: 0;
		translate: -4px 4px;
		transition:
			opacity 280ms var(--easing-soft),
			translate 280ms var(--easing-soft),
			transform 280ms var(--easing-soft),
			color 280ms var(--easing-soft);
	}
	a.entry-link:hover .arrow {
		opacity: 1;
		translate: 0 0;
		color: var(--ink-2);
	}
	.entry.is-active .arrow {
		color: var(--ink-2);
	}

	@media (max-width: 620px) {
		.cell-mark {
			grid-column: 1;
			grid-row: 1;
		}
		.cell-main {
			grid-column: 2;
			grid-row: 1;
		}
		.cell-aside {
			grid-column: 3;
			grid-row: 1;
			flex-direction: column;
			align-items: flex-end;
			justify-content: flex-start;
			text-align: right;
		}
		.cell-aside .arrow {
			display: none;
		}
	}
</style>
