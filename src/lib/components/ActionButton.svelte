<script lang="ts">
    import type { Component } from "svelte";

    interface Properties {
        image: string | { Component: Component<any>; properties?: Record<string, unknown> };
        text: string;
        onclick: (...args: any[]) => void;
    }

    let { image, text, onclick }: Properties = $props();
</script>

<button type="button" aria-labelledby={text} {onclick}>
    {#if typeof image === "string"}
        <img class="size-6" src={image} alt={text} />
    {:else}
        <image.Component class="size-6" {...image.properties} />
    {/if}
</button>
