<script lang="ts">
    import SetCard from "./Cards/Set.svelte";
    import FolderCard from "./Cards/Folder.svelte";
    import { page } from "$app/state";
    import type { PublicFolder } from "$lib/database/documents/Folder";
    import type { PublicSet } from "$lib/database/documents/Set";
    import { millisecondsToMinutes } from "date-fns";
    import List from "./List.svelte";

    let { data } = $props();

    const DISTANCE_WORDING: [string, number][] = [
        ["Today", 1440],
        ["Yesterday", 2880],
        ["This week", 10080],
        ["This month", 43800],
        ["This year", 525600],
        ["A long time ago", Infinity],
    ];

    let type: string = $derived(page.params.slug);
    let filter: "none" | "created" | "subject" = $state("created");
    let groups: [(PublicFolder | PublicSet)[], string | null][] = $derived.by(() => {
        let groups: { [key: string]: (PublicFolder | PublicSet)[] } = {};

        data.documents.forEach((document) => {
            let group: string;

            if (filter === "created") {
                const created: number = millisecondsToMinutes(Date.now() - document.created);
                const [wording] = DISTANCE_WORDING.find(([_, distance]) => created < distance) as [
                    string,
                    number,
                ];
                group = wording;
            } else if (filter === "subject") {
                let subject: string = (document as PublicSet).subject;

                if (subject.length <= 0) {
                    subject = "No subject";
                }

                group = subject;
            } else {
                group = "";
            }

            if (!groups[group]) {
                groups[group] = [];
            }

            groups[group].push(document as any);
        });

        let groupsActual: [(PublicFolder | PublicSet)[], string | null][] = Object.entries(
            groups
        ).map(([name, items]) => [items, name]);

        groupsActual.forEach(([items]) => {
            items.sort((item1, item2) => {
                const item1Relative: number = Date.now() - item1.created;
                const item2Relative: number = Date.now() - item2.created;
                return item1Relative - item2Relative;
            });
        });

        groupsActual.sort(([_items1, group1], [_items2, group2]) => {
            const group1Index: number = DISTANCE_WORDING.findIndex(
                ([wording]) => wording === group1
            );
            const group2Index: number = DISTANCE_WORDING.findIndex(
                ([wording]) => wording === group2
            );
            return group1Index - group2Index;
        });

        return groupsActual;
    });
</script>

<h1 class="flex flex-col gap-4 pl-3">
    <span class="text-5xl font-bold">All of your</span>
    <span class="pl-44 font-Quetine text-7xl">{type}</span>
</h1>

<List {groups} CardComponent={(type === "folders" ? FolderCard : SetCard) as any} />
