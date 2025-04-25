<script lang="ts">
    import type { Term } from "$lib/database/documents/Set";
    import { animate } from "motion";
    import Controls from "../Controls.svelte";
    import TermCard from "../TermCard.svelte";

    let terms: Term[] = $props();

    // svelte-ignore non_reactive_update
    let card: HTMLDivElement;
    // svelte-ignore non_reactive_update
    let cardOverlay: HTMLDivElement;
    // svelte-ignore non_reactive_update
    let termCardComponent: TermCard;
    let canCycle: boolean = $state.raw(true);
    let canFlip: boolean = $state.raw(true);
    let currentTermIndex: number = $state.raw(0);

    /**
     * Shuffle the terms in the set. Resets the current term to the first one.
     *
     * @returns never
     */
    function shuffle() {
        termCardComponent.flipCard(false, false);
        currentTermIndex = 0;
        terms.sort(() => Math.random() - 0.5);
    }

    /**
     * Cycle through the terms in the set.
     *
     * @param direction The direction to cycle in. -1 for previous and 1 for next or during sort mode, 1 for knows term and -1 for still learning term
     * @returns never
     */
    async function cycle(direction: -1 | 1) {
        if (currentTermIndex + direction < 0 || currentTermIndex + direction > terms.length) return;

        currentTermIndex += direction;

        await animate(
            card,
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
        termCardComponent.flipCard(false, false);
        shuffle();
    }
</script>

{#if terms.length === 0}
    <p class="my-20 text-center text-lg font-bold md:my-24">This set has no terms</p>
{:else}
    <TermCard
        term={terms[currentTermIndex].term}
        definition={terms[currentTermIndex].definition}
        bind:card
        bind:canCycle
        bind:canFlip
        bind:this={termCardComponent}
    />

    <Controls
        {cycle}
        progress={[terms.length, currentTermIndex + 1]}
        cycleButtons={{
            "-1": {
                icon: "/assets/icons/arrow-left.svg",
                text: "Still learning",
                disabled: currentTermIndex === 0,
            },
            "1": {
                icon: "/assets/icons/arrow-right.svg",
                text: "Know",
                disabled: currentTermIndex >= terms.length - 1,
            },
        }}
    />
{/if}
