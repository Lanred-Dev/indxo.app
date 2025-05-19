<script lang="ts">
    import type { Term } from "$lib/database/documents/Set";
    import { animate } from "motion";
    import Controls from "../Controls.svelte";
    import TermCard from "../TermCard.svelte";
    import { afterNavigate } from "$app/navigation";

    let terms: Term[] = $props();

    // svelte-ignore non_reactive_update
    let card: HTMLDivElement;
    // svelte-ignore non_reactive_update
    let termCardComponent: TermCard;
    let canCycle: boolean = $state.raw(true);
    let canFlip: boolean = $state.raw(true);
    let currentTermIndex: number = $state.raw(0);
    // `actualTerms` has to be its own state because if not svelte will not reactively update the terms when they are shuffled and the currentTermIndex is already 0.
    let actualTerms: Term[] = $state.raw(terms);

    /**
     * Cycle through the terms in the set.
     *
     * @param direction The direction to cycle in. -1 for previous and 1 for next or during sort mode, 1 for knows term and -1 for still learning term
     * @returns never
     */
    async function cycle(direction: -1 | 1) {
        if (currentTermIndex + direction < 0 || currentTermIndex + direction > terms.length - 1)
            return;

        currentTermIndex += direction;
        termCardComponent.flipCard(false, false);
        canFlip = false;

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

        if (termCardComponent) termCardComponent.flipCard(false, false);
    }

    /**
     * Shuffle the terms in the set.
     *
     * @returns never
     */
    function shuffle() {
        canCycle = true;
        canFlip = true;
        currentTermIndex = 0;
        actualTerms = [...actualTerms].sort(() => Math.random() - 0.5);
    }

    afterNavigate(() => {
        actualTerms = terms;
        restart();
    });
</script>

{#if actualTerms.length === 0}
    <div
        class="flex-center sm:aspect-2 my-20 aspect-[1.1] max-h-68 w-full flex-col gap-1 outline-none md:my-24"
    >
        <p class="text-3xl font-bold">Houston, we have a problem.</p>
        <p class="text-xl">This set has no terms!</p>
    </div>
{:else}
    <TermCard
        term={actualTerms[currentTermIndex]?.term}
        definition={actualTerms[currentTermIndex]?.definition}
        bind:card
        bind:canCycle
        bind:canFlip
        bind:this={termCardComponent}
    />

    <Controls
        {cycle}
        progress={[actualTerms.length, currentTermIndex + 1]}
        cycleButtons={{
            "-1": {
                icon: "/icons/general/LeftArrow.svg",
                text: "Previous",
                disabled: currentTermIndex === 0,
            },
            "1": {
                icon: "/icons/general/RightArrow.svg",
                text: "Next",
                disabled: currentTermIndex >= actualTerms.length - 1,
            },
        }}
        actionButtons={[
            {
                icon: "/icons/general/Restart.svg",
                text: "Restart",
                onClick: restart,
            },
            {
                icon: "/icons/general/Shuffle.svg",
                text: "Shuffle",
                onClick: shuffle,
            },
        ]}
    />
{/if}
