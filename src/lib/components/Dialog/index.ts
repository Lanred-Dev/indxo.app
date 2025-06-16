export { default as DialogClose } from "./Close.svelte";
export { default as DialogContent } from "./Content.svelte";
export { default as DialogContentHeader } from "./ContentHeader.svelte";
export { default as Dialog } from "./Dialog.svelte";
export { default as DialogTrigger } from "./Trigger.svelte";

export type DialogContext = () => {
    isVisible: boolean;
    setVisible: (isVisible: boolean) => void;
    setTrigger: (newTrigger: HTMLButtonElement) => void;
};

export let dialogContextKey: symbol = Symbol("dialogContextKey");
