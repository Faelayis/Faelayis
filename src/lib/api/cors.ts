import { env as privateEnv } from "$env/dynamic/private";
import type { RateLimitBucket, RateLimitConfig, RateLimitResult } from "$types/api/cors";

export const ALLOWED_ORIGINS = ["https://faelayis.github.io", "https://faelayis.vercel.app"] as const;

const VERCEL_PREVIEW = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;
const LOCALHOST = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

export function isAllowedOrigin(request: Request): boolean {
	const origin = request.headers.get("origin");
	if (origin) {
		if ((ALLOWED_ORIGINS as readonly string[]).includes(origin)) return true;
		if (VERCEL_PREVIEW.test(origin)) return true;
		if (LOCALHOST.test(origin)) return true;
		return false;
	}
	const fetchSite = request.headers.get("sec-fetch-site");
	if (fetchSite === "same-origin" || fetchSite === "none") return true;
	if (fetchSite === null) return import.meta.env.DEV;
	return false;
}

export function corsHeadersFor(request: Request): Record<string, string> | null {
	const origin = request.headers.get("origin");
	if (!origin) return null;
	if (!isAllowedOrigin(request)) return null;
	return {
		"Access-Control-Allow-Origin": origin,
		"Access-Control-Allow-Methods": "GET, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
		"Access-Control-Max-Age": "600",
		Vary: "Origin",
	};
}

export function handleCorsPreflight({ request }: { request: Request }): Response {
	if (!isAllowedOrigin(request)) {
		return new Response("Forbidden", { status: 403 });
	}
	const headers = corsHeadersFor(request);
	return new Response(null, {
		status: 204,
		headers: headers ?? {},
	});
}

export function securityHeaders(): Record<string, string> {
	return {
		"X-Content-Type-Options": "nosniff",
		"Referrer-Policy": "no-referrer",
		"Cross-Origin-Resource-Policy": "same-site",
	};
}

const rateLimitBuckets = new Map<string, RateLimitBucket>();
const MAX_RATE_LIMIT_BUCKETS = 5000;

export function rateLimit(key: string, config: RateLimitConfig): RateLimitResult {
	const now = Date.now();
	const existing = rateLimitBuckets.get(key);
	const bucket: RateLimitBucket = existing ?? { tokens: config.capacity, updated: now };

	const elapsedSeconds = (now - bucket.updated) / 1000;
	bucket.tokens = Math.min(config.capacity, bucket.tokens + elapsedSeconds * config.refillPerSec);
	bucket.updated = now;

	if (rateLimitBuckets.size > MAX_RATE_LIMIT_BUCKETS) {
		const firstKey = rateLimitBuckets.keys().next().value;
		if (firstKey) rateLimitBuckets.delete(firstKey);
	}

	if (bucket.tokens < 1) {
		rateLimitBuckets.set(key, bucket);
		const retryAfter = Math.max(1, Math.ceil((1 - bucket.tokens) / config.refillPerSec));
		return { ok: false, retryAfter };
	}

	bucket.tokens -= 1;
	rateLimitBuckets.set(key, bucket);
	return { ok: true, retryAfter: 0 };
}

export function apiBase(): string {
	const url = privateEnv.SITE_URL ?? "";
	if (url.includes("github.io") || !url) return "https://faelayis.vercel.app";
	return url.replace(/\/$/, "");
}

export async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
	const headers: HeadersInit = { Accept: "application/json", ...(init?.headers ?? {}) };
	const response = await fetch(`${apiBase()}${path}`, { ...init, headers });
	if (!response.ok) throw new Error(`API ${response.status}: ${await response.text()}`);
	return (await response.json()) as T;
}
