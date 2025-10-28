import type { ComponentProps } from "svelte";
import type Item from "./Item.svelte";

export { default as DropdownContent } from "./Content.svelte";
export { default as Dropdown } from "./Dropdown.svelte";
export { default as DropdownItem } from "./Item.svelte";
export { default as DropdownTrigger } from "./Trigger.svelte";

export interface DropdownContext {
    uid: string;
    isVisible: boolean;
    value: ComponentProps<typeof Item>;
    largestContentWidth: number;
    registerItem: (item: ComponentProps<typeof Item>) => void;
}

export let dropdownContextKey: Symbol = Symbol("dropdownContextKey");
