export type MagneticAxis = "xy" | "x" | "y";

export interface MagneticOptions {
	strength?: number;
	range?: number;
	axis?: MagneticAxis;
}

export interface MagneticAction {
	update(options: MagneticOptions): void;
	destroy(): void;
}
