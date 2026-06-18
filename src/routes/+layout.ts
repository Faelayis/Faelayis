import { dev } from "$app/environment";
import { injectAnalytics } from "@vercel/analytics/sveltekit";

if (import.meta.env.BUILD_TARGET === "vercel") {
	injectAnalytics({ mode: dev ? "development" : "production" });
}

export const prerender = true;
export const ssr = true;
export const trailingSlash = "never";
