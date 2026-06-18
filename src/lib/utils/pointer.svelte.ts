import type { PointerState } from "$types/utils/pointer";

const HOVER_TARGET_SELECTOR = "a, button, [role='button'], input, textarea, select, label, [data-cursor='hover']";

export function createPointerState(): PointerState {
	let isFine = $state(true);
	let visible = $state(false);
	let hovering = $state(false);
	let pressed = $state(false);

	function handlePointerOver(event: PointerEvent): void {
		const target = event.target as HTMLElement | null;
		if (!target) return;
		const matched = target.closest(HOVER_TARGET_SELECTOR);
		hovering = !!matched;
	}

	function handlePointerEnter(): void {
		visible = true;
	}

	function handlePointerLeaveWindow(): void {
		visible = false;
	}

	function handlePointerDown(): void {
		pressed = true;
	}

	function handlePointerUp(): void {
		pressed = false;
	}

	function start(): void {
		if (typeof window === "undefined") return;
		isFine = window.matchMedia("(pointer: fine)").matches;
		if (!isFine) return;
		visible = true;
		document.addEventListener("pointerover", handlePointerOver, { passive: true });
		document.addEventListener("pointerenter", handlePointerEnter, { passive: true });
		document.addEventListener("pointerleave", handlePointerLeaveWindow, { passive: true });
		document.addEventListener("pointerdown", handlePointerDown, { passive: true });
		document.addEventListener("pointerup", handlePointerUp, { passive: true });
	}

	function stop(): void {
		if (typeof window === "undefined") return;
		document.removeEventListener("pointerover", handlePointerOver);
		document.removeEventListener("pointerenter", handlePointerEnter);
		document.removeEventListener("pointerleave", handlePointerLeaveWindow);
		document.removeEventListener("pointerdown", handlePointerDown);
		document.removeEventListener("pointerup", handlePointerUp);
	}

	return {
		get isFine() {
			return isFine;
		},
		get visible() {
			return visible;
		},
		get hovering() {
			return hovering;
		},
		get pressed() {
			return pressed;
		},
		start,
		stop,
	};
}

export const pointer = createPointerState();
