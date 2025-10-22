<!--TODO: improve sorting functionality (cleanup basically)-->

<!--svelte-ignore non_reactive_update-->
<script lang="ts">
    import { getContext } from "svelte";
    import type { DocumentContext } from "../../+page.svelte";
    import { beforeNavigate } from "$app/navigation";
    import type { SortedTerm, Term } from "$lib/documents";
    import Flashcards, { CycleDirection } from "../Flashcards.svelte";
    import { SvelteMap, SvelteSet } from "svelte/reactivity";
    import { animate } from "motion";

    const document: DocumentContext = getContext("document");
    let currentTermIndex: number = $state.raw(0);
    let canCycle: boolean = $state.raw(true);
    let canFlip: boolean = $state.raw(true);
    let FlashcardsComponent: Flashcards;
    let Card: HTMLDivElement;
    let CardOverlay: HTMLDivElement;
    let unsortedTerms: SvelteSet<string> = new SvelteSet(
        document.terms
            .filter((term: Term) => {
                const matchedTerm: SortedTerm | undefined = document.saved.find(
                    ({ _id }: SortedTerm) => _id === term._id
                );

                if (matchedTerm) {
                    return !matchedTerm.sorted;
                } else {
                    // If the term is not in the saved array, it means it is not sorted yet
                    return true;
                }
            })
            .map(({ _id }: Term) => _id)
    );
    let stillLearningTerms: SvelteSet<string> = new SvelteSet();
    let knowTerms: SvelteSet<string> = new SvelteSet();
    let strugglingTerms: SvelteMap<string, number> = new SvelteMap();

    /**
     * Restarts the study session by resetting all the state variables.
     *
     * @returns never
     */
    function restart() {
        canCycle = true;
        canFlip = true;
        currentTermIndex = 0;

        if (FlashcardsComponent) FlashcardsComponent.flipCard(false, false);
    }

    /**
     * Shuffle the terms in the set.
     *
     * @returns never
     */
    function shuffle() {
        restart();
        document.terms = [...document.terms].sort(() => Math.random() - 0.5);
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

        const id: string = document.terms[currentTermIndex]._id;

        switch (direction) {
            case CycleDirection.previous:
                stillLearningTerms.add(id);
                strugglingTerms.set(id, (strugglingTerms.get(id) ?? 0) + 1);
            case CycleDirection.next:
                knowTerms.add(id);
                strugglingTerms.set(id, 0);
                break;
        }

        unsortedTerms.delete(id);

        // Apply a color overlay to the card to indicate the direction of the cycle and then animate it in
        CardOverlay.style.backgroundColor =
            direction === CycleDirection.next ? "#4caf50" : "#f26a63";
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

    // TODO: save progress
    beforeNavigate(() => {});
</script>

{#if unsortedTerms.size > 0}
    {@const term: Term = document.terms[currentTermIndex]}
    <Flashcards
        {cycle}
        termCount={document.terms.length}
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
                image: { properties: { class: "size-9" }, url: "/icons/general/LeftArrow.svg" },
                text: "Previous",
                onclick: () => {
                    cycle(CycleDirection.previous);
                },
                disabled: currentTermIndex === 0,
            },
            next: {
                image: { properties: { class: "size-9" }, url: "/icons/general/RightArrow.svg" },
                text: "Next",
                onclick: () => {
                    cycle(CycleDirection.next);
                },
                disabled: currentTermIndex >= document.terms.length - 1,
            },
        }}
        actionButtons={[
            {
                image: { url: "/icons/general/Restart.svg" },
                text: "Restart",
                onclick: restart,
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
                class="rounded-container absolute top-0 left-0 z-[5] h-full w-full opacity-0"
                bind:this={CardOverlay}
            ></div>
        {/snippet}</Flashcards
    >
{:else}{/if}
