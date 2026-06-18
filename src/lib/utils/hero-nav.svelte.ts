export const HERO_NAV_RANGE = 560;
export const HERO_NAV_RANGE_COMPACT = 440;
export const COMPACT_BREAKPOINT = 720;

export function getHeroNavRange(): number {
	if (typeof window === "undefined") return HERO_NAV_RANGE;
	return window.innerWidth < COMPACT_BREAKPOINT ? HERO_NAV_RANGE_COMPACT : HERO_NAV_RANGE;
}

export function smoothstep(edgeA: number, edgeB: number, value: number): number {
	const clamped = Math.min(1, Math.max(0, (value - edgeA) / (edgeB - edgeA)));
	return clamped * clamped * (3 - 2 * clamped);
}

export function easeInOutCubic(progress: number): number {
	const clamped = Math.min(1, Math.max(0, progress));
	return clamped < 0.5 ? 4 * clamped * clamped * clamped : 1 - Math.pow(-2 * clamped + 2, 3) / 2;
}

export function heroNavProgress(scrollY: number) {
	const range = getHeroNavRange();
	const progress = Math.min(1, Math.max(0, scrollY / range));
	return { progress, easedProgress: easeInOutCubic(progress) };
}
