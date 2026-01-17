<script lang="ts">
    import { setContext, type Snippet } from "svelte";
    import { type DialogContext, dialogContextKey } from ".";

    let {
        onclose,
        isVisible = $bindable(false),
        children,
    }: {
        onclose?: () => void;
        isVisible?: boolean;
        children: Snippet<[]>;
    } = $props();

    /**
     * Sets the visibility of the popup.
     *
     * @param newValue
     */
    function setVisible(newValue: boolean) {
        if (newValue === isVisible) return;

        isVisible = newValue;
        if (!newValue && onclose) onclose();
    }

    setContext(dialogContextKey, {
        get isVisible() {
            return isVisible;
        },
        set isVisible(newValue) {
            setVisible(newValue);
        },
    } satisfies DialogContext);
</script>

<svelte:window
    onkeydown={(event: KeyboardEvent) => {
        if (event.key === "Escape" && isVisible) setVisible(false);
    }}
/>

{@render children()}
