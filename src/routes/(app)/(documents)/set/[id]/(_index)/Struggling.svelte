<script lang="ts">
    import type { Term } from "$lib/database/documents/Set";
    import type { SimplePrivateuser, SortingTerm } from "$lib/database/documents/User";
    import determineWording from "$lib/utils/determineWording";
    import { getContext } from "svelte";
    import TermCard from "./TermCard.svelte";

    let { saved, terms }: { saved: SortingTerm[]; terms: Term[] } = $props();

    const { preferences }: SimplePrivateuser = getContext("user");
    let strugglingTerms: Term[] = $derived(
        terms.filter(
            ({ _id }) =>
                (saved.find(({ _id: id }) => id === _id)?.missed ?? 0) >=
                preferences.strugglingTermThreshold
        )
    );
</script>

{#if strugglingTerms.length > 0}
    <div class="list-primary mt-16">
        <p class="list-title">Struggling {determineWording("terms")}</p>

        <div class="list-primary">
            <ol class="flex flex-col gap-4">
                {#each strugglingTerms as term}
                    <TermCard
                        {term}
                        missed={saved.find(({ _id }) => _id === term._id)?.missed}
                        listID={terms.indexOf(term) + 1}
                    />
                {/each}
            </ol>
        </div>
    </div>
{/if}
