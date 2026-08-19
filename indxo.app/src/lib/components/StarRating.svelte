<script lang="ts">
    import type { ClassValue } from "svelte/elements";
    import Icon from "./Icon.svelte";

    let {
        maxRating = 5,
        rating,
        reviews,
        baseColor = "var(--color-secondary)",
        activeColor = "var(--color-attention)",
        class: className,
    }: {
        maxRating?: number;
        rating: number;
        reviews?: number;
        baseColor?: string;
        activeColor?: string;
        class?: ClassValue;
    } = $props();
</script>

<div class={["flex-center gap-px", className]}>
    {#each Array(maxRating) as _, index}
        <Icon
            icon="general/Star"
            class="size-6"
            style="color: {index < rating ? activeColor : baseColor}"
        />
    {/each}

    <p class="flex-center ml-1">
        <span class="font-medium">{rating.toFixed(1)}</span>

        {#if typeof reviews === "number"}
            <span class="text-light ml-0.5 text-sm">({reviews})</span>
        {/if}
    </p>
</div>
