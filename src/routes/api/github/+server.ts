import { json } from "@sveltejs/kit";
import { fetchGitHubRepos, fetchReadme } from "$lib/api/github";
import { env as privateEnv } from "$env/dynamic/private";
import { corsHeadersFor, handleCorsPreflight, isAllowedOrigin, rateLimit, securityHeaders } from "$lib/api/cors";
import type { RequestHandler } from "./$types";

export const prerender = false;

const USERNAME_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
const RATE_LIMIT = { capacity: 60, refillPerSec: 1 };
const UPSTREAM_TIMEOUT_MS = 8000;

export const OPTIONS: RequestHandler = handleCorsPreflight;

export const GET: RequestHandler = async ({ url, request, getClientAddress }) => {
	const origin = request.headers.get("origin");
	const cors = corsHeadersFor(origin);
	const headers = { ...(cors ?? {}), ...securityHeaders() };

	if (!isAllowedOrigin(origin)) {
		return json({ error: "Forbidden" }, { status: 403, headers });
	}

	const ip = getClientAddress();
	const rl = rateLimit(`gh:${ip}`, RATE_LIMIT);
	if (!rl.ok) {
		return json(
			{ error: "Too Many Requests" },
			{
				status: 429,
				headers: { ...headers, "Retry-After": String(rl.retryAfter) },
			},
		);
	}

	const rawLogin = url.searchParams.get("login") || privateEnv.GITHUB_USERNAME;
	const login = (rawLogin ?? "").trim();
	if (!USERNAME_RE.test(login)) {
		return json({ error: "Invalid login" }, { status: 400, headers });
	}

	const firstParam = Number(url.searchParams.get("first") ?? 24);
	const first = Number.isFinite(firstParam) ? Math.min(100, Math.max(1, Math.floor(firstParam))) : 24;

	const withReadme = url.searchParams.get("readme") === "1";

	const ac = new AbortController();
	const timeout = setTimeout(() => ac.abort(), UPSTREAM_TIMEOUT_MS);

	try {
		const { user, repos } = await fetchGitHubRepos(login, privateEnv.GITHUB_TOKEN, first, ac.signal);
		if (withReadme) {
			await Promise.all(
				repos.slice(0, 6).map(async (r) => {
					const [owner, name] = r.nameWithOwner.split("/");
					r.readmeCleaned = await fetchReadme(owner, name, privateEnv.GITHUB_TOKEN, ac.signal);
				}),
			);
		}

		return json(
			{
				user: {
					login: user.login,
					name: user.name,
					bio: user.bio,
					avatarUrl: user.avatarUrl,
					location: user.location,
					company: user.company,
					websiteUrl: user.websiteUrl,
					followers: user.followers?.totalCount,
					following: user.following?.totalCount,
				},
				repos,
				count: repos.length,
			},
			{
				headers: {
					...headers,
					"Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
				},
			},
		);
	} catch {
		return json({ error: "fetch failed" }, { status: 500, headers });
	} finally {
		clearTimeout(timeout);
	}
};
