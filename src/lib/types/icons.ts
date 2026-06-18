import type { SimpleIcon } from "simple-icons";

export type { SimpleIcon } from "simple-icons";

export interface ResolvedIcon extends SimpleIcon {
	slug: string;
}

export interface IconLookupResult {
	icon: ResolvedIcon | null;
	slug: string | null;
}

export interface RenderedTechItem {
	name: string;
	slug: string;
	percent: number;
	totalSeconds: number;
	icon: ResolvedIcon | null;
}
