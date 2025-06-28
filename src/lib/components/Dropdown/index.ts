import type { Snippet } from "svelte";

export { default as DropdownContent } from "./Content.svelte";
export { default as Dropdown } from "./Dropdown.svelte";
export { default as DropdownItem } from "./Item.svelte";
export { default as DropdownTrigger } from "./Trigger.svelte";

export interface DropdownItemProperties {
    value: string | number;
    href?: string;
    Content: Snippet<[]>;
}

export interface DropdownContext {
    uid: string;
    isVisible: boolean;
    value: DropdownItemProperties;
    largestContentWidth: number;
    registerItem: (item: DropdownItemProperties) => Promise<void>;
}

export let dropdownContextKey: Symbol = Symbol("dropdownContextKey");
