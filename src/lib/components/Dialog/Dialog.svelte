<script lang="ts">
    import { onDestroy, setContext, type Snippet } from "svelte";
    import { type DialogContext, dialogContextKey } from ".";

    let {
        onClose,
        visible = $bindable(false),
        children,
    }: {
        onClose?: () => void;
        visible?: boolean;
        children: Snippet<[]>;
    } = $props();

    let trigger: HTMLButtonElement | null = null;

    /**
     * Sets the visibility of the popup.
     *
     * @param isVisible
     */
    function setVisible(isVisible: boolean) {
        if (visible === isVisible) return;

        visible = isVisible;
        if (!visible && onClose) onClose();
    }

    setContext(dialogContextKey, (() => {
        return {
            isVisible: visible,
            setVisible,
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

<svelte:window
    onkeydown={(event: KeyboardEvent) => {
        if (event.key === "Escape" && visible) setVisible(false);
    }}
/>

{@render children()}
