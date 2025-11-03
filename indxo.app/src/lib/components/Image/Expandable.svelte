<script lang="ts">
    import type { ClassValue } from "svelte/elements";
    import { Dialog, DialogContent, DialogTrigger } from "../Dialog";

    let {
        class: className,
        ...properties
    }: {
        class: ClassValue;
        [key: string]: any;
    } = $props();

    let didImageFailToLoad: boolean = $state.raw(false);
</script>

<Dialog>
    {#if !didImageFailToLoad}
        <DialogTrigger class="group relative">
            <img class={className} {...properties} onerror={() => (didImageFailToLoad = true)} />

            <img
                class="absolute top-2 right-2 size-8 translate-y-2 opacity-0 transition-[translate,opacity] group-hover:translate-y-0 group-hover:opacity-100"
                src="/icons/general/Expand.svg"
                alt="Expand"
            />
        </DialogTrigger>
    {:else}
        <div class={["flex-center flex-col", className]} {...properties}>
            <img class="size-8" src="/icons/general/Error.svg" alt="Error" />
            <p class="text-sm">Failed to load image.</p>
        </div>
    {/if}

    <DialogContent class="min-h-30! rounded-none! p-0!">
        <DialogTrigger class="button-primary absolute top-3 right-3 rounded-full p-1.5! shadow-md">
            <img class="size-8" src="/icons/general/X.svg" alt="Close" />
        </DialogTrigger>

        <img class={["h-[200%] max-h-[80vh] w-auto max-w-[80vw]", className]} {...properties} />
    </DialogContent>
</Dialog>
