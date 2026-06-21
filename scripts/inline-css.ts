#!/usr/bin/env bun
/// <reference types="node" />

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, dirname, normalize, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function listHtml(dir: string, acc: string[] = []): string[] {
	for (const name of readdirSync(dir)) {
		const full = join(dir, name);
		const st = statSync(full);
		if (st.isDirectory()) listHtml(full, acc);
		else if (name.endsWith(".html")) acc.push(full);
	}
	return acc;
}

function resolveAssetHref(href: string, htmlFile: string, staticRoot: string): string | null {
	const clean = href.replace(/[?#].*$/, "");
	if (clean.startsWith("/")) {
		return join(staticRoot, clean.replace(/^\/+/, ""));
	}
	return normalize(join(dirname(htmlFile), clean));
}

function toHtmlRelativePath(assetPath: string, htmlFile: string): string {
	const rel = relative(dirname(htmlFile), assetPath).split(sep).join("/");
	return rel.startsWith(".") ? rel : `./${rel}`;
}

function rebaseCssUrls(css: string, cssFile: string, htmlFile: string, staticRoot: string): string {
	return css.replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/g, (full, quote: string, rawUrl: string) => {
		const url = rawUrl.trim();
		if (/^(?:data:|https?:|blob:|#)/i.test(url)) return full;

		const match = url.match(/^([^?#]*)([?#].*)?$/);
		if (!match) return full;
		const [, pathPart, suffix = ""] = match;
		if (!pathPart) return full;

		const assetPath = pathPart.startsWith("/") ? join(staticRoot, pathPart.replace(/^\/+/, "")) : normalize(join(dirname(cssFile), pathPart));

		if (!existsSync(assetPath)) return full;
		const rebased = toHtmlRelativePath(assetPath, htmlFile) + suffix;
		const q = quote || '"';
		return `url(${q}${rebased}${q})`;
	});
}

function inlineFile(htmlFile: string, staticRoot: string): { inlined: number; bytes: number } {
	let html = readFileSync(htmlFile, "utf8");
	let inlined = 0;
	let bytes = 0;

	const linkRe = /<link\b[^>]*?\brel=["']stylesheet["'][^>]*?>/gi;
	let changed = false;

	html = html.replace(linkRe, (linkTag: string) => {
		const hrefMatch = linkTag.match(/\bhref=["']([^"']+)["']/i);
		if (!hrefMatch) return linkTag;
		const assetPath = resolveAssetHref(hrefMatch[1], htmlFile, staticRoot);
		if (!assetPath || !existsSync(assetPath)) return linkTag;
		const css = rebaseCssUrls(readFileSync(assetPath, "utf8"), assetPath, htmlFile, staticRoot);
		inlined++;
		bytes += css.length;
		changed = true;
		return `<style>\n${css}\n</style>`;
	});

	if (changed) writeFileSync(htmlFile, html, "utf8");
	return { inlined, bytes };
}

function main(): void {
	const targetDir = resolve(root, process.argv[2] ?? "build");
	if (!existsSync(targetDir)) {
		console.error(`inline-css: directory not found: ${targetDir}`);
		process.exit(1);
	}
	const staticRoot = targetDir;
	const htmlFiles = listHtml(targetDir);
	if (!htmlFiles.length) {
		console.log("inline-css: no html files found");
		return;
	}
	let totalInlined = 0;
	let totalBytes = 0;
	for (const f of htmlFiles) {
		const { inlined, bytes } = inlineFile(f, staticRoot);
		totalInlined += inlined;
		totalBytes += bytes;
		if (inlined) console.log(`  ${resolve(f).replace(root + "\\", "")}  +${inlined} stylesheet(s)`);
	}
	console.log(`inline-css: ${totalInlined} stylesheet(s) inlined into ${htmlFiles.length} html file(s), ${(totalBytes / 1024).toFixed(1)}KB total`);
}

main();
