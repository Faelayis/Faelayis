import { graphql } from "@octokit/graphql";
import type { RequestParameters } from "@octokit/graphql/types";
import type { GitHubRepo, GitHubUser, GitHubReposResult, RawGraphQLResponse, RawRepositoryNode, RawUserPayload } from "$types/api/github";

const QUERY = /* GraphQL */ `
	query GetRepos($login: String!, $first: Int!, $after: String) {
		user(login: $login) {
			avatarUrl
			bio
			name
			login
			location
			company
			websiteUrl
			twitterUsername
			followers {
				totalCount
			}
			following {
				totalCount
			}
			repositories(
				first: $first
				after: $after
				ownerAffiliations: OWNER
				isFork: false
				privacy: PUBLIC
				orderBy: { field: PUSHED_AT, direction: DESC }
			) {
				totalCount
				pageInfo {
					hasNextPage
					endCursor
				}
				nodes {
					id
					name
					nameWithOwner
					description
					url
					homepageUrl
					isPrivate
					isArchived
					isFork
					stargazerCount
					forkCount
					watchers {
						totalCount
					}
					issues {
						totalCount
					}
					primaryLanguage {
						name
						color
					}
					languages(first: 8, orderBy: { field: SIZE, direction: DESC }) {
						edges {
							size
							node {
								name
								color
							}
						}
					}
					repositoryTopics(first: 12) {
						nodes {
							topic {
								name
							}
						}
					}
					updatedAt
					createdAt
					pushedAt
					defaultBranchRef {
						name
					}
				}
			}
		}
	}
`;

const README_QUERY = /* GraphQL */ `
	query GetReadme($owner: String!, $name: String!) {
		repository(owner: $owner, name: $name) {
			object(expression: "HEAD:README.md") {
				... on Blob {
					text
				}
			}
		}
	}
`;

function cleanReadme(markdown: string | null | undefined): string | null {
	if (!markdown) return null;
	return markdown
		.replace(/<img[^>]*>/g, "")
		.replace(/<picture[^>]*>[\s\S]*?<\/picture>/g, "")
		.replace(/!\[([^\]]*)\]\([^)]*\)/g, "")
		.replace(/\[!\[([^\]]*)\]\([^)]*\)\]\([^)]*\)/g, "")
		.replace(/^#+\s.*$/gm, "")
		.replace(/^---[\s\S]*?---/g, "")
		.replace(/<\/?[^>]+>/g, "")
		.replace(/[*_`~]+/g, "")
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/\n{3,}/g, "\n\n")
		.trim()
		.slice(0, 600);
}

function buildRequest(token: string | undefined, signal: AbortSignal | undefined) {
	const requestParameters: RequestParameters = {};
	if (token) {
		requestParameters.headers = { authorization: `Bearer ${token}` };
	}
	if (signal) {
		requestParameters.request = { signal };
	}
	return graphql.defaults(requestParameters);
}

function mapRepository(raw: RawRepositoryNode): GitHubRepo {
	const languages = raw.languages.edges.map((edge) => edge.node);
	const topics = raw.repositoryTopics.nodes.map((topicNode) => topicNode.topic.name);
	return {
		id: raw.id,
		name: raw.name,
		nameWithOwner: raw.nameWithOwner,
		description: raw.description,
		url: raw.url,
		homepageUrl: raw.homepageUrl,
		isPrivate: raw.isPrivate,
		isArchived: raw.isArchived,
		isFork: raw.isFork,
		stargazerCount: raw.stargazerCount,
		forkCount: raw.forkCount,
		watchers: raw.watchers,
		issues: raw.issues,
		primaryLanguage: raw.primaryLanguage,
		languages,
		topics,
		updatedAt: raw.updatedAt,
		createdAt: raw.createdAt,
		pushedAt: raw.pushedAt,
		defaultBranchRef: raw.defaultBranchRef,
		readmeCleaned: null,
		image: null,
		deployment: raw.homepageUrl,
	};
}

function mapUser(raw: RawUserPayload): GitHubUser {
	return {
		avatarUrl: raw.avatarUrl,
		bio: raw.bio,
		name: raw.name,
		login: raw.login,
		location: raw.location,
		company: raw.company,
		websiteUrl: raw.websiteUrl,
		twitterUsername: raw.twitterUsername,
		followers: raw.followers,
		following: raw.following,
	};
}

const GITHUB_PAGE_MAX = 100;

export async function fetchGitHubRepos(login: string, token?: string, maxRepos = 200, signal?: AbortSignal): Promise<GitHubReposResult> {
	const request = buildRequest(token, signal);
	const cap = Math.max(1, maxRepos);
	const allNodes: RawRepositoryNode[] = [];
	let user: GitHubUser | null = null;
	let cursor: string | null = null;
	let fetched = 0;

	while (fetched < cap) {
		const first = Math.min(GITHUB_PAGE_MAX, cap - fetched);
		const payload = (await request<RawGraphQLResponse<RawUserPayload>>(QUERY, {
			login,
			first,
			after: cursor,
		})) as RawGraphQLResponse<RawUserPayload>;

		if (payload.errors && payload.errors.length > 0) {
			throw new Error(payload.errors[0]?.message ?? "GitHub GraphQL error");
		}

		const rawUser = payload.user;
		if (!rawUser) throw new Error("User not found");

		if (!user) user = mapUser(rawUser);

		allNodes.push(...rawUser.repositories.nodes);
		fetched += rawUser.repositories.nodes.length;

		const { hasNextPage, endCursor } = rawUser.repositories.pageInfo;
		if (!hasNextPage || !endCursor) break;
		cursor = endCursor;
	}

	const publicRepos = allNodes.filter((repo) => !repo.isPrivate);
	const repos = publicRepos.map(mapRepository);
	return { user: user as GitHubUser, repos };
}

export async function fetchReadme(owner: string, name: string, token?: string, signal?: AbortSignal): Promise<string | null> {
	const request = buildRequest(token, signal);
	try {
		const payload = (await request<RawGraphQLResponse<unknown>>(README_QUERY, {
			owner,
			name,
		})) as RawGraphQLResponse<unknown>;

		const repository = payload.repository;
		const object = repository?.object;
		if (!object || !("text" in object)) return null;
		return cleanReadme(object.text);
	} catch {
		return null;
	}
}
