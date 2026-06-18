export function prettify(name: string): string {
	return name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function prettifyTag(tag: string): string {
	return tag.replace(/[-_]/g, " ");
}
