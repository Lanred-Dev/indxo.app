import { writable, type Writable } from "svelte/store";

export const showSidebar: Writable<boolean> = writable(true);
