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

	let shown = false;

	const observer = new IntersectionObserver((entries) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				if (shown) continue;
				shown = true;
				animate(node, { ...animation });
				if (once) observer.disconnect();
			} else if (!once) {
				shown = false;
				animate(node, { ...animation, autoplay: false });
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

	let shown = false;

	const observer = new IntersectionObserver((entries) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				if (shown) continue;
				shown = true;
				animate(charNodes, { ...finalAnimation, delay: stagger(staggerMs) });
			} else {
				shown = false;
				animate(charNodes, { ...finalAnimation, autoplay: false });
			}
		}
	}, DEFAULT_OBSERVER_OPTIONS);
	observer.observe(node);

	return { destroy: () => observer.disconnect() };
}

export function inView(node: HTMLElement, options: { threshold?: number; rootMargin?: string; once?: boolean } = {}): RevealAction {
	const { threshold, rootMargin, once = true } = options;
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
				if (once) observer.disconnect();
			} else if (!once) {
				node.classList.remove("in");
			}
		}
	}, observerOptions);
	observer.observe(node);

	return { destroy: () => observer.disconnect() };
}
