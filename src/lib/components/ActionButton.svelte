<script lang="ts" generics="C extends Component<any>">
    import type { Component, ComponentProps } from "svelte";

    interface Properties {
        image: { properties?: ComponentProps<C>; Component?: C; url?: string };
        text: string;
        onclick: (...args: any[]) => void;
        [key: string]: unknown;
    }

    let { image, text, ...properties }: Properties = $props();
    const { class: imageClassName = "", ...imageProperties } = $derived(image.properties ?? {}) as {
        [key: string]: unknown;
    };
</script>

<button type="button" aria-labelledby={text} {...properties}>
    {#if "url" in image}
        <img class={["size-6", imageClassName]} src={image.url} alt={text} {...imageProperties} />
    {:else}
        <image.Component class={["size-6", imageClassName]} {...imageProperties} />
    {/if}
</button>
