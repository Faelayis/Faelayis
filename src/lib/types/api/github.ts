export interface GitHubRepo {
	id: string;
	name: string;
	nameWithOwner: string;
	description: string | null;
	url: string;
	homepageUrl: string | null;
	isPrivate: boolean;
	isArchived: boolean;
	isFork: boolean;
	stargazerCount: number;
	forkCount: number;
	watchers: { totalCount: number };
	issues: { totalCount: number };
	primaryLanguage: { name: string; color: string } | null;
	languages: { name: string; color: string }[];
	topics: string[];
	updatedAt: string;
	createdAt: string;
	pushedAt: string;
	defaultBranchRef: { name: string } | null;
	image: string | null;
	deployment: string | null;
}

export interface GitHubUser {
	avatarUrl: string;
	bio: string | null;
	name: string | null;
	login: string;
	location: string | null;
	company: string | null;
	websiteUrl: string | null;
	twitterUsername: string | null;
	followers: { totalCount: number };
	following: { totalCount: number };
}

export interface GitHubReposResult {
	user: GitHubUser;
	repos: GitHubRepo[];
}

interface RawLanguageEdge {
	size: number;
	node: { name: string; color: string };
}

interface RawTopicNode {
	topic: { name: string };
}

interface RawRepositoryNode {
	id: string;
	name: string;
	nameWithOwner: string;
	description: string | null;
	url: string;
	homepageUrl: string | null;
	isPrivate: boolean;
	isArchived: boolean;
	isFork: boolean;
	stargazerCount: number;
	forkCount: number;
	watchers: { totalCount: number };
	issues: { totalCount: number };
	primaryLanguage: { name: string; color: string } | null;
	languages: { edges: RawLanguageEdge[] };
	repositoryTopics: { nodes: RawTopicNode[] };
	updatedAt: string;
	createdAt: string;
	pushedAt: string;
	defaultBranchRef: { name: string } | null;
}

interface RawUserPayload {
	avatarUrl: string;
	bio: string | null;
	name: string | null;
	login: string;
	location: string | null;
	company: string | null;
	websiteUrl: string | null;
	twitterUsername: string | null;
	followers: { totalCount: number };
	following: { totalCount: number };
	repositories: {
		totalCount: number;
		nodes: RawRepositoryNode[];
		pageInfo: { hasNextPage: boolean; endCursor: string | null };
	};
}

interface RawGraphQLError {
	type?: string;
	message: string;
	path?: string[];
}

interface RawGraphQLResponse<T> {
	user?: RawUserPayload | null;
	errors?: RawGraphQLError[];
}

export type { RawLanguageEdge, RawTopicNode, RawRepositoryNode, RawUserPayload, RawGraphQLError, RawGraphQLResponse };
