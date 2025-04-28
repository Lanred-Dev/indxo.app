<script lang="ts">
    import type { Term } from "$lib/database/documents/Set";
    import { animate } from "motion";
    import { getContext } from "svelte";
    import TermCard from "../../TermCard.svelte";
    import Progress from "./Progress.svelte";
    import type { Session } from "$lib/database/documents/Session";
    import Controls from "../../Controls.svelte";
    import { beforeNavigate } from "$app/navigation";
    import { SvelteMap, SvelteSet } from "svelte/reactivity";

    const STRUGGLING_TERM_THRESHOLD: number = 3;

    let { data } = $props();

    const session: Session = getContext("session");

    // svelte-ignore non_reactive_update
    let card: HTMLDivElement;
    // svelte-ignore non_reactive_update
    let cardOverlay: HTMLDivElement;
    // svelte-ignore non_reactive_update
    let termCardComponent: TermCard;
    let canCycle: boolean = $state.raw(true);
    let canFlip: boolean = $state.raw(true);
    let currentTermIndex: number = $state.raw(
        data.set.terms.findIndex(
            ({ _id }) =>
                _id ===
                (data.saved.filter(({ sorted }) => !sorted)[0]?._id ?? data.set.terms[0]._id)
        )
    );

    let actualTerms: Term[] = $state.raw(data.set.terms);
    let unsortedTerms: SvelteSet<string> = new SvelteSet(
        data.saved.filter(({ sorted }) => !sorted).map(({ _id }) => _id)
    );
    let stillLearningTerms: SvelteSet<string> = new SvelteSet(
        data.saved.filter(({ knows, sorted }) => !knows && sorted).map(({ _id }) => _id)
    );
    let knowTerms: SvelteSet<string> = new SvelteSet(
        data.saved.filter(({ knows, sorted }) => knows && sorted).map(({ _id }) => _id)
    );
    let struggling: SvelteMap<string, number> = data.saved.reduce((object, { _id, missed }) => {
        if (missed >= STRUGGLING_TERM_THRESHOLD) {
            object.set(_id, missed);
        }

        return object;
    }, new SvelteMap<string, number>());

    /**
     * Shuffle the terms in the set. Resets the current term to the first one.
     *
     * @returns never
     */
    function shuffle() {
        termCardComponent.flipCard(false, false);
        currentTermIndex = 0;
        actualTerms.sort(() => Math.random() - 0.5);
    }

    /**
     * Restarts the study session by resetting all the state variables.
     *
     * @param withTerms The terms to study. Defaults to all terms in the set.
     * @param fullReset Whether to reset the knowTerms and stillLearningTerms arrays. Defaults to true.
     * @returns never
     */
    function restart(
        withTerms: string[] = data.set.terms.map(({ _id }) => _id),
        fullReset: boolean = true
    ) {
        canCycle = true;
        canFlip = true;
        currentTermIndex = 0;
        actualTerms = data.set.terms.filter(({ _id }) => withTerms.includes(_id));
        termCardComponent.flipCard(false, false);
        shuffle();

        if (fullReset) {
            knowTerms.clear();
            stillLearningTerms.clear();
        }
    }

    /**
     * Handles the sorting of the terms. It will sort the terms into the knowTerms and stillLearningTerms arrays.
     *
     * @param direction The direction to sort the term in. -1 for still learning and 1 for know.
     * @returns never
     */
    async function cycle(knows: -1 | 1) {
        if (!canCycle) return;

        canCycle = false;
        canFlip = false;

        const id: string = actualTerms[currentTermIndex]._id;

        if (knows === 1) {
            knowTerms.add(id);
        } else if (knows === -1) {
            stillLearningTerms.add(id);
        }

        unsortedTerms.delete(id);

        // Apply a color overlay to the card to indicate the direction of the cycle and then animate it in
        cardOverlay.style.backgroundColor = knows === 1 ? "#4caf50" : "#f26a63";
        animate(
            cardOverlay,
            {
                opacity: [0, 0.3],
            },
            {
                duration: 0.2,
                ease: "easeInOut",
            }
        );

        await animate(
            card,
            {
                opacity: [1, 0],
                translate: ["0%", knows === 1 ? "8%" : "-8%"],
            },
            {
                duration: 0.3,
                ease: "easeInOut",
            }
        );

        canCycle = unsortedTerms.size > 0;

        if (canCycle) {
            canFlip = true;
            termCardComponent.flipCard(false, false);

            cardOverlay.style.opacity = "0";
            animate(
                card,
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
            actualTerms[currentTermIndex + 1]?._id
        );

        if (currentTermIndex + 1 < actualTerms.length - 1 && !alreadySortedNextTerm) {
            currentTermIndex++;
        } else if (alreadySortedNextTerm || unsortedTerms.size > 0) {
            currentTermIndex = actualTerms.findIndex(
                ({ _id }) => _id === unsortedTerms.values().next().value
            );
        }
    }

    beforeNavigate(async () => {
        if (session === null) return;

        data.saved = [];

        knowTerms.forEach((_id) => {
            data.saved.push({
                _id,
                knows: true,
                missed: struggling.get(_id) ?? 0,
                sorted: true,
            });
        });

        stillLearningTerms.forEach((_id) => {
            data.saved.push({
                _id,
                knows: false,
                missed: struggling.get(_id) ?? 0,
                sorted: true,
            });
        });

        unsortedTerms.forEach((_id) => {
            data.saved.push({
                _id,
                knows: false,
                missed: struggling.get(_id) ?? 0,
                sorted: false,
            });
        });

        await fetch(`/api/documents/set/${data.set._id}/sorting/update`, {
            method: "POST",
            body: JSON.stringify(data.saved),
        });
    });
</script>

{#if unsortedTerms.size === 0}
    <p>PLACEHOLDER</p>
{:else}
    <Progress
        stillLearning={stillLearningTerms.size}
        knows={knowTerms.size}
        terms={actualTerms.length}
    />

    <TermCard
        term={actualTerms[currentTermIndex].term}
        definition={actualTerms[currentTermIndex].definition}
        bind:card
        bind:canCycle
        bind:canFlip
        bind:this={termCardComponent}
    >
        {#snippet overlay()}
            <div
                class="rounded-primary absolute top-0 left-0 z-[5] h-full w-full opacity-0"
                bind:this={cardOverlay}
            ></div>
        {/snippet}
    </TermCard>

    <Controls
        {cycle}
        progress={[actualTerms.length, currentTermIndex + 1]}
        cycleButtons={{
            "-1": {
                icon: "/icons/general/X.svg",
                label: "Still learning",
                disabled: unsortedTerms.size === 0,
            },
            "1": {
                icon: "/icons/general/Check.svg",
                label: "Know",
                disabled: unsortedTerms.size === 0,
            },
        }}
    />
{/if}
