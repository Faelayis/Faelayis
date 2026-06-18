import type { PageServerLoad } from "./$types";
import { env as privateEnv } from "$env/dynamic/private";
import { fetchGitHubRepos } from "$lib/api/github";
import { fetchWakaStats } from "$lib/api/wakatime";
import { buildSideProjects } from "$lib/api/merge-projects";
import { personalInfo } from "$data/personal-info";
import { projects } from "$data/projects";
import { partOfWork } from "$data/part-of-work";
import type { WakaStats } from "$types/api/wakatime";
import type { MergedProjectRepo } from "$types/load";

const MAX_FETCHED_REPOS = 200;
const DEFAULT_GITHUB_USERNAME = "faelayis";
const DEFAULT_WAKATIME_USERNAME = "faelayis";

function errorMessage(error: unknown): string {
	if (error instanceof Error) return error.message;
	return String(error);
}

export const load: PageServerLoad = async () => {
	const githubUsername = privateEnv.GITHUB_USERNAME || DEFAULT_GITHUB_USERNAME;
	const wakatimeUsername = privateEnv.WAKATIME_USERNAME || githubUsername || DEFAULT_WAKATIME_USERNAME;
	const githubToken = privateEnv.GITHUB_TOKEN;
	const wakatimeKey = privateEnv.WAKATIME_API_KEY;

	let sideProjects: MergedProjectRepo[] = [];
	let sideProjectsError: string | null = null;
	try {
		const result = await fetchGitHubRepos(githubUsername, githubToken, MAX_FETCHED_REPOS);
		sideProjects = buildSideProjects(result.repos, projects);
	} catch (error: unknown) {
		sideProjectsError = errorMessage(error);
	}

	let wakaStats: WakaStats | null = null;
	let wakaError: string | null = null;
	try {
		wakaStats = await fetchWakaStats(wakatimeUsername, "all_time", wakatimeKey);
	} catch (error: unknown) {
		wakaError = errorMessage(error);
	}

	return {
		username: githubUsername,
		personalInfo,
		sideProjects,
		sideProjectsError,
		wakaStats,
		wakaError,
		projectsConfig: projects,
		partOfWork,
	};
};
