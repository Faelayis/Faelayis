import type { GitHubRepo } from "$types/api/github";
import type { Project } from "$types/data/project";

export interface MergedProjectRepo extends GitHubRepo {
	custom: Project["custom"];
}
