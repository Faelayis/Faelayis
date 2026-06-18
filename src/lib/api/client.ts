function clientApiBase(): string {
	if (typeof window === "undefined") return "";
	const { hostname } = window.location;
	if (hostname === "faelayis.github.io") return "https://faelayis.vercel.app";
	return "";
}

export async function fetchApiJson<T>(path: string, init?: RequestInit): Promise<T> {
	const base = clientApiBase();
	const response = await fetch(`${base}${path}`, {
		...init,
		headers: { Accept: "application/json", ...(init?.headers ?? {}) },
	});
	if (!response.ok) throw new Error(`API ${response.status}`);
	return (await response.json()) as T;
}
