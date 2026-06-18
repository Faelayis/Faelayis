import { json } from "@sveltejs/kit";
import { fetchWakaStats } from "$lib/api/wakatime";
import { env as privateEnv } from "$env/dynamic/private";
import { corsHeadersFor, handleCorsPreflight, isAllowedOrigin, rateLimit, securityHeaders } from "$lib/api/cors";
import type { RequestHandler } from "./$types";

export const prerender = false;

const USERNAME_RE = /^[a-zA-Z0-9_](?:[a-zA-Z0-9_]|-(?=[a-zA-Z0-9_])){0,38}$/;
const VALID_RANGES = new Set(["last_7_days", "last_30_days", "last_6_months", "last_year", "all_time"]);
const RATE_LIMIT = { capacity: 30, refillPerSec: 0.5 };
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
	const rateLimitResult = rateLimit(`waka:${ip}`, RATE_LIMIT);
	if (!rateLimitResult.ok) {
		return json(
			{ error: "Too Many Requests" },
			{
				status: 429,
				headers: { ...headers, "Retry-After": String(rateLimitResult.retryAfter) },
			},
		);
	}

	const rawUsername = url.searchParams.get("username") || privateEnv.WAKATIME_USERNAME;
	const username = (rawUsername ?? "").trim();
	if (!USERNAME_RE.test(username)) {
		return json({ error: "Invalid username" }, { status: 400, headers });
	}

	const rangeParam = url.searchParams.get("range") || "all_time";
	const range = (VALID_RANGES.has(rangeParam) ? rangeParam : "all_time") as
		| "last_7_days"
		| "last_30_days"
		| "last_6_months"
		| "last_year"
		| "all_time";

	const abortController = new AbortController();
	const timeout = setTimeout(() => abortController.abort(), UPSTREAM_TIMEOUT_MS);

	try {
		const stats = await fetchWakaStats(username, range, privateEnv.WAKATIME_API_KEY, abortController.signal);
		return json(stats, {
			headers: {
				...headers,
				"Cache-Control": "public, max-age=300, s-maxage=600, stale-while-revalidate=1800",
			},
		});
	} catch {
		return json({ error: "fetch failed" }, { status: 500, headers });
	} finally {
		clearTimeout(timeout);
	}
};
