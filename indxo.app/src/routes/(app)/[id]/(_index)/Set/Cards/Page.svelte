<!--svelte-ignore non_reactive_update-->
<script lang="ts">
    import type { Term } from "$lib/documents";
    import Flashcard from "../Flashcard.svelte";
    import { getContext, onMount } from "svelte";
    import type { DocumentContext } from "../../+page.svelte";

    const document: DocumentContext = getContext("document");
    let FlashcardComponent: Flashcard;
    let Card: HTMLDivElement;
    let canCycle: boolean = $state.raw(true);
    let canFlip: boolean = $state.raw(true);
    let currentTermIndex: number = $state.raw(0);
    let termStateInvalidator: number = $state.raw(0); // This is used to trigger a term state update
    let term: Term = $derived.by(() => {
        termStateInvalidator;
        return document.data.terms[currentTermIndex];
    });

    /**
     * Restarts the study session by resetting all the state variables.
     *
     * @returns never
     */
    function restart() {
        canCycle = true;
        canFlip = true;
        currentTermIndex = 0;

        if (FlashcardComponent) FlashcardComponent.flipCard(false, false);
    }

    /**
     * Shuffle the terms in the set.
     *
     * @returns never
     */
    function shuffle() {
        restart();
        document.data.terms = [...document.data.terms].sort(() => Math.random() - 0.5);
        termStateInvalidator += 1;
    }

    onMount(() => {
        document.header.showActions = false;
    });
</script>

<Flashcard
    bind:currentTermIndex
    termCount={document.data.terms.length}
    currentTerm={{
        index: currentTermIndex + 1,
        ...term,
    }}
    bind:this={FlashcardComponent}
    bind:Card
    bind:canCycle
    bind:canFlip
    cycleButtons={{
        previous: {
            image: { properties: { class: "size-9" }, icon: "general/Arrows/Left" },
            text: "Previous",
            disabled: currentTermIndex === 0,
        },
        next: {
            image: { properties: { class: "size-9" }, icon: "general/Arrows/Right" },
            text: "Next",
            disabled: currentTermIndex >= document.data.terms.length - 1,
        },
    }}
    actionButtons={[
        {
            image: { icon: "general/Restart" },
            text: "Restart",
            onclick: restart,
        },
        {
            image: { icon: "general/Shuffle" },
            text: "Shuffle",
            onclick: shuffle,
        },
    ]}
/>
