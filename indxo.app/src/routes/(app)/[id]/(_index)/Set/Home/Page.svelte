<!--svelte-ignore non_reactive_update-->
<script lang="ts">
    import type { Term } from "$lib/documents";
    import { animate } from "motion";
    import Flashcards, { CycleDirection } from "../Flashcards.svelte";
    import { getContext, onMount } from "svelte";
    import type { DocumentContext, DocumentHeaderContext } from "../../+page.svelte";
    import Terms from "./Terms.svelte";
    import Breakdown from "../Home/Breakdown.svelte";
    import Modes from "./Modes.svelte";

    const document: DocumentContext = getContext("document");
    const documentHeader: DocumentHeaderContext = getContext("documentHeader");
    let FlashcardsComponent: Flashcards;
    let Card: HTMLDivElement;
    let canCycle: boolean = $state.raw(true);
    let canFlip: boolean = $state.raw(true);
    let currentTermIndex: number = $state.raw(0);
    // In most cases current term index should be in range, but due to hot reloading while the user is editing the set, it might go out of bounds
    let term: Term = $derived.by(() =>
        currentTermIndex in document.terms ? document.terms[currentTermIndex] : document.terms[0]
    );

    /**
     * Cycle through the terms in the set.
     *
     * @param direction The direction to cycle in. -1 for previous and 1 for next or during sort mode, 1 for knows term and -1 for still learning term
     * @returns never
     */
    async function cycle(direction: -1 | 1) {
        if (
            currentTermIndex + direction < 0 ||
            currentTermIndex + direction > document.terms.length - 1
        )
            return;

        currentTermIndex += direction;
        FlashcardsComponent!.flipCard(false, false);
        canFlip = false;

        await animate(
            Card!,
            {
                opacity: [0, 1],
                rotateX: [0, 0],
                rotateY: [direction === 1 ? -15 : 15, 0],
                translate: [direction === 1 ? "8%" : "-8%", "0%"],
            },
            {
                duration: 0.3,
                ease: "easeInOut",
            }
        );

        canFlip = true;
    }

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

    onMount(() => {
        documentHeader.showActions = true;
    });

    // Resets the progress during hot reloading if a term is deleted or added
    let lastTermsLength: number = document.terms.length;
    $effect.pre(() => {
        if (lastTermsLength <= document.terms.length) return;

        lastTermsLength = document.terms.length;
        restart();
    });
</script>

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
/>

<Breakdown />

<Modes />

<Terms />
