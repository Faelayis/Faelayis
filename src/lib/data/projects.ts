import type { Project, ProjectsConfig } from "$types/data/project";

export const projects: ProjectsConfig = {
	project: [
		// {
		// 	name: "Mutelith",
		// 	custom: {
		// 		tags: [],
		// 	},
		// },
	],
	hidden: [
		"Faelayis",
		"faelayis",
		"me",
		"MyAnimeList-History",
		"CMRU-Drink_Shop",
		"CMRU-GuardianG",
		"CMRU-PeeSonNong",
		"dotfiles",
		"Radeon-RX-6600-Stuttering",
		"CMRU-Lab-Learn",
		"DBD-ReShade",
		"Steam-History-Custom-Info",
		"mc-mod-packs",
		"my-wallpaper-engine-workshop",
	],
	tagColors: {
		Tooling: "#FF3D00",
		"Design System": "#FF3D00",
		Engine: "#3178c6",
		Typography: "#ff3e00",
		Site: "#0a0a0a",
		WebGL: "#FF3D00",
		AI: "#A97BFF",
		CLI: "#00ADD8",
		Library: "#dea584",
	},
};

export type { Project, ProjectsConfig };
