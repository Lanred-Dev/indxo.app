<script lang="ts">
    import { onMount, type Snippet } from "svelte";
    import { twMerge } from "tailwind-merge";

    export type props = {
        action: string;
        method?: "POST" | "GET";
        classes?: string;
        children?: Snippet<[]>;
    };

    let { action, method = "POST", classes, children }: props = $props();
</script>

<form class={twMerge("space-y-5", classes)} {method} {action}>
    {@render children?.()}
</form>
