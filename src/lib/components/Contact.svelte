<script lang="ts">
	import { animate } from "animejs";
	import { revealOnView, inView } from "$utils/anime";
	import { revealTitle, revealHint, revealMeta } from "$utils/reveal-presets";
	import { copyToClipboard } from "$utils/browser";
	import { magnetic } from "$actions/magnetic";
	import { iconFor, resolveIcon } from "$icons/simple-icons";
	import type { ResolvedIcon } from "$icons/simple-icons";
	import type { Social } from "$types/data/personal-info";

	interface Props {
		email: string;
		socials: Social[];
	}

	let { email, socials }: Props = $props();

	let copied = $state(false);
	let emailBtnEl: HTMLElement | null = $state(null);

	const ICON_SLUG_OVERRIDES: Record<string, string> = {
		GitHub: "github",
		Twitter: "x",
		Discord: "discord",
		Telegram: "telegram",
	};

	function getIcon(label: string): ResolvedIcon | null {
		const override = ICON_SLUG_OVERRIDES[label];
		if (override) {
			const matched = iconFor(override);
			if (matched) return matched;
		}
		const fallback = resolveIcon(label);
		return fallback.icon;
	}

	async function copyEmail() {
		await copyToClipboard(email);
		copied = true;

		if (emailBtnEl) {
			animate(emailBtnEl, {
				scale: [
					{ to: 0.985, duration: 120, ease: "out(2)" },
					{ to: 1, duration: 320, ease: "out(3)" },
				],
			});
		}

		setTimeout(() => {
			copied = false;
		}, 1800);
	}
</script>

<section id="contact" class="contact">
	<div class="wrap">
		<header class="head section-head" use:inView>
			<div class="head-row">
				<p class="eyebrow mono" use:revealOnView={revealTitle}>
					<span class="num">06</span>
					<span class="rule"></span>
					<span>Contact</span>
				</p>
			</div>
			<h2 class="title" use:revealOnView={revealTitle}>
				Get in touch<span class="accent">.</span>
			</h2>
			<p class="intro" use:revealOnView={revealHint}>
				A short email is the fastest way in. The inbox is open for projects, questions, or just to say hi — every message gets a reply.
			</p>
		</header>

		<div class="cards">
			{#each socials as social, i (social.url)}
				{@const ic = getIcon(social.label)}
				<a
					href={social.url}
					target="_blank"
					rel="noopener noreferrer"
					class="card card-social"
					aria-label="{social.label} (opens in new tab)"
					use:revealOnView={{
						...revealMeta,
						delay: 100 + i * 50,
					}}
					use:magnetic={{ strength: 0.2, range: 1.4 }}
				>
					<span class="card-label mono">{social.label}</span>
					{#if ic}
						<svg class="card-icon" viewBox="0 0 24 24" width="42" height="42" fill="#{ic.hex}" aria-hidden="true">
							<path d={ic.path} />
						</svg>
					{:else}
						<span class="card-icon-fallback">{social.label.charAt(0)}</span>
					{/if}
					<span class="card-action">
						Visit
						<span class="arrow" aria-hidden="true">↗</span>
					</span>
				</a>
			{/each}

			<button
				class="card card-email"
				class:is-copied={copied}
				onclick={copyEmail}
				bind:this={emailBtnEl}
				use:revealOnView={revealMeta}
				aria-label="Copy email to clipboard"
			>
				<span class="card-label mono">Email</span>
				<span class="card-main">
					{#if copied}Copied{:else}Click to copy{/if}
				</span>
				<span class="card-arrow" aria-hidden="true">
					{#if copied}✓{:else}→{/if}
				</span>
			</button>
		</div>
	</div>
</section>

<style>
	.contact {
		padding-block: clamp(4rem, 8vw, 7rem);
		border-top: 1px solid var(--line);
	}

	.head {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding-bottom: 1.5rem;
	}
	.head-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1.5rem;
		flex-wrap: wrap;
	}
	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.85rem;
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-muted);
	}
	.eyebrow .num {
		color: var(--ink);
		font-weight: 500;
	}
	.eyebrow .rule {
		display: inline-block;
		width: clamp(2rem, 5vw, 3.5rem);
		height: 1px;
		background: var(--line-strong);
	}

	.title {
		font-family: var(--font-display);
		font-size: clamp(2.4rem, 1.5rem + 4vw, 4.5rem);
		font-weight: 400;
		letter-spacing: -0.035em;
		line-height: 1.02;
	}
	.title .accent {
		color: var(--accent);
	}
	.intro {
		font-size: var(--fs-lead);
		line-height: 1.55;
		color: var(--ink-2);
		max-width: 42ch;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
		gap: 1rem;
		margin-top: clamp(2rem, 4vw, 3rem);
	}
	.card-email {
		grid-column: 1 / -1;
	}

	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1.25rem;
		padding: 1.5rem 1.6rem;
		min-height: 170px;
		border: 1px solid var(--line);
		background: var(--bg);
		border-radius: 12px;
		color: var(--ink);
		cursor: pointer;
		text-align: left;
		font: inherit;
		will-change: transform;
		transition:
			border-color var(--duration-base) var(--easing-soft),
			background var(--duration-base) var(--easing-soft),
			transform var(--duration-base) var(--easing-soft);
	}
	.card:hover {
		border-color: var(--accent);
		background: var(--bg-elev);
	}
	.card-email {
		background: var(--bg-elev);
		border-color: var(--line-strong);
	}
	.card-email:hover {
		background: var(--bg);
	}
	.card.is-copied {
		border-color: var(--accent);
		background: var(--bg);
	}

	.card-label {
		font-size: 0.7rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-muted);
	}
	.card-main {
		font-family: var(--font-display);
		font-size: clamp(1.35rem, 1.05rem + 1vw, 1.85rem);
		font-weight: 500;
		letter-spacing: -0.025em;
		line-height: 1.1;
		color: var(--ink);
	}
	.card.is-copied .card-main {
		color: var(--accent);
	}
	.card-arrow {
		position: absolute;
		top: 1.5rem;
		right: 1.6rem;
		font-size: 1.15rem;
		color: var(--ink-muted);
		transition:
			transform 360ms var(--easing-soft),
			color 360ms var(--easing-soft);
	}
	.card:hover .card-arrow {
		transform: translate(4px, -4px);
		color: var(--accent);
	}
	.card.is-copied .card-arrow {
		color: var(--accent);
		transform: translate(0, 0);
	}

	.card-icon {
		display: block;
		transition: transform 360ms var(--easing-soft);
	}
	.card:hover .card-icon {
		transform: scale(1.08);
	}
	.card-icon-fallback {
		display: grid;
		place-items: center;
		width: 42px;
		height: 42px;
		font-family: var(--font-display);
		font-size: 1.4rem;
		font-weight: 500;
		color: var(--ink);
		background: var(--bg);
		border: 1px solid var(--line);
		border-radius: 8px;
	}

	.card-action {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-muted);
		transition: color var(--duration-base) var(--easing-soft);
	}
	.card:hover .card-action {
		color: var(--accent);
	}
	.card-action .arrow {
		font-size: 0.95em;
		transition: transform 360ms var(--easing-soft);
	}
	.card:hover .card-action .arrow {
		transform: translate(3px, -3px);
	}

	@media (prefers-color-scheme: dark) {
		:root:not([data-theme]) .card-icon {
			filter: brightness(1.25) saturate(0.85);
		}
	}
	:global([data-theme="dark"]) .card-icon {
		filter: brightness(1.25) saturate(0.85);
	}
</style>
