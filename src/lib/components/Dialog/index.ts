export { default as DialogContent } from "./Content.svelte";
export { default as DialogContentHeader } from "./ContentHeader.svelte";
export { default as Dialog } from "./Dialog.svelte";
export { default as DialogTrigger } from "./Trigger.svelte";

export interface DialogContext {
    isVisible: boolean;
}

export let dialogContextKey: symbol = Symbol("dialogContextKey");
