export interface ScrollState {
	readonly scrollY: number;
	readonly scrollProgress: number;
	readonly velocity: number;
	readonly activeSection: string | null;
	readonly sections: HTMLElement[];
	start(): void;
	stop(): void;
}

interface ActiveSectionCandidate {
	id: string;
	ratio: number;
	top: number;
}

export type { ActiveSectionCandidate };
