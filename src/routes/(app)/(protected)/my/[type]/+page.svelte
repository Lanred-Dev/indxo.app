<script lang="ts">
    import {
        SearchableListContent,
        SearchableListFilters,
        SearchableListSearchbar,
    } from "$lib/components/Lists/Searchable";
    import SearchableList from "$lib/components/Lists/Searchable/SearchableList.svelte";
    import { MyPageType } from "$lib/utils/routing";

    let { data } = $props();

    const { title, description }: { title: string; description: string } = $derived.by(() => {
        switch (data.type) {
            case MyPageType.favorites:
                return {
                    title: "My Favorites",
                    description: "A collection of your favorite items.",
                };
            case MyPageType.folders:
                return {
                    title: "My Folders",
                    description: "All the folders you've created to organize your stuff.",
                };
            case MyPageType.sets:
                return {
                    title: "My Sets",
                    description: "Your own sets—full of terms and study stuff you’ve put together.",
                };
        }
    });
</script>

<div class="page-title">
    <h1 class="title">{title}</h1>
    <p class="description">{description}</p>
</div>

<SearchableList documents={data.documents}>
    <SearchableListSearchbar
        filters={[
            SearchableListFilters.alphabetical,
            SearchableListFilters.created,
            SearchableListFilters.none,
        ]}
    />
    <SearchableListContent />
</SearchableList>
