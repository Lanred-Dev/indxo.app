<!--svelte-ignore non_reactive_update-->
<script lang="ts">
    import { getContext, onMount } from "svelte";
    import type { DocumentContext, DocumentHeaderContext } from "../../+page.svelte";
    import { beforeNavigate } from "$app/navigation";
    import type { Term, SortedSetMetadata, SortedTerm } from "$lib/documents";
    import Flashcards, { CycleDirection } from "../Flashcards.svelte";
    import { SvelteMap, SvelteSet } from "svelte/reactivity";
    import { animate } from "motion";
    import type { SessionContext } from "$lib/utils/global";
    import Results from "./Results.svelte";
    import ProgressBar from "./ProgressBar.svelte";

    const session: SessionContext = getContext("session");
    const document: DocumentContext = getContext("document");
    const documentHeader: DocumentHeaderContext = getContext("documentHeader");
    let currentTermIndex: number = $state.raw(0);
    let canCycle: boolean = $state.raw(true);
    let canFlip: boolean = $state.raw(true);
    let FlashcardsComponent: Flashcards;
    let Card: HTMLDivElement;
    let CardOverlay: HTMLDivElement;
    let terms: Term[] = $state.raw([]);
    let unsortedTerms: SvelteSet<string> = new SvelteSet();
    let stillLearningTerms: SvelteSet<string> = new SvelteSet();
    let knowTerms: SvelteSet<string> = new SvelteSet();
    let timesMissed: SvelteMap<string, number> = new SvelteMap();
    let strugglingTerms: SvelteSet<string> = new SvelteSet();
    let isLoaded: boolean = $state.raw(false);

    /**
     * Restarts the study session by resetting all the state variables.
     *
     * @returns never
     */
    function restart(withTerms: Term[]) {
        canCycle = true;
        canFlip = true;
        currentTermIndex = 0;

        terms = withTerms;
        terms.forEach(({ _id }: Term) => {
            unsortedTerms.add(_id);

            if (knowTerms.has(_id)) knowTerms.delete(_id);
            if (stillLearningTerms.has(_id)) stillLearningTerms.delete(_id);
        });

        if (FlashcardsComponent) FlashcardsComponent.flipCard(false, false);
    }

    /**
     * Shuffle the terms in the set.
     *
     * @returns never
     */
    function shuffle() {
        restart(terms);
        terms = [...terms].sort(() => Math.random() - 0.5);
    }

    /**
     * Handles the sorting of the terms. It will sort the terms into the knowTerms and stillLearningTerms arrays.
     *
     * @param direction The direction to sort the term in. -1 for still learning and 1 for know.
     * @returns never
     */
    async function cycle(direction: CycleDirection) {
        if (!canCycle) return;

        canCycle = false;
        canFlip = false;

        const { _id } = terms[currentTermIndex];

        switch (direction) {
            case CycleDirection.previous:
                stillLearningTerms.add(_id);
                timesMissed.set(_id, (timesMissed.get(_id) ?? 0) + 1);
                break;
            case CycleDirection.next:
                knowTerms.add(_id);
                timesMissed.set(_id, 0);
                break;
        }

        if (timesMissed.get(_id)! >= session.user.preferences.strugglingTermThreshold) {
            strugglingTerms.add(_id);
        } else {
            strugglingTerms.delete(_id);
        }

        unsortedTerms.delete(_id);

        // Apply a color overlay to the card to indicate the direction of the cycle and then animate it in
        CardOverlay.style.backgroundColor =
            direction === CycleDirection.next ? "var(--color-success)" : "var(--color-alert)";
        animate(
            CardOverlay,
            {
                opacity: [0, 0.3],
            },
            {
                duration: 0.2,
                ease: "easeInOut",
            }
        );

        await animate(
            Card,
            {
                opacity: [1, 0],
                translate: ["0%", direction === CycleDirection.next ? "8%" : "-8%"],
            },
            {
                duration: 0.3,
                ease: "easeInOut",
            }
        );

        canCycle = unsortedTerms.size > 0;

        if (canCycle) {
            canFlip = true;
            FlashcardsComponent.flipCard(false, false);

            CardOverlay.style.opacity = "0";
            animate(
                Card,
                {
                    opacity: [0, 1],
                    rotateX: [0, 0],
                    translate: ["0%", "0%"],
                },
                {
                    duration: 0.3,
                    ease: "easeInOut",
                }
            );
        } else {
            return; // `canCycle` will be false if there are no more unsorted terms
        }

        // If we are not at the end of the sorting then we need to show the next term
        const alreadySortedNextTerm: boolean = !unsortedTerms.has(
            document.terms[currentTermIndex + 1]?._id
        );

        if (currentTermIndex + 1 < document.terms.length - 1 && !alreadySortedNextTerm) {
            currentTermIndex++;
        } else if (alreadySortedNextTerm || unsortedTerms.size > 0) {
            currentTermIndex = document.terms.findIndex(
                ({ _id }: Term) => _id === unsortedTerms.values().next().value
            );
        }
    }

    onMount(async () => {
        documentHeader.showActions = false;

        const response = await fetch(`/api/user/${session.user._id}/metadata/sort/${document._id}`);
        const sortedSetMetadata: SortedSetMetadata = await response.json();

        restart(
            document.terms.filter(({ _id }: Term) => {
                if (_id in sortedSetMetadata.terms) {
                    const sortedTerm = sortedSetMetadata.terms[_id];

                    if (sortedTerm.sorted) {
                        if (sortedTerm.knows) {
                            stillLearningTerms.add(_id);
                        } else {
                            knowTerms.add(_id);
                        }
                    }

                    timesMissed.set(_id, sortedTerm.timesMissed);
                    return sortedTerm.sorted === false;
                } else {
                    // If the term is not in the saved array, it means it is not sorted yet
                    return true;
                }
            })
        );

        isLoaded = true;
    });

    beforeNavigate(async () => {
        if (!session.session) return;

        await fetch(`/api/user/${session.user._id}/metadata/sort/${document._id}`, {
            method: "PUT",
            body: JSON.stringify(
                Object.fromEntries(
                    document.terms.map((term: Term) => {
                        return [
                            term._id,
                            {
                                timesMissed: timesMissed.get(term._id) ?? 0,
                                sorted: knowTerms.has(term._id) || stillLearningTerms.has(term._id),
                                knows: knowTerms.has(term._id),
                            } satisfies SortedTerm,
                        ];
                    })
                )
            ),
        });
    });
