import { animate, stagger } from "animejs";
import type { RevealAction, RevealCharsOptions, RevealParams } from "$types/utils/anime";

function prefersReduceMotion(): boolean {
	return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const DEFAULT_OBSERVER_OPTIONS: IntersectionObserverInit = {
	threshold: 0.15,
	rootMargin: "0px 0px -6% 0px",
};

export function revealOnView(node: HTMLElement, params: RevealParams = {}): RevealAction {
	const { threshold, rootMargin, once = true, ...animation } = params;
	const options: IntersectionObserverInit = {
		...DEFAULT_OBSERVER_OPTIONS,
		...(threshold !== undefined ? { threshold } : {}),
		...(rootMargin ? { rootMargin } : {}),
	};

	if (typeof IntersectionObserver === "undefined" || prefersReduceMotion()) {
		animate(node, { ...animation });
		return { destroy: () => {} };
	}

	animate(node, { ...animation, autoplay: false });

	const observer = new IntersectionObserver((entries) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				animate(node, { ...animation });
				if (once) observer.disconnect();
			}
		}
	}, options);
	observer.observe(node);

	return { destroy: () => observer.disconnect() };
}

const DEFAULT_CHAR_REVEAL = {
	opacity: [0, 1] as [number, number],
	translateY: [10, 0] as [number, number],
	duration: 560,
	ease: "out(3)",
};

export function revealChars(node: HTMLElement, options: RevealCharsOptions = {}): RevealAction {
	const { selector = ".ch", stagger: staggerMs = 24, ...animation } = options;
	const finalAnimation = { ...DEFAULT_CHAR_REVEAL, ...animation };
	const charNodes = Array.from(node.querySelectorAll<HTMLElement>(selector));
	if (charNodes.length === 0) return { destroy: () => {} };

	if (typeof IntersectionObserver === "undefined" || prefersReduceMotion()) {
		animate(charNodes, { ...finalAnimation, delay: stagger(staggerMs) });
		return { destroy: () => {} };
	}

	animate(charNodes, { ...finalAnimation, autoplay: false });

	const observer = new IntersectionObserver((entries) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				animate(charNodes, { ...finalAnimation, delay: stagger(staggerMs) });
				observer.disconnect();
			}
		}
	}, DEFAULT_OBSERVER_OPTIONS);
	observer.observe(node);

	return { destroy: () => observer.disconnect() };
}

export function inView(node: HTMLElement, options: { threshold?: number; rootMargin?: string } = {}): RevealAction {
	const { threshold, rootMargin } = options;
	const observerOptions: IntersectionObserverInit = {
		...DEFAULT_OBSERVER_OPTIONS,
		...(threshold !== undefined ? { threshold } : {}),
		...(rootMargin ? { rootMargin } : {}),
	};

	if (typeof IntersectionObserver === "undefined" || prefersReduceMotion()) {
		node.classList.add("in");
		return { destroy: () => {} };
	}

	const observer = new IntersectionObserver((entries) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				node.classList.add("in");
				observer.disconnect();
			}
		}
	}, observerOptions);
	observer.observe(node);

	return { destroy: () => observer.disconnect() };
}
