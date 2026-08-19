<script lang="ts">
    import type { ClassValue } from "svelte/elements";
    import { Dialog, DialogContent, DialogTrigger } from "../Dialog";
    import Icon from "../Icon.svelte";

    let {
        class: className,
        triggerClass,
        ...properties
    }: {
        class: ClassValue;
        triggerClass?: ClassValue;
        [key: string]: unknown;
    } = $props();

    let didImageFailToLoad: boolean = $state.raw(false);
</script>

<Dialog>
    {#if !didImageFailToLoad}
        <DialogTrigger class={["group relative", triggerClass]}>
            <img class={className} {...properties} onerror={() => (didImageFailToLoad = true)} />

            <div
                class="button-primary absolute top-3 right-3 z-2 size-10 translate-y-2 rounded-full p-1.5 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
            >
                <Icon class="h-full w-full fill-white" icon="general/Expand" />
            </div>
        </DialogTrigger>
    {:else}
        <div class={["flex-center flex-col", className]} {...properties}>
            <Icon class="size-8" icon="general/Error" />
            <p class="text-sm">Failed to load image.</p>
        </div>
    {/if}

    <DialogContent class="min-h-30! rounded-none! p-0!">
        <DialogTrigger class="button-primary absolute top-3 right-3 size-10 rounded-full p-1.5">
            <Icon icon="general/X" />
        </DialogTrigger>

        <img class={["h-[200%] max-h-[80vh] w-auto max-w-[80vw]", className]} {...properties} />
    </DialogContent>
</Dialog>