</script>

{#if unsortedTerms.size > 0 && isLoaded}
    <ProgressBar
        knowTerms={knowTerms.size}
        stillLearningTerms={stillLearningTerms.size}
        strugglingTerms={strugglingTerms.size}
        terms={terms.length}
    />

    {@const term: Term = terms[currentTermIndex]}
    <Flashcards
        {cycle}
        termCount={terms.length}
        currentTerm={{
            index: currentTermIndex + 1,
            ...term,
        }}
        bind:this={FlashcardsComponent}
        bind:Card
        bind:canCycle
        bind:canFlip
        cycleButtons={{
            previous: {
                image: { properties: { class: "size-9" }, url: "/icons/general/X.svg" },
                text: "Still learning",
                onclick: () => {
                    cycle(CycleDirection.previous);
                },
                disabled: unsortedTerms.size === 0,
            },
            next: {
                image: { properties: { class: "size-9" }, url: "/icons/general/Check.svg" },
                text: "Know",
                onclick: () => {
                    cycle(CycleDirection.next);
                },
                disabled: unsortedTerms.size === 0,
            },
        }}
        actionButtons={[
            {
                image: { url: "/icons/general/Restart.svg" },
                text: "Restart",
                onclick: () => restart(terms),
            },
            {
                image: { url: "/icons/general/Shuffle.svg" },
                text: "Shuffle",
                onclick: shuffle,
            },
        ]}
    >
        {#snippet Overlay()}
            <div
                class="rounded-container pointer-events-none absolute top-0 left-0 z-5 h-full w-full opacity-0"
                bind:this={CardOverlay}
            ></div>
        {/snippet}
    </Flashcards>
{:else if isLoaded}
    <Results {knowTerms} {stillLearningTerms} {strugglingTerms} {terms} {restart} />
{/if}
