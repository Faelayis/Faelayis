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

function onSmoothScrollSettled(cb: () => void): void {
	if (typeof window === "undefined") {
		cb();
		return;
	}

	let done = false;
	let lastY = window.scrollY;
	let stable = 0;
	let raf = 0;
	let cap = 0;

	const finish = (): void => {
		if (done) return;
		done = true;
		cancelAnimationFrame(raf);
		clearTimeout(cap);
		cb();
	};

	const tick = (): void => {
		const y = window.scrollY;
		if (Math.abs(y - lastY) < 1) {
			stable++;
			if (stable >= 8) {
				finish();
				return;
			}
		} else {
			stable = 0;
		}
		lastY = y;
		raf = requestAnimationFrame(tick);
	};

	raf = requestAnimationFrame(tick);
	cap = window.setTimeout(finish, 2000);
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

	const targetY = target.getBoundingClientRect().top + window.scrollY;
	const distance = Math.abs(targetY - window.scrollY);
	if (distance < 4) {
		emit();
		return;
	}

	onSmoothScrollSettled(emit);
}
