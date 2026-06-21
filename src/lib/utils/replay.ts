type ReplayListener = (sectionId: string) => void;

const listeners = new Set<ReplayListener>();

export const replay = {
	on(fn: ReplayListener): () => void {
		listeners.add(fn);
		return () => {
			listeners.delete(fn);
		};
	},
	emit(id: string): void {
		for (const fn of listeners) fn(id);
	},
};

export function nearestSectionId(node: HTMLElement): string | null {
	let el: HTMLElement | null = node;
	while (el) {
		if (el.tagName === "SECTION" && el.id) return el.id;
		el = el.parentElement;
	}
	return null;
}

function prefersReduceMotion(): boolean {
	return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isInViewport(rect: DOMRect): boolean {
	const viewH = window.innerHeight;
	return rect.top < viewH * 0.85 && rect.bottom > viewH * 0.15;
}

export function scrollThenReplay(hash: string): void {
	if (typeof document === "undefined") return;
	const id = hash.startsWith("#") ? hash.slice(1) : hash;
	const emit = (): void => replay.emit(id);

	const target = document.getElementById(id);
	if (!target) {
		emit();
		return;
	}

	if (prefersReduceMotion() || typeof IntersectionObserver === "undefined") {
		emit();
		return;
	}

	if (isInViewport(target.getBoundingClientRect())) {
		emit();
		return;
	}

	let done = false;
	let observer: IntersectionObserver | null = null;
	let timeout: number | undefined;

	const finish = (): void => {
		if (done) return;
		done = true;
		if (observer) observer.disconnect();
		window.clearTimeout(timeout);
		emit();
	};

	observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					finish();
					return;
				}
			}
		},
		{ rootMargin: "0px 0px -15% 0px", threshold: 0 },
	);
	observer.observe(target);

	timeout = window.setTimeout(finish, 1200);
}
