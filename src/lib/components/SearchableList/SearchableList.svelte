<script lang="ts">
    import type { PublicSet } from "$lib/database/documents/Set";
    import { millisecondsToMinutes } from "date-fns";
    import CardGroup, { type CardGroupProperties } from "./CardGroup.svelte";
    import type { PublicFolder } from "$lib/database/documents/Folder";
    import type { ItemProperties as DropdownItemProperties } from "../Form/Dropdown.svelte";
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
        filters: DropdownItemProperties[];
        filter?: SortFilters;
    } = $props();

    let query: string = $state.raw("");
    // This filter is the one that the user has set, is not always the one that is being used
    let actualFilter: SortFilters = $derived.by(() => {
        if (query.length > 0) return "none";

        return filter;
    });
    let groups: CardGroupProperties[] = $derived.by(() => {
        let groups: CardGroupProperties[] = [];

        if (items.length <= 0) return groups;

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
                groups.push({ name: group, documents: [] });

            groups[groups.findIndex(({ name }) => name === group)].documents.push(item);
        });

        // Sort each groups items by the created date
        if (actualFilter !== "none") {
            groups.forEach(({ documents }) => {
                documents.sort((document1, document2) => {
                    const relative1: number = Date.now() - document1.created;
                    const relative2: number = Date.now() - document2.created;
                    return relative1 - relative2;
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

<div class="flex w-full flex-col gap-10">
    {#each groups as group}
        <CardGroup {...group} />
    {/each}
</div>
