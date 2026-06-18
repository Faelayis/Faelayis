import type { AnimationParams } from "animejs";

export type RevealParams = AnimationParams & {
	threshold?: number;
	rootMargin?: string;
	once?: boolean;
};

export type RevealCharsOptions = {
	selector?: string;
	stagger?: number;
} & Omit<AnimationParams, "delay">;

export interface RevealAction {
	destroy(): void;
}
