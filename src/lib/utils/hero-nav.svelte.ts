export const HERO_NAV_RANGE = 560;
export const HERO_NAV_RANGE_COMPACT = 440;
export const COMPACT_BREAKPOINT = 720;

export function getHeroNavRange(): number {
	if (typeof window === "undefined") return HERO_NAV_RANGE;
	return window.innerWidth < COMPACT_BREAKPOINT ? HERO_NAV_RANGE_COMPACT : HERO_NAV_RANGE;
}

export function smoothstep(a: number, b: number, x: number): number {
	const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
	return t * t * (3 - 2 * t);
}

export function easeInOutCubic(t: number): number {
	const x = Math.min(1, Math.max(0, t));
	return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function heroNavProgress(scrollY: number) {
	const range = getHeroNavRange();
	const p = Math.min(1, Math.max(0, scrollY / range));
	return { p, e: easeInOutCubic(p) };
}
