export { default as DropdownContent } from "./Content.svelte";
export { default as Dropdown } from "./Dropdown.svelte";
export { default as DropdownTrigger } from "./Trigger.svelte";

export interface DropdownItemProperties {
    value: string;
    text?: string;
    image?: string;
    href?: string;
}

export type DropdownContext = () => {
    uid: string;
    isVisible: boolean;
    value: string;
    currentItem: DropdownItemProperties;
    longestTextWidth: number;
    setValue: (item: DropdownItemProperties) => void;
    registerItem: (item: DropdownItemProperties) => Promise<void>;
};

export let dropdownContextKey: Symbol = Symbol("dropdownContextKey");
