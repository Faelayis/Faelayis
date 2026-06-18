import adapter from "@sveltejs/adapter-static";
import adapterVercel from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter:
			process.env.BUILD_TARGET === "vercel"
				? adapterVercel()
				: adapter({
						pages: "build",
						assets: "build",
						fallback: "404.html",
						precompress: false,
						strict: false,
					}),
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				if (path.startsWith("/api/")) return;
				throw new Error(`${message} (${path} from ${referrer})`);
			},
		},
		alias: {
			$components: "src/lib/components",
			$icons: "src/lib/icons",
			$styles: "src/lib/styles",
			$utils: "src/lib/utils",
			$data: "src/lib/data",
			$actions: "src/lib/actions",
			$types: "src/lib/types",
		},
	},
};

export default config;
