export type PartOfWorkEndDate = string | "Present";

export interface PartOfWorkItem {
	name: string;
	logo?: string;
	logoUrl?: string;
	role?: string;
	description?: string;
	start: string;
	end: PartOfWorkEndDate;
	url?: string;
	tags?: string[];
}
