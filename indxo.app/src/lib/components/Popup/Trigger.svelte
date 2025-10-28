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
    let Trigger: HTMLElement | undefined = $state.raw();

    onMount(() => {
        if (!Trigger) return;

        switch (type) {
            case PopupTriggerType.button:
                Trigger.addEventListener("click", () => {
                    popup.setVisible(!popup.isVisible, Trigger);
                });
                break;
            case PopupTriggerType.input:
                Trigger.addEventListener("focusin", () => {
                    popup.setVisible(true, Trigger);
                });
                Trigger.addEventListener("keydown", () => {
                    popup.setVisible(true, Trigger);
                });
                break;
            default:
                return;
        }

        return () => {
            Trigger?.removeEventListener("click", () => {
                popup.setVisible(!popup.isVisible, Trigger);
            });
            Trigger?.removeEventListener("focusin", () => {
                popup.setVisible(true, Trigger);
            });
            Trigger?.removeEventListener("keydown", () => {
                popup.setVisible(true, Trigger);
            });
        };
    });
</script>

<svelte:element
    this={type}
    bind:this={Trigger}
    type="button"
    aria-expanded={popup.isVisible}
    {...properties}
>
    {@render children()}
</svelte:element>
