import { prefersReducedMotion } from "$utils/browser";
import { replay, nearestSectionId } from "$utils/replay";

export interface ScrambleOptions {
	chars?: string;
	speed?: number;
	settleDelay?: number;
	settleDuration?: number;
	threshold?: number;
	rootMargin?: string;
	once?: boolean;
	charClass?: string;
	onCharSettle?: (index: number, el: HTMLSpanElement, char: string) => void;
}

export interface ScrambleAction {
	destroy(): void;
}

const DEFAULT_SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*+-=?";
const DEFAULT_OBSERVER_OPTIONS: IntersectionObserverInit = {
	threshold: 0.2,
	rootMargin: "0px 0px -8% 0px",
};

function randomChar(chars: string): string {
	return chars[Math.floor(Math.random() * chars.length)];
}

export function scrambleText(node: HTMLElement, options: ScrambleOptions = {}): ScrambleAction {
	const { chars, speed = 38, settleDelay = 26, settleDuration = 560, threshold, rootMargin, once = true, charClass, onCharSettle } = options;

	const original = node.textContent ?? "";
	const text = Array.from(original);
	const fromText = Array.from(new Set(text.filter((c) => c.trim() !== ""))).join("");
	const scramblePool = chars || fromText || DEFAULT_SCRAMBLE_CHARS;

	node.setAttribute("aria-label", original);
	node.classList.add("scramble");

	const charClassName = charClass ? `scramble-ch ${charClass}` : "scramble-ch";

	const frag = document.createDocumentFragment();
	const spans: HTMLSpanElement[] = [];
	const scramblable: boolean[] = [];

	for (const ch of text) {
		const span = document.createElement("span");
		span.className = charClassName;
		if (ch === " ") {
			span.textContent = " ";
			scramblable.push(false);
		} else if (ch === "\n" || ch === "\t") {
			span.textContent = ch;
			scramblable.push(false);
		} else {
			span.textContent = ch;
			scramblable.push(true);
		}
		frag.appendChild(span);
		spans.push(span);
	}

	node.textContent = "";
	node.appendChild(frag);

	const reserveHeight = (): void => {
		const height = node.getBoundingClientRect().height;
		if (height > 0) node.style.minHeight = `${height}px`;
	};
	reserveHeight();
	if (typeof document !== "undefined" && document.fonts?.ready) {
		document.fonts.ready.then(reserveHeight).catch(() => {});
	}

	if (prefersReducedMotion()) {
		return { destroy: () => {} };
	}

	let rafId: number | null = null;
	let running = false;
	let startTimes: number[] = new Array(spans.length).fill(0);
	let lastUpdates: number[] = new Array(spans.length).fill(0);
	let settled: boolean[] = new Array(spans.length).fill(false);

	function writeReal(i: number): void {
		spans[i].textContent = text[i];
	}

	function setScrambled(): void {
		for (let i = 0; i < spans.length; i++) {
			if (!scramblable[i]) continue;
			spans[i].textContent = randomChar(scramblePool);
		}
	}

	function runScramble(): void {
		if (running) return;
		running = true;
		const now = performance.now();
		startTimes = spans.map((_, i) => now + i * settleDelay);
		lastUpdates = new Array(spans.length).fill(0);
		settled = new Array(spans.length).fill(false);
		setScrambled();

		function tick(t: number): void {
			let allDone = true;
			for (let i = 0; i < spans.length; i++) {
				if (!scramblable[i]) continue;
				const start = startTimes[i];
				if (t < start) {
					allDone = false;
					continue;
				}
				const elapsed = t - start;
				if (elapsed >= settleDuration) {
					if (!settled[i]) {
						settled[i] = true;
						writeReal(i);
						onCharSettle?.(i, spans[i], text[i]);
					}
					continue;
				}
				allDone = false;
				if (t - lastUpdates[i] >= speed) {
					lastUpdates[i] = t;
					spans[i].textContent = randomChar(scramblePool);
				}
			}
			if (allDone) {
				running = false;
				rafId = null;
				return;
			}
			rafId = requestAnimationFrame(tick);
		}
		rafId = requestAnimationFrame(tick);
	}

	function reset(): void {
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
		running = false;
		setScrambled();
	}

	setScrambled();

	const sectionId = nearestSectionId(node);
	const offReplay = replay.on((id: string) => {
		if (id !== sectionId) return;
		reset();
		runScramble();
	});

	if (typeof IntersectionObserver === "undefined") {
		runScramble();
		return { destroy: () => offReplay() };
	}

	const observerOptions: IntersectionObserverInit = {
		...DEFAULT_OBSERVER_OPTIONS,
		...(threshold !== undefined ? { threshold } : {}),
		...(rootMargin ? { rootMargin } : {}),
	};

	const observer = new IntersectionObserver((entries) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				runScramble();
				if (once) observer.disconnect();
			} else if (!once) {
				reset();
			}
		}
	}, observerOptions);
	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
			offReplay();
			if (rafId !== null) cancelAnimationFrame(rafId);
		},
	};
}
