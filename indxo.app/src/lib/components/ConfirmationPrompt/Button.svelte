<script lang="ts">
    import { DialogTrigger } from "$lib/components/Dialog";
    import type { Snippet } from "svelte";
    import type { ClassValue } from "svelte/elements";

    let {
        class: className,
        onclick,
        children,
    }: {
        class?: ClassValue;
        onclick?: () => void;
        children: Snippet<[]>;
    } = $props();
</script>

<DialogTrigger {onclick} class={className}>
    {@render children()}
</DialogTrigger>
