import type { PageServerLoad } from "./$types";
import { env as privateEnv } from "$env/dynamic/private";
import { fetchGitHubRepos } from "$lib/api/github";
import { buildSideProjects } from "$lib/api/merge-projects";
import { personalInfo } from "$data/personal-info";
import { projects } from "$data/projects";
import { partOfWork } from "$data/part-of-work";

const MAX_FETCHED_REPOS = 200;
const MAX_INLINE_REPOS = 24;
const DEFAULT_GITHUB_USERNAME = "faelayis";

interface LeanRepo {
	id: string;
	name: string;
	url: string;
	image: string | null;
	createdAt: string;
	topics: string[];
	primaryLanguage: { name: string; color: string | null } | null;
	stargazerCount: number;
	isArchived: boolean;
	pushedAt: string;
}

function errorMessage(error: unknown): string {
	if (error instanceof Error) return error.message;
	return String(error);
}

function toLeanRepo(repo: {
	id: string;
	name: string;
	url: string;
	image: string | null;
	createdAt: string;
	topics: string[];
	primaryLanguage: { name: string; color?: string | null } | null;
	stargazerCount: number;
	isArchived: boolean;
	pushedAt: string;
}): LeanRepo {
	return {
		id: repo.id,
		name: repo.name,
		url: repo.url,
		image: repo.image,
		createdAt: repo.createdAt,
		topics: repo.topics,
		primaryLanguage: repo.primaryLanguage ? { name: repo.primaryLanguage.name, color: repo.primaryLanguage.color ?? null } : null,
		stargazerCount: repo.stargazerCount,
		isArchived: repo.isArchived,
		pushedAt: repo.pushedAt,
	};
}

export const load: PageServerLoad = async () => {
	const githubUsername = privateEnv.GITHUB_USERNAME || DEFAULT_GITHUB_USERNAME;
	const githubToken = privateEnv.GITHUB_TOKEN;

	let sideProjects: LeanRepo[] = [];
	let sideProjectsError: string | null = null;
	try {
		const result = await fetchGitHubRepos(githubUsername, githubToken, MAX_FETCHED_REPOS);
		const merged = buildSideProjects(result.repos, projects);
		sideProjects = merged.slice(0, MAX_INLINE_REPOS).map(toLeanRepo);
	} catch (error: unknown) {
		sideProjectsError = errorMessage(error);
	}

	return {
		username: githubUsername,
		personalInfo,
		sideProjects,
		sideProjectsError,
		partOfWork,
	};
};
