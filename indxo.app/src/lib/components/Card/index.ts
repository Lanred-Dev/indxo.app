import type { PublicFolder, PublicSet, PublicUser } from "$lib/documents";

export type CardDocumentType = PublicSet | PublicFolder | PublicUser;
export type CardBreadcrumb = { text: string; icon?: string };

export { default as Card } from "./Card.svelte";
export { default as CardGroup } from "./Group.svelte";
