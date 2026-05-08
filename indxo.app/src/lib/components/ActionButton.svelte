<script lang="ts" generics="C extends Component<any>">
    import type { Component, ComponentProps } from "svelte";
    import Icon from "./Icon.svelte";

    let {
        image,
        text,
        showText = false,
        ...properties
    }: {
        image: { properties?: ComponentProps<C>; Component?: C; url?: string; icon?: string };
        text: string;
        showText?: boolean;
        onclick: (...args: any[]) => void;
        [key: string]: unknown;
    } = $props();

    const { class: imageClassName = "", ...imageProperties } = $derived(image.properties ?? {}) as {
        [key: string]: unknown;
    };
</script>

<button class="button-icon" type="button" aria-label={text} {...properties}>
    {#if "url" in image}
        <img class={["size-6", imageClassName]} src={image.url} alt={text} {...imageProperties} />
    {:else if "icon" in image}
        <Icon class={["size-6", imageClassName]} icon={image.icon!} {...imageProperties} />
    {:else}
        <image.Component class={["size-6", imageClassName]} {...imageProperties} />
    {/if}

    {#if showText}
        <span class="text-sm">{text}</span>
    {/if}
</button>
