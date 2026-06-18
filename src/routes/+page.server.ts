import type { PageServerLoad } from "./$types";
import { env as privateEnv } from "$env/dynamic/private";
import { fetchGitHubRepos } from "$lib/api/github";
import { fetchWakaStats } from "$lib/api/wakatime";
import { personalInfo } from "$data/personal-info";
import { projects } from "$data/projects";
import { partOfWork } from "$data/part-of-work";
import type { GitHubRepo } from "$types/api/github";
import type { WakaStats } from "$types/api/wakatime";
import type { Project } from "$types/data/project";
import type { MergedProjectRepo } from "$types/load";

const MAX_FETCHED_REPOS = 200;
const FALLBACK_YEAR = new Date().getFullYear();
const DEFAULT_GITHUB_USERNAME = "faelayis";
const DEFAULT_WAKATIME_USERNAME = "faelayis";

function errorMessage(error: unknown): string {
	if (error instanceof Error) return error.message;
	return String(error);
}

function mergeProject(project: Project, githubRepo: GitHubRepo | undefined): MergedProjectRepo {
	const custom = project.custom ?? {};
	const yearNumber = githubRepo ? new Date(githubRepo.createdAt).getFullYear() : FALLBACK_YEAR;
	const year = custom.year ?? String(yearNumber);

	return {
		id: githubRepo?.id ?? `project-${project.name}`,
		name: custom.title ?? project.name,
		nameWithOwner: githubRepo?.nameWithOwner ?? project.name,
		description: custom.tagline ?? githubRepo?.description ?? null,
		url: custom.url ?? githubRepo?.url ?? "#",
		homepageUrl: custom.url ?? githubRepo?.homepageUrl ?? null,
		isPrivate: githubRepo?.isPrivate ?? false,
		isArchived: githubRepo?.isArchived ?? false,
		isFork: githubRepo?.isFork ?? false,
		stargazerCount: githubRepo?.stargazerCount ?? 0,
		forkCount: githubRepo?.forkCount ?? 0,
		watchers: githubRepo?.watchers ?? { totalCount: 0 },
		issues: githubRepo?.issues ?? { totalCount: 0 },
		primaryLanguage: githubRepo?.primaryLanguage ?? null,
		languages: githubRepo?.languages ?? [],
		topics: custom.tags ?? githubRepo?.topics ?? [],
		updatedAt: githubRepo?.updatedAt ?? new Date().toISOString(),
		createdAt: githubRepo?.createdAt ?? `${year}-01-01T00:00:00Z`,
		pushedAt: githubRepo?.pushedAt ?? new Date().toISOString(),
		defaultBranchRef: githubRepo?.defaultBranchRef ?? null,
		readmeCleaned: null,
		image: custom.image ?? githubRepo?.image ?? null,
		deployment: custom.url ?? githubRepo?.homepageUrl ?? null,
		custom,
	};
}

function withCustom(githubRepo: GitHubRepo): MergedProjectRepo {
	return { ...githubRepo, custom: undefined };
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
		const publicRepos = result.repos.filter((repo) => !projects.hidden.includes(repo.name));

		const projectNames = new Set(projects.project.map((project) => project.name));
		const projectRepos = projects.project
			.map((project) => {
				const githubRepo = publicRepos.find((repo) => repo.name === project.name);
				if (!githubRepo && !project.custom) return null;
				return mergeProject(project, githubRepo);
			})
			.filter((repo): repo is MergedProjectRepo => repo !== null);

		const otherRepos = publicRepos.filter((repo) => !projectNames.has(repo.name)).map(withCustom);

		sideProjects = [...projectRepos, ...otherRepos];
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
