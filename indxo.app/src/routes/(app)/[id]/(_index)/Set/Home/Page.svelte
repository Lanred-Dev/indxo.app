<!--svelte-ignore non_reactive_update-->
<script lang="ts">
    import type { Term } from "$lib/documents";
    import Flashcard from "../Flashcard.svelte";
    import { getContext, onMount } from "svelte";
    import type { DocumentContext } from "../../+page.svelte";
    import Terms from "./Terms.svelte";
    import Breakdown from "../Home/Breakdown.svelte";
    import Modes from "./Modes.svelte";

    const document: DocumentContext = getContext("document");
    let FlashcardComponent: Flashcard;
    let Card: HTMLDivElement;
    let canCycle: boolean = $state.raw(true);
    let canFlip: boolean = $state.raw(true);
    let currentTermIndex: number = $state.raw(0);
    let termStateInvalidator: number = $state.raw(0); // This is used to trigger a term state update
    let term: Term = $derived.by(() => {
        termStateInvalidator;
        // In most cases current term index should be in range, but due to hot reloading while the user is editing the set, it might go out of bounds
        return currentTermIndex in document.data.terms
            ? document.data.terms[currentTermIndex]
            : document.data.terms[0];
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
        document.header.showActions = true;
    });

    // Resets the progress during hot reloading if a term is deleted or added
    let lastTermsLength: number = document.data.terms.length;
    $effect.pre(() => {
        if (lastTermsLength <= document.data.terms.length) return;

        lastTermsLength = document.data.terms.length;
        restart();
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

<Breakdown />

<Modes />

<Terms />
