<script lang="ts" generics="C extends Component<any>">
    import type { Component, ComponentProps } from "svelte";

    let {
        image,
        text,
        showText = false,
        ...properties
    }: {
        image: { properties?: ComponentProps<C>; Component?: C; url?: string };
        text: string;
        showText?: boolean;
        onClick: (...args: any[]) => void;
        [key: string]: unknown;
    } = $props();

    const { class: imageClassName = "", ...imageProperties } = $derived(image.properties ?? {}) as {
        [key: string]: unknown;
    };
</script>

<button type="button" aria-label={text} {...properties}>
    {#if "url" in image}
        <img class={["size-6", imageClassName]} src={image.url} alt={text} {...imageProperties} />
    {:else}
        <image.Component class={["size-6", imageClassName]} {...imageProperties} />
    {/if}

    {#if showText}
        <span class="text-sm">{text}</span>
    {/if}
</button>
