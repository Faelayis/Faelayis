import type { SimpleIcon } from "simple-icons";

export interface Social {
	label: string;
	url: string;
	icon?: SimpleIcon;
}

export interface PersonalInfo {
	name: string;
	handle: string;
	role: string;
	location: string;
	email: string;
	bio: string;
	longBio: string;
	socials: Social[];
}
