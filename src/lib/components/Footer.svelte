<script lang="ts">
	import { magnetic } from "$actions/magnetic";

	interface Props {
		name: string;
	}

	let { name }: Props = $props();

	const year = new Date().getFullYear();
</script>

<footer class="foot">
	<div class="wrap row">
		<span class="copy">© {year} {name}</span>
		<a class="top ulink" href="#top" data-cursor="Top" use:magnetic={{ strength: 0.3, range: 1.4 }}>Back to top ↑</a>
	</div>
</footer>

<style>
	.foot {
		padding-block: 2rem 2.5rem;
		border-top: 1px solid var(--line);
		margin-top: 2rem;
	}
	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.copy {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--ink-muted);
	}
	.top {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--ink-muted);
		transition: color var(--duration-fast) var(--easing-soft);
	}
	.top:hover {
		color: var(--ink);
	}
</style>
