<script lang="ts">
    import type { Snippet } from "svelte";

    export type props = {
        title: string;
        text: string;
        direction?: "vertical" | "horizontal";
        classes?: string;
        style?: string;
        wrapChildren?: boolean;
        children?: Snippet<[]>;
    };

    let {
        title,
        text,
        direction = "vertical",
        classes,
        style,
        wrapChildren = true,
        children,
    }: props = $props();

    let horizontal: boolean = direction === "horizontal";
</script>

<div
    class="flex-center relative w-full space-y-8 {horizontal
        ? 'pr-5 sm:pr-10 lg:justify-between'
        : 'flex-col'} {classes}"
    {style}
>
    <div
        class="flex-center relative z-10 flex-col gap-3 text-center {horizontal
            ? 'w-full lg:w-[50%] lg:!items-start lg:pl-[10%] lg:text-left 2xl:pl-[15%]'
            : ''}"
    >
        <p class="text-4xl font-bold lg:text-5xl">
            {@html title}
        </p>

        <p class="text-light text-xl lg:max-w-4xl">{@html text}</p>
    </div>

    {#if horizontal && wrapChildren}
        <div class="relative h-fit w-full lg:h-full lg:w-auto lg:flex-grow">
            {@render children?.()}
        </div>
    {:else}
        {@render children?.()}
    {/if}
</div>
