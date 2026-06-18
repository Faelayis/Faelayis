export interface ProjectCustom {
	title?: string;
	tagline?: string;
	image?: string;
	tags?: string[];
	year?: string;
	role?: string;
	featured?: boolean;
	url?: string;
}

export interface Project {
	name: string;
	custom?: ProjectCustom;
}

export interface ProjectsConfig {
	project: Project[];
	hidden: string[];
	tagColors: Record<string, string>;
}
