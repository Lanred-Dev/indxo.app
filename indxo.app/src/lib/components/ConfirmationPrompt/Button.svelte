<script lang="ts">
    import { DialogTrigger } from "$lib/components/Dialog";
    import type { Snippet } from "svelte";
    import type { ClassValue } from "svelte/elements";

    let {
        class: className,
        onClick,
        children,
    }: {
        class?: ClassValue;
        onClick?: () => void;
        children: Snippet<[]>;
    } = $props();
</script>

<DialogTrigger {onClick} class={className}>
    {@render children()}
</DialogTrigger>
