<script lang="ts">
    import { page } from "$app/state";
    import { StudyMode } from "$lib/documents";
    import type { Component } from "svelte";
    import CardsPage from "./Cards/Page.svelte";
    import SortPage from "./Sort/Page.svelte";

    let mode: string = $derived(page.url.searchParams.get("m") ?? "");

    const PageComponent: Component<any> = $derived.by(() => {
        switch (mode) {
            case StudyMode.sort:
                return SortPage;
            default:
                return CardsPage;
        }
    });
</script>

<PageComponent />
