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
