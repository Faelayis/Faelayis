import { siDiscord, siGithub, siX } from "simple-icons";
import type { PersonalInfo } from "$types/data/personal-info";

export const personalInfo: PersonalInfo = {
	name: "Fae",
	handle: "Faelayis",
	role: "Full Stack Developer",
	location: "Chiang Mai, Thailand",
	email: "faelayis@proton.com",
	bio: "Full-Stack Developer passionate about building modern web applications, scalable systems, and user-friendly digital experiences. Always learning, always improving.",
	longBio: "",
	socials: [
		{ label: "GitHub", url: "https://github.com/faelayis", icon: siGithub },
		{ label: "Discord", url: "https://discord.com/users/328731868096888833", icon: siDiscord },
		{ label: "Twitter", url: "https://twitter.com/Faelayis", icon: siX },
		// { label: "Telegram", url: "https://t.me/Faelayis", icon: siTelegram },
		// { label: "Read.cv", url: "https://read.cv/faelayis", icon: siReaddotcv },
	],
};
