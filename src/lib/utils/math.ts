export function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}

export function clamp(n: number, min: number, max: number) {
	return Math.min(Math.max(n, min), max);
}

export function mapRange(n: number, inMin: number, inMax: number, outMin: number, outMax: number) {
	return ((n - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
