export { default as PopupContent } from "./Content.svelte";
export { default as Popup } from "./Popup.svelte";
export { default as PopupTrigger } from "./Trigger.svelte";

export enum PopupAlignment {
    left,
    right,
    center,
}

export type PopupContext = () => {
    isInViewport: boolean;
    scrollY: number;
    isVisible: boolean;
    setVisible: (isVisible: boolean) => void;
    trigger: HTMLButtonElement | HTMLInputElement | null;
    setTrigger: (newTrigger: HTMLButtonElement | HTMLInputElement) => void;
};

export let popupContextKey: Symbol = Symbol("popupContextKey");
