import type { AnimationParams } from "animejs";

export const revealTitle: AnimationParams = {
	opacity: [0, 1],
	translateY: [16, 0],
	duration: 720,
	ease: "out(3)",
};

export const revealHint: AnimationParams = {
	opacity: [0, 1],
	translateY: [12, 0],
	duration: 640,
	delay: 90,
	ease: "out(3)",
};

export const revealMeta: AnimationParams = {
	opacity: [0, 1],
	translateY: [10, 0],
	duration: 540,
	delay: 160,
	ease: "out(3)",
};

export const revealTiltX: AnimationParams = {
	opacity: [0, 1],
	translateY: [22, 0],
	rotateX: [-72, 0],
	duration: 820,
	ease: "out(4)",
};

export const revealTiltY: AnimationParams = {
	opacity: [0, 1],
	translateX: [-24, 0],
	rotateY: [-60, 0],
	duration: 780,
	ease: "out(4)",
};
