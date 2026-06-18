<script lang="ts">
	import { scroll } from "$utils/scroll.svelte";
	import { onMount } from "svelte";

	interface Section {
		id: string;
		label: string;
	}

	const FALLBACK_LABELS: Record<string, string> = {
		top: "Intro",
		"part-of-work": "Work",
		"side-projects": "Side Project",
		"tech-skills": "Skill",
		about: "About",
		contact: "Contact",
	};

	function readEyebrow(section: HTMLElement): string | null {
		const eyebrow = section.querySelector<HTMLElement>(".eyebrow");
		if (!eyebrow) return null;
		const labelSpan = eyebrow.querySelector<HTMLElement>("span:last-child") ?? eyebrow;
		const text = labelSpan.textContent?.trim();
		return text ? text : null;
	}

	function readHeading(section: HTMLElement): string | null {
		const heading = section.querySelector<HTMLElement>("h1, h2, h3");
		if (!heading) return null;
		const text = heading.textContent?.trim();
		return text ? text : null;
	}

	function resolveLabel(section: HTMLElement): string {
		return FALLBACK_LABELS[section.id] ?? readEyebrow(section) ?? readHeading(section) ?? section.id;
	}

	const items: Section[] = $derived(scroll.sections.map((section) => ({ id: section.id, label: resolveLabel(section) })));

	onMount(() => {
		scroll.start();
		return () => scroll.stop();
	});
</script>

{#if items.length}
	<nav class="index" aria-label="Section index">
		<ol>
			{#each items as item, i (item.id)}
				<li>
					<a
						href="#{item.id}"
						class:active={scroll.activeSection === item.id}
						aria-current={scroll.activeSection === item.id ? "true" : undefined}
					>
						<span class="num">{String(i + 1).padStart(2, "0")}</span>
						<span class="lbl">{item.label}</span>
						<span class="dot" aria-hidden="true"></span>
					</a>
				</li>
			{/each}
		</ol>
	</nav>
{/if}

<style>
	.index {
		position: fixed;
		top: 50%;
		right: clamp(0.75rem, 1.6vw, 1.4rem);
		transform: translateY(-50%);
		z-index: 40;
		pointer-events: none;
	}
	ol {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		pointer-events: auto;
	}
	li {
		display: flex;
		justify-content: flex-end;
	}
	a {
		display: inline-flex;
		align-items: center;
		gap: 0.65rem;
		padding: 0.25rem 0;
		color: var(--ink-faint);
		font-family: var(--font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		transition:
			color 320ms var(--easing-soft),
			transform 360ms var(--easing-soft);
	}
	.num {
		opacity: 0.4;
		transition: opacity 320ms var(--easing-soft);
	}
	.lbl {
		max-width: 0;
		overflow: hidden;
		opacity: 0;
		transition:
			max-width 380ms var(--easing-soft),
			opacity 280ms var(--easing-soft),
			margin 380ms var(--easing-soft);
		white-space: nowrap;
	}
	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--ink-faint);
		transition:
			background 320ms var(--easing-soft),
			transform 380ms var(--easing-soft),
			box-shadow 320ms var(--easing-soft);
	}
	a:hover {
		color: var(--ink-2);
	}
	a.active {
		color: var(--ink);
		transform: translateX(-2px);
	}
	a.active .num {
		opacity: 1;
	}
	a.active .lbl {
		max-width: 8rem;
		opacity: 1;
	}
	a.active .dot {
		background: var(--accent);
		transform: scale(1.6);
		box-shadow: 0 0 0 4px color-mix(in oklch, var(--accent) 18%, transparent);
	}
	a:hover .lbl {
		max-width: 8rem;
		opacity: 1;
	}
	@media (max-width: 720px) {
		.index {
			display: none;
		}
	}
</style>
