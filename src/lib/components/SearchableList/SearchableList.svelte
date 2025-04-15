<script lang="ts">
    import type { PublicSet } from "$lib/database/documents/Set";
    import { millisecondsToMinutes } from "date-fns";
    import CardGroup, { type Group } from "./CardGroup.svelte";
    import type { PublicFolder } from "$lib/database/documents/Folder";
    import type { ItemProperties } from "../Dropdown.svelte";
    import Search, { type SortFilters } from "./Search.svelte";

    const DISTANCE_WORDING: [string, number][] = [
        ["Just now", 1],
        ["A few minutes ago", 5],
        ["A few hours ago", 60],
        ["Today", 1440],
        ["Yesterday", 2880],
        ["This week", 10080],
        ["This month", 43800],
        ["This year", 525600],
        ["A long time ago", Infinity],
    ];

    let {
        items = [],
        filters = [],
        filter = $bindable("created"),
    }: {
        items: (PublicSet | PublicFolder)[];
        filters: ItemProperties[];
        filter?: SortFilters;
    } = $props();

    let query: string = $state.raw("");
    // This filter is the one that the user has set, is not always the one that is being used
    let actualFilter: SortFilters = $derived.by(() => {
        if (query.length > 0) return "none";

        return filter;
    });
    let groups: Group[] = $derived.by(() => {
        let groups: Group[] = [];

        items.forEach((item) => {
            // Check if it matches the search query
            if (query.length > 0) {
                let matches: boolean = false;

                if (
                    item.name.toLowerCase().includes(query) ||
                    item.description.toLowerCase().includes(query)
                )
                    matches = true;

                // If it has a subject, check the subject
                if ("subject" in item && item.subject.toLowerCase().includes(query)) matches = true;

                if (!matches) return;
            }

            let group: string = "";

            if (actualFilter === "created") {
                const created: number = millisecondsToMinutes(Date.now() - item.created);
                const [wording] = DISTANCE_WORDING.find(([_, distance]) => created < distance)!;
                group = wording;
            } else if (actualFilter === "subject" && "subject" in item) {
                let subject: string = (item as PublicSet).subject;

                if (subject.length <= 0) subject = "No subject";

                group = subject;
            } else if (actualFilter === "alphabetical" && item.name.length > 0) {
                group = item.name[0].toUpperCase();
            }

            if (!groups[groups.findIndex(({ name }) => name === group)])
                groups.push({ name: group, items: [] });

            groups[groups.findIndex(({ name }) => name === group)].items.push(item);
        });

        // Sort each groups items by the created date
        if (actualFilter !== "none") {
            groups.forEach(({ items }) => {
                items.sort((item1, item2) => {
                    const item1Relative: number = Date.now() - item1.created;
                    const item2Relative: number = Date.now() - item2.created;
                    return item1Relative - item2Relative;
                });
            });
        }

        // Sort the groups based on the sort filter
        groups.sort(({ name: group1 }, { name: group2 }) => {
            if (actualFilter === "created") {
                const group1Index: number = DISTANCE_WORDING.findIndex(
                    ([wording]) => wording === group1
                );
                const group2Index: number = DISTANCE_WORDING.findIndex(
                    ([wording]) => wording === group2
                );
                return group1Index - group2Index;
            } else if (
                (actualFilter === "subject" || actualFilter === "alphabetical") &&
                group1 &&
                group2
            ) {
                return group1.localeCompare(group2);
            } else {
                return 0;
            }
        });

        return groups;
    });
</script>

<Search bind:query bind:filter {filters} />

<div class="w-full space-y-10">
    {#each groups as group}
        <CardGroup {...group} />
    {/each}
</div>
