<script lang="ts">
    import { getContext, onMount, type Snippet } from "svelte";
    import { type PopupContext, popupContextKey, PopupTriggerType } from ".";
    import type { ViewportContext } from "$lib/utils/global";

    let {
        children,
        type = PopupTriggerType.button,
        ...properties
    }: {
        children: Snippet<[]>;
        type?: PopupTriggerType;
        [key: string]: any;
    } = $props();

    const viewport: ViewportContext = getContext("viewport");
    const popup: PopupContext = getContext(popupContextKey);
    let trigger: HTMLElement | undefined = $state.raw();

    onMount(() => {
        if (!trigger) return;

        switch (type) {
            case PopupTriggerType.button:
                trigger.addEventListener("click", () => {
                    popup.setVisible(!popup.isVisible, trigger);
                });
                break;
            case PopupTriggerType.input:
                trigger.addEventListener("focusin", () => {
                    popup.setVisible(true, trigger);
                });
                trigger.addEventListener("keydown", () => {
                    popup.setVisible(true, trigger);
                });
                break;
            default:
                return;
        }

        return () => {
            trigger?.removeEventListener("click", () => {
                popup.setVisible(!popup.isVisible, trigger);
            });
            trigger?.removeEventListener("focusin", () => {
                popup.setVisible(true, trigger);
            });
            trigger?.removeEventListener("keydown", () => {
                popup.setVisible(true, trigger);
            });
        };
    });
</script>

<svelte:element
    this={type}
    bind:this={trigger}
    type="button"
    aria-expanded={popup.isVisible}
    {...properties}
>
    {@render children()}
</svelte:element>
