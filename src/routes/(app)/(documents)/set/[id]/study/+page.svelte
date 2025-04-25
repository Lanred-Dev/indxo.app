<script lang="ts">
    import type { Term } from "$lib/database/documents/Set";
    import { animate } from "motion";
    import { getContext, onDestroy, onMount } from "svelte";
    import TermCard from "../TermCard.svelte";
    import { fade } from "svelte/transition";
    import determineWording from "$lib/utils/determineWording";
    import Stats from "./Stats.svelte";
    import type { Session } from "$lib/database/documents/Session";
    import Controls from "../Controls.svelte";

    const STRUGGLING_TERM_THRESHOLD: number = 3;

    const SORTING_MESSAGES: [number, string[]][] = [
        [0, ["You're still learning.", "You've got room to grow."]],
        [0.5, ["You know this.", "You're doing great."]],
        [1, ["Awesome!", "You're a genius."]],
    ];

    let { data } = $props();

    const sidebarVisible: { visible: boolean } = getContext("sidebarVisible");
    const session: Session = getContext("session");

    // svelte-ignore non_reactive_update
    let card: HTMLDivElement;
    // svelte-ignore non_reactive_update
    let cardOverlay: HTMLDivElement;
    // svelte-ignore non_reactive_update
    let termCardComponent: TermCard;
    let canCycle: boolean = $state.raw(true);
    let canFlip: boolean = $state.raw(true);
    let currentTermIndex: number = $state.raw(0);

    let actualTerms: Term[] = $state(data.set.terms);
    let stillLearningTerms: string[] = $state(
        data.savedSorting.filter(([_id, knows]) => knows === -1).map(([id]) => id)
    );
    let knowTerms: string[] = $state(
        data.savedSorting.filter(([_id, knows]) => knows === 1).map(([id]) => id)
    );
    let strugglingTerms: string[] = $state(
        data.savedSorting
            .filter(([_id, _knows, timesMissed]) => timesMissed >= STRUGGLING_TERM_THRESHOLD)
            .map(([id]) => id)
    );
    let timesMissedCounter: { [id: string]: number } = data.savedSorting.reduce(
        (object, [id, _knows, timesMissed]) => {
            object[id] = timesMissed;
            return object;
        },
        {} as { [id: string]: number }
    );
    let sortingTerms: string[] = data.set.terms.map(({ _id }) => _id);
    let unsortedTerms: string[] = $state.raw(
        sortingTerms.filter((id) => !knowTerms.includes(id) && !stillLearningTerms.includes(id))
    );

    let endOfSortingMessage: string = $derived.by(() => {
        if (unsortedTerms.length > 0) return "";

        let messages: string[] = [];

        SORTING_MESSAGES.forEach(([threshold, potentialMessages]) => {
            if (knowTerms.length / data.set.terms.length < threshold) return;

            messages = potentialMessages;
        });

        return messages[(Math.random() * messages.length) | 0];
    });

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
        unsortedTerms = actualTerms.map(({ _id }) => _id);
        sortingTerms = unsortedTerms;
        termCardComponent.flipCard(false, false);
        shuffle();

        if (fullReset) {
            knowTerms = [];
            stillLearningTerms = [];
        }
    }

    /**
     * Handles the sorting of the terms. It will sort the terms into the knowTerms and stillLearningTerms arrays.
     *
     * @param direction The direction to sort the term in. -1 for still learning and 1 for know.
     * @returns never
     */
    async function cycle(direction: -1 | 1) {
        if (!canCycle) return;

        canCycle = false;
        canFlip = false;

        const id: string = actualTerms[currentTermIndex]._id;

        if (direction === 1) {
            knowTerms.push(id);
        } else if (direction === -1) {
            stillLearningTerms.push(id);
        }

        unsortedTerms = unsortedTerms.filter((termID: string) => termID !== id);

        // Update the amount of times the term has been missed.
        // NOTE: It will go down if you get it right.
        if (id in timesMissedCounter) {
            if (timesMissedCounter[id] > 0 && direction === 1) {
                timesMissedCounter[id]--;
            } else if (direction === -1) {
                timesMissedCounter[id]++;
            }
        } else {
            timesMissedCounter[id] = 0;
        }

        // Determine if its a struggling term or not
        if (timesMissedCounter[id] >= STRUGGLING_TERM_THRESHOLD && !strugglingTerms.includes(id)) {
            strugglingTerms.push(id);
        } else if (
            timesMissedCounter[id] < STRUGGLING_TERM_THRESHOLD &&
            strugglingTerms.includes(id)
        ) {
            strugglingTerms.splice(strugglingTerms.indexOf(id), 1);
        }

        // Apply a color overlay to the card to indicate the direction of the cycle and then animate it in
        cardOverlay.style.backgroundColor = direction === 1 ? "#4caf50" : "#f26a63";
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
                translate: ["0%", direction === 1 ? "8%" : "-8%"],
            },
            {
                duration: 0.3,
                ease: "easeInOut",
            }
        );

        canCycle = unsortedTerms.length > 0;

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
        const alreadySortedNextTerm: boolean = !unsortedTerms.includes(
            actualTerms[currentTermIndex + 1]?._id
        );

        if (currentTermIndex + 1 < actualTerms.length - 1 && !alreadySortedNextTerm) {
            currentTermIndex++;
        } else if (alreadySortedNextTerm || unsortedTerms.length > 0) {
            currentTermIndex = actualTerms.findIndex(({ _id }) => _id === unsortedTerms[0]);
        }
    }

    onMount(() => {
        sidebarVisible.visible = false;
    });

    onDestroy(async () => {
        // Dont run if its SRR.
        if (
            typeof window === "undefined" ||
            (unsortedTerms.length === 0 &&
                knowTerms.length === 0 &&
                stillLearningTerms.length === 0) ||
            session === null
        )
            return;

        data.savedSorting = [];

        knowTerms.forEach((id) => {
            data.savedSorting.push([id, 1, timesMissedCounter[id] ?? 0]);
        });

        stillLearningTerms.forEach((id) => {
            data.savedSorting.push([id, -1, timesMissedCounter[id] ?? 0]);
        });

        await fetch(`/api/documents/set/${data.set._id}/sorting/update`, {
            method: "POST",
            body: JSON.stringify(data.savedSorting),
        });
    });
