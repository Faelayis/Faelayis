import type { ActiveSectionCandidate, ScrollState } from "$types/utils/scroll";

export function createScrollState(): ScrollState {
	let scrollY = $state(0);
	let scrollProgress = $state(0);
	let velocity = $state(0);
	let activeSection = $state<string | null>(null);

	let animationFrame: number | null = null;
	let lastY = 0;
	let lastTimestamp = 0;
	let velocitySmoothed = 0;
	let observer: IntersectionObserver | null = null;
	let sectionEls: HTMLElement[] = $state([]);
	let started = false;
	let referenceCount = 0;

	function tick(): void {
		animationFrame = null;
		const currentScrollY = window.scrollY;
		const max = document.documentElement.scrollHeight - window.innerHeight;
		const timestamp = performance.now();
		const deltaTime = Math.max(1, timestamp - lastTimestamp);
		const deltaY = currentScrollY - lastY;

		scrollY = currentScrollY;
		scrollProgress = max > 0 ? Math.min(1, currentScrollY / max) : 0;

		const instant = deltaY / deltaTime;
		velocitySmoothed = velocitySmoothed * 0.86 + instant * 0.14;
		velocity = velocitySmoothed;

		lastY = currentScrollY;
		lastTimestamp = timestamp;
	}

	function handleScroll(): void {
		if (animationFrame === null) animationFrame = requestAnimationFrame(tick);
	}

	function pickActive(entries: IntersectionObserverEntry[]): void {
		let best: ActiveSectionCandidate | null = null;
		for (const entry of entries) {
			if (!entry.isIntersecting) continue;
			const top = entry.boundingClientRect.top;
			if (!best || entry.intersectionRatio > best.ratio) {
				best = { id: entry.target.id, ratio: entry.intersectionRatio, top };
			}
		}
		if (best) activeSection = best.id;
	}

	function setupSections(): void {
		if (observer) observer.disconnect();
		observer = null;
		sectionEls = Array.from(document.querySelectorAll<HTMLElement>("main > section[id]"));
		if (sectionEls.length === 0) {
			requestAnimationFrame(setupSections);
			return;
		}
		observer = new IntersectionObserver(pickActive, {
			threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
			rootMargin: "-30% 0px -40% 0px",
		});
		for (const section of sectionEls) observer.observe(section);
	}

	function start(): void {
		if (typeof window === "undefined") return;
		referenceCount++;
		if (started) return;
		started = true;
		setupSections();
		window.addEventListener("scroll", handleScroll, { passive: true });
		window.addEventListener("resize", setupSections, { passive: true });
		lastY = window.scrollY;
		lastTimestamp = performance.now();
		tick();
	}

	function stop(): void {
		if (typeof window === "undefined") return;
		referenceCount = Math.max(0, referenceCount - 1);
		if (referenceCount > 0 || !started) return;
		started = false;
		window.removeEventListener("scroll", handleScroll);
		window.removeEventListener("resize", setupSections);
		if (observer) observer.disconnect();
		if (animationFrame !== null) cancelAnimationFrame(animationFrame);
	}

	return {
		get scrollY() {
			return scrollY;
		},
		get scrollProgress() {
			return scrollProgress;
		},
		get velocity() {
			return velocity;
		},
		get activeSection() {
			return activeSection;
		},
		get sections() {
			return sectionEls;
		},
		start,
		stop,
	};
}

export const scroll = createScrollState();
