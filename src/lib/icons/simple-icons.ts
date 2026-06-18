import * as simpleIcons from "simple-icons";
import { slugToVariableName, titleToSlug } from "simple-icons/sdk";
import type { SimpleIcon } from "simple-icons";
import type { IconLookupResult, ResolvedIcon } from "$types/icons";

const iconModule = simpleIcons as unknown as Record<string, SimpleIcon>;

export type { ResolvedIcon };

export function iconFor(slug: string): ResolvedIcon | null {
	const variableName = slugToVariableName(slug);
	const icon = iconModule[variableName];
	if (!icon) return null;
	return { ...icon, slug };
}

export function resolveIcon(name: string, slugOverrides?: Record<string, string>): IconLookupResult {
	const overrideSlug = slugOverrides?.[name];
	const directSlug = overrideSlug ?? titleToSlug(name);

	const directIcon = iconFor(directSlug);
	if (directIcon) return { icon: directIcon, slug: directIcon.slug };

	if (!overrideSlug) return { icon: null, slug: null };

	const fallbackSlug = titleToSlug(name);
	const fallbackIcon = iconFor(fallbackSlug);
	if (fallbackIcon) return { icon: fallbackIcon, slug: fallbackIcon.slug };

	return { icon: null, slug: null };
}
