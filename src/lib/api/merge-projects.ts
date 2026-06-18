import type { GitHubRepo } from "$types/api/github";
import type { Project, ProjectsConfig } from "$types/data/project";
import type { MergedProjectRepo } from "$types/load";

const FALLBACK_YEAR = new Date().getFullYear();

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
		image: custom.image ?? githubRepo?.image ?? null,
		deployment: custom.url ?? githubRepo?.homepageUrl ?? null,
		custom,
	};
}

function withCustom(githubRepo: GitHubRepo): MergedProjectRepo {
	return { ...githubRepo, custom: undefined };
}

export function buildSideProjects(repos: GitHubRepo[], config: ProjectsConfig): MergedProjectRepo[] {
	const visibleRepos = repos.filter((repo) => !config.hidden.includes(repo.name));
	const projectNames = new Set(config.project.map((project) => project.name));

	const projectRepos = config.project
		.map((project) => {
			const githubRepo = visibleRepos.find((repo) => repo.name === project.name);
			if (!githubRepo && !project.custom) return null;
			return mergeProject(project, githubRepo);
		})
		.filter((repo): repo is MergedProjectRepo => repo !== null);

	const otherRepos = visibleRepos.filter((repo) => !projectNames.has(repo.name)).map(withCustom);

	return [...projectRepos, ...otherRepos];
}
