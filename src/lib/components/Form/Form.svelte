<script lang="ts">
    import type { Snippet } from "svelte";
    import { twMerge } from "tailwind-merge";

    export type props = {
        action: string;
        method?: "POST" | "GET";
        classes?: string;
        children?: Snippet<[]>;
    };

    let { action, method = "GET", classes, children }: props = $props();
</script>

<form class={twMerge("space-y-5", classes)} {method} {action}>
    {@render children?.()}
</form>
