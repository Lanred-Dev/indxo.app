<script lang="ts">
    import { onDestroy, setContext, type Snippet } from "svelte";
    import { type DialogContext, dialogContextKey } from ".";

    let {
        visible = $bindable(false),
        children,
    }: {
        visible?: boolean;
        children: Snippet<[]>;
    } = $props();

    let trigger: HTMLButtonElement | null = null;

    setContext(dialogContextKey, (() => {
        return {
            isVisible: visible,
            setVisible: (isVisible: boolean) => (visible = isVisible),
            setTrigger: (newTrigger: HTMLButtonElement) => {
                trigger = newTrigger;
                trigger.addEventListener("click", () => (visible = !visible));
            },
        };
    }) satisfies DialogContext);

    onDestroy(() => {
        if (trigger) trigger.removeEventListener("click", () => (visible = true));
    });
</script>

<svelte:window onkeydown={(event: KeyboardEvent) => event.key === "Escape" && (visible = false)} />

{@render children()}
