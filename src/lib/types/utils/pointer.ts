export interface PointerState {
	readonly isFine: boolean;
	readonly visible: boolean;
	readonly hovering: boolean;
	readonly pressed: boolean;
	start(): void;
	stop(): void;
}
