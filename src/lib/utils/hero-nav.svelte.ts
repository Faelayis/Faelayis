export const HERO_NAV_RANGE = 360;

export function easeInOutCubic(t: number): number {
	const x = Math.min(1, Math.max(0, t));
	return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function heroNavProgress(scrollY: number) {
	const p = Math.min(1, Math.max(0, scrollY / HERO_NAV_RANGE));
	return { p, e: easeInOutCubic(p) };
}
