export { default as PopupContent } from "./Content.svelte";
export { default as Popup } from "./Popup.svelte";
export { default as PopupTrigger } from "./Trigger.svelte";

export enum PopupXAlignment {
    left,
    right,
    center,
}

export enum PopupYAlignment {
    top,
    bottom,
    center,
}

export enum PopupRelativity {
    trigger,
    page,
}

export enum PopupTriggerType {
    button = "button",
    input = "input",
}

export interface PopupContext {
    isInViewport: boolean;
    isVisible: boolean;
    scrollY: number;
    OpeningTrigger: HTMLElement | undefined;
    setVisible: (newValue: boolean, trigger?: HTMLElement) => void;
}

export let popupContextKey: Symbol = Symbol("popupContextKey");
