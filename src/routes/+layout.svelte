<script lang="ts">
    import "../app.css";
    import { getTheme } from "$lib/scripts/theme";
    import { onMount, type Snippet } from "svelte";

    let { children }: { children: Snippet<[]> } = $props();

    // Prevent a flash of unstyled content when changing pages or themes.
    onMount(() => {
        if (getTheme() === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    });
</script>

{@render children?.()}
