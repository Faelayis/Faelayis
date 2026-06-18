import { browser } from "$app/environment";

export function prefersReducedMotion(): boolean {
	if (!browser) return false;
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function copyToClipboard(value: string): Promise<void> {
	if (!browser) return Promise.resolve();
	return navigator.clipboard?.writeText(value) ?? Promise.resolve();
}
