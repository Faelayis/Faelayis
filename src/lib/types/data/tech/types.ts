import type { SimpleIcon } from "simple-icons";

export type TechItem = Omit<SimpleIcon, "title" | "svg" | "source" | "guidelines" | "license"> & {
	name: string;
};
