import { prefersReducedMotion } from "$utils/browser";
import type { MagneticAction, MagneticAxis, MagneticOptions } from "$types/actions/magnetic";

export function magnetic(node: HTMLElement, options: MagneticOptions = {}): MagneticAction {
	if (typeof window === "undefined") {
		return {
			update: () => {},
			destroy: () => {},
		};
	}

	const reduceMotion = prefersReducedMotion();
	if (reduceMotion) {
		return {
			update: () => {},
			destroy: () => {},
		};
	}

	const isFinePointer = window.matchMedia("(pointer: fine)").matches;
	if (!isFinePointer) {
		return {
			update: () => {},
			destroy: () => {},
		};
	}

	let strength = options.strength ?? 0.35;
	let rangeMultiplier = options.range ?? 1.6;
	let axis: MagneticAxis = options.axis ?? "xy";

	let animationFrame: number | null = null;
	let targetX = 0;
	let targetY = 0;
	let currentX = 0;
	let currentY = 0;

	function step(): void {
		animationFrame = null;
		currentX += (targetX - currentX) * 0.22;
		currentY += (targetY - currentY) * 0.22;
		node.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
		if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
			animationFrame = requestAnimationFrame(step);
		} else {
			node.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
		}
	}

	function handlePointerMove(event: PointerEvent): void {
		const rect = node.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		const deltaX = event.clientX - centerX;
		const deltaY = event.clientY - centerY;
		const distance = Math.hypot(deltaX, deltaY);
		const radius = Math.max(rect.width, rect.height) * rangeMultiplier;
		if (distance < radius) {
			const falloff = 1 - distance / radius;
			const power = falloff * falloff;
			const maximum = strength * 18;
			const unitX = distance > 0.5 ? deltaX / distance : 0;
			const unitY = distance > 0.5 ? deltaY / distance : 0;
			targetX = axis === "y" ? 0 : unitX * power * maximum;
			targetY = axis === "x" ? 0 : unitY * power * maximum;
		} else {
			targetX = 0;
			targetY = 0;
		}
		if (animationFrame === null) animationFrame = requestAnimationFrame(step);
	}

	function handlePointerLeave(): void {
		targetX = 0;
		targetY = 0;
		if (animationFrame === null) animationFrame = requestAnimationFrame(step);
	}

	window.addEventListener("pointermove", handlePointerMove, { passive: true });
	node.addEventListener("pointerleave", handlePointerLeave);

	return {
		update(next: MagneticOptions): void {
			if (next.strength !== undefined) strength = next.strength;
			if (next.range !== undefined) rangeMultiplier = next.range;
			if (next.axis !== undefined) axis = next.axis;
		},
		destroy(): void {
			window.removeEventListener("pointermove", handlePointerMove);
			node.removeEventListener("pointerleave", handlePointerLeave);
			if (animationFrame !== null) cancelAnimationFrame(animationFrame);
			node.style.transform = "";
		},
	};
}
