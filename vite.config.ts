import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		"import.meta.env.BUILD_TARGET": JSON.stringify(process.env.BUILD_TARGET ?? ""),
	},
	server: {
		port: 5173,
		host: true,
	},
});
