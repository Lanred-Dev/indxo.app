<script lang="ts">
    import EditableList from "$lib/components/Form/EditableList/EditableList.svelte";
    import type { Term } from "$lib/database/documents/Set";
    import type { SimplePrivateuser, SortingTerm } from "$lib/database/documents/User";
    import determineWording from "$lib/utils/determineWording";
    import { getContext } from "svelte";

    const { preferences }: SimplePrivateuser = getContext("user");

    let { saved, terms }: { saved: SortingTerm[]; terms: Term[] } = $props();
    let strugglingTerms: Term[] = $derived.by(() => {
        const terms: Term[] = [];

        saved.forEach(({ _id, missed }) => {
            if (missed < preferences.strugglingTermThreshold) return;

            terms.push(
                terms.find(({ _id: id }) => {
                    id === _id;
                })!
            );
        });

        return terms;
    });
</script>

<div class="list-primary mt-16">
    <p class="list-title">Struggling {determineWording("terms")}</p>

    <div class="list-primary">
        <ol class="flex flex-col gap-4">
            {#each strugglingTerms as term}
                <li class="container-primary flex">
                    <p class="mr-3 text-lg font-bold">#{terms.indexOf(term) + 1}</p>

                    <div>
                        <p class="text-lg font-bold">{term.term}</p>
                        <p class="mt-0.5 text-lg leading-none">{term.definition}</p>
                    </div>
                </li>
            {/each}
        </ol>
    </div>
</div>
