<script lang="ts">
	const year = new Date().getFullYear();
</script>

<div class="year-badge mono" aria-label="Year {year}">
	<span>{year}</span>
</div>

<style>
	.year-badge {
		position: fixed;
		bottom: clamp(0.75rem, 1.6vw, 1.4rem);
		right: clamp(0.75rem, 1.6vw, 1.4rem);
		z-index: 40;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.14em;
		color: var(--ink-muted);
		pointer-events: none;
		user-select: none;
	}
</style>