</script>

{#if unsortedTerms.length === 0}
    <div class="w-full space-y-6" in:fade={{ duration: 200 }}>
        <div>
            <p class="text-4xl leading-none font-bold">{endOfSortingMessage}</p>
            <p class="text-lg">Heres how you did.</p>
        </div>

        <div class="flex-center w-full gap-4">
            <div class="w-3/5">
                <div class="text-lg">
                    <p>
                        You are still learning <span class="text-alert font-bold"
                            >{stillLearningTerms.length}</span
                        >
                        {determineWording("terms")}
                    </p>
                    <p>
                        You know <span class="font-bold text-green-500"
                            >{data.set.terms.length - stillLearningTerms.length}</span
                        >
                        {determineWording("terms")}
                    </p>
                </div>
            </div>

            <div class="flex-center grow flex-col gap-4 [&>button]:w-full">
                <button
                    class="button-attention"
                    onclick={() => {
                        restart(stillLearningTerms, false);
                        stillLearningTerms = [];
                    }}
                    disabled={stillLearningTerms.length === 0}
                    >Study {stillLearningTerms.length > 0 ? stillLearningTerms.length : ""} still learning</button
                >

                <button
                    class="button-primary"
                    onclick={() => {
                        restart(strugglingTerms, false);

                        stillLearningTerms = stillLearningTerms.filter(
                            (id) => !strugglingTerms.includes(id)
                        );
                        knowTerms = knowTerms.filter((id) => !strugglingTerms.includes(id));
                    }}
                    disabled={strugglingTerms.length === 0}
                    >Study {strugglingTerms.length > 0 ? strugglingTerms.length : ""} struggling
                    {determineWording("terms")}</button
                >

                <div class="flex w-full items-center justify-between px-[20%]">
                    <button
                        class="text-lg"
                        onclick={() => {
                            knowTerms = knowTerms.filter((id) => !sortingTerms.includes(id));
                            stillLearningTerms = stillLearningTerms.filter(
                                (id) => !sortingTerms.includes(id)
                            );

                            restart(sortingTerms, false);
                        }}>Restart</button
                    >

                    <button class="text-lg" onclick={() => restart()}>Start fresh</button>
                </div>
            </div>
        </div>
    </div>
{:else}
    <Stats
        stillLearning={stillLearningTerms.length}
        knows={knowTerms.length}
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
        progress={[knowTerms.length, knowTerms.length + unsortedTerms.length]}
        cycleButtons={{
            "-1": {
                icon: "/icons/general/X.svg",
                label: "Still learning",
                disabled: knowTerms.length === 0,
            },
            "1": {
                icon: "/icons/general/Check.svg",
                label: "Know",
                disabled: unsortedTerms.length === 0,
            },
        }}
    />
{/if}
