export function prettify(name: string): string {
	return name.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function prettifyTag(tag: string): string {
	return tag.replace(/[-_]/g, " ");
}

export function slugify(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}
