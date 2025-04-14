<script lang="ts">
    import Search, { type sortFilter } from "./Search.svelte";
    import { page } from "$app/state";
    import type { PublicSet } from "$lib/database/documents/Set";
    import { millisecondsToMinutes } from "date-fns";
    import determineWording from "$lib/utils/determineWording";
    import { afterNavigate } from "$app/navigation";
    import Group, { type group } from "./Group.svelte";

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

    let { data } = $props();

    let type: "sets" | "folders" | "favorites" = $derived(page.params.slug as any);
    let searchQuery: string = $state.raw("");
    // This filter is the one that the user has set, is not always the one that is being used
    let userSortFilter: sortFilter = $state.raw("created");
    let actualSortFilter: sortFilter = $derived.by(() => {
        if (searchQuery.length > 0) return "none";

        return userSortFilter;
    });
    let groups: group[] = $derived.by(() => {
        let groups: group[] = [];

        data.documents.forEach((document) => {
            // Check if it matches the search query
            if (searchQuery.length > 0) {
                let matches: boolean = false;

                if (
                    document.name.toLowerCase().includes(searchQuery) ||
                    document.description.toLowerCase().includes(searchQuery)
                )
                    matches = true;

                // If it has a subject, check the subject
                if ("subject" in document && document.subject.toLowerCase().includes(searchQuery))
                    matches = true;

                if (!matches) return;
            }

            let group: string = "";

            if (actualSortFilter === "created") {
                const created: number = millisecondsToMinutes(Date.now() - document.created);
                const [wording] = DISTANCE_WORDING.find(([_, distance]) => created < distance)!;
                group = wording;
            } else if (actualSortFilter === "subject" && "subject" in document) {
                let subject: string = (document as PublicSet).subject;

                if (subject.length <= 0) {
                    subject = "No subject";
                }

                group = subject;
            } else if (actualSortFilter === "alphabetical" && document.name.length > 0) {
                group = document.name[0].toUpperCase();
            }

            if (!groups[groups.findIndex(({ name }) => name === group)])
                groups.push({ name: group, items: [] });

            groups[groups.findIndex(({ name }) => name === group)].items.push(document);
        });

        // Sort each groups items by the created date
        if (actualSortFilter !== "none") {
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
            if (actualSortFilter === "created") {
                const group1Index: number = DISTANCE_WORDING.findIndex(
                    ([wording]) => wording === group1
                );
                const group2Index: number = DISTANCE_WORDING.findIndex(
                    ([wording]) => wording === group2
                );
                return group1Index - group2Index;
            } else if (
                (actualSortFilter === "subject" || actualSortFilter === "alphabetical") &&
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

    afterNavigate((navigation) => {
        if (!navigation.to?.url.pathname.includes("/my/")) return;

        userSortFilter = type === "favorites" ? "alphabetical" : "created";
    });
</script>

<svelte:head>
    <title>Your {determineWording(type)}</title>
</svelte:head>

<div class="page-title">
    <p>Browse your library</p>
    <h1>Your {determineWording(type)}</h1>
</div>

<Search
    bind:searchQuery
    bind:userSortFilter
    hideSubjectFilter={type === "folders" ? true : false}
/>

<div class="w-full space-y-10">
    {#each groups as group}
        <Group {...group} />
    {/each}
</div>
