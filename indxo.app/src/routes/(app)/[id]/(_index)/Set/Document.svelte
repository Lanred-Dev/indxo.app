<script lang="ts">
    import { page } from "$app/state";
    import { StudyMode } from "$lib/documents";
    import type { Component } from "svelte";
    import CardsPage from "./Cards/Page.svelte";
    import SortPage from "./Sort/Page.svelte";

    const PageComponent: Component<any> = $derived.by(() => {
        switch (page.url.searchParams.get("m")) {
            case StudyMode.sort:
                return SortPage;
            default:
                return CardsPage;
        }
    });
</script>

<PageComponent />
