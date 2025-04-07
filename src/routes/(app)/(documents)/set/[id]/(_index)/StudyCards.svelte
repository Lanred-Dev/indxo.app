<script lang="ts">
    import type { PublicSet, Term } from "$lib/database/documents/Set";
    import { onMount } from "svelte";
    import { type Writable } from "svelte/store";
    import { animate } from "motion";
    import { fly } from "svelte/transition";

    let { set, mode }: { set: PublicSet; mode: Writable<string> } = $props();

    let canCycle: boolean = true;
    let canFlip: boolean = true;
    let cardFlipped: boolean = $state(false);
    let currentTermIndex: number = $state(0);

    let actualTerms: Term[] = $state(set.terms);
    let sortingTerms: string[] = [];
    let unsortedTerms: string[] = $state([]);
    let stillLearningTerms: string[] = $state([]);
    let knowTerms: string[] = $state([]);

    let endOfSortingMessage: string = $derived.by(() => {
        if (unsortedTerms.length > 0 || $mode !== "sort") return "";

        let messages: string[] = [];

        SORTING_MESSAGES.forEach(([threshold, potentialMessages]) => {
            if (knowTerms.length / actualTerms.length < threshold) return;

            messages = potentialMessages;
        });

        return messages[(Math.random() * messages.length) | 0];
    });

    // svelte-ignore non_reactive_update
    let card: HTMLDivElement;
    // svelte-ignore non_reactive_update
    let cardColorOverlay: HTMLDivElement;
    // svelte-ignore non_reactive_update
    let cardFront: HTMLDivElement;
    // svelte-ignore non_reactive_update
    let cardBack: HTMLDivElement;

    const SORTING_MESSAGES: [number, string[]][] = [
        [0, ["Youre still learning.", "Youve got room to grow."]],
        [0.5, ["You know this.", "Youre doing great."]],
        [1, ["Awesome!", "Youre a genius."]],
    ];

    /**
     * Shuffle the terms in the set. Resets the current term to the first one.
     *
     * @returns never
     */
    function shuffle() {
        currentTermIndex = 0;
        cardFlipped = false;
        actualTerms.sort(() => Math.random() - 0.5);
    }

    /**
     * Cycle through the terms in the set.
     *
     * @param direction The direction to cycle in. -1 for previous and 1 for next or during sort mode, 1 for knows term and -1 for still learning term
     * @returns never
     */
    async function cycle(direction: -1 | 1) {
        if (!canCycle) return;

        if ($mode === "sort") {
            canCycle = false;
            canFlip = false;

            if (direction === 1) {
                knowTerms.push(actualTerms[currentTermIndex]._id);
            } else if (direction === -1) {
                stillLearningTerms.push(actualTerms[currentTermIndex]._id);
            }

            unsortedTerms = unsortedTerms.filter(
                (termID: string) => termID !== actualTerms[currentTermIndex]._id
            );

            // Apply a color overlay to the card to indicate the direction of the cycle and then animate it in
            cardColorOverlay.style.backgroundColor = direction === 1 ? "#4caf50" : "#f26a63";
            animate(
                cardColorOverlay,
                {
                    opacity: [0, 0.3],
                },
                {
                    duration: 0.2,
                    ease: "easeInOut",
                }
            );

            // Animate the card out to the left or right depending on the direction of the cycle
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
                // Reset the card to the front and remove the color overlay
                canFlip = true;
                flipCard(false, false);

                cardColorOverlay.style.opacity = "0";
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
        } else if (
            $mode === "cards" &&
            currentTermIndex + direction >= 0 &&
            currentTermIndex + direction < actualTerms.length
        ) {
            currentTermIndex += direction;
            flipCard(false, false);
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
    }

    /**
     * Handles the keyboard shortcuts for the study cards.
     *
     * @param event The keyboard event
     * @returns never
     */
    function handleKeyboardShortcuts(event: KeyboardEvent) {
        // Only register events if the user is not focused on anything or if they are focused on the study cards
        if (
            document.activeElement?.tagName !== "BODY" &&
            !(event.target as HTMLElement | null)?.closest(".study")
        )
            return;

        event.preventDefault();
        (event.target as HTMLElement).blur();

        switch (event.key) {
            case " ":
                flipCard();
                break;
            case "ArrowLeft":
                cycle(-1);
                break;
            case "ArrowRight":
                cycle(1);
                break;
        }
    }

    /**
     * Flips the card.
     *
     * @param flipped Whether to flip the card or not. If null, it will flip the card to the opposite side.
     * @param animateFlip Whether to animate the flip or not. Defaults to true.
     * @returns never
     */
    async function flipCard(flipped?: boolean, animateFlip: boolean = true) {
        if (!canFlip) return;

        const lastFlippedState: boolean = cardFlipped;

        if (typeof flipped === "boolean") {
            cardFlipped = flipped;
        } else {
            cardFlipped = !cardFlipped;
        }

        if (lastFlippedState === cardFlipped) return;

        if (animateFlip) {
            canFlip = false;

            setTimeout(() => {
                cardFront.style.display = cardFlipped ? "none" : "flex";
                cardBack.style.display = cardFlipped ? "flex" : "none";
            }, 125);

            await animate(
                card,
                {
                    rotateX: [cardFlipped ? 0 : 180, cardFlipped ? 180 : 0],
                },
                {
                    duration: 0.25,
                    ease: "easeInOut",
                }
            );

            canFlip = true;
        } else {
            card.style.transform = `rotateX(${cardFlipped ? 180 : 0}deg)`;
            cardFront.style.display = cardFlipped ? "none" : "flex";
            cardBack.style.display = cardFlipped ? "flex" : "none";
        }
    }

    /**
     * Restarts the study session by resetting all the state variables.
     *
     * @returns never
     */
    function restart() {
        // Setting this first allows the card component to reload before `flipCard` is called
        if ($mode === "sort") {
            unsortedTerms = actualTerms.map(({ _id }) => _id);
            sortingTerms = unsortedTerms;
        }

        currentTermIndex = 0;
        knowTerms = [];
        stillLearningTerms = [];
        canCycle = true;
        canFlip = true;
        flipCard(false, false);
        shuffle();
    }

    /**
     * Studies the terms that the user is still learning.
     *
     * @returns never
     */
    function studyStillLearningTerms() {
        actualTerms = actualTerms.filter(({ _id }) => {
            return stillLearningTerms.includes(_id);
        });

        restart();
    }

    onMount(() => {
        return mode.subscribe((mode: string) => {
            if (mode === "sort") {
                if (sortingTerms.length === 0) {
                    sortingTerms = actualTerms.map(({ _id }) => _id);
                    unsortedTerms = sortingTerms;
                } else if (unsortedTerms.length > 0) {
                    actualTerms = set.terms.filter(({ _id }) => sortingTerms.includes(_id));

                    // If the current term is not in the unsorted terms, find the next unsorted term
                    const currentTermID: string = unsortedTerms.includes(
                        actualTerms[currentTermIndex]?._id
                    )
                        ? actualTerms[currentTermIndex]._id
                        : unsortedTerms[0];
                    currentTermIndex = actualTerms.findIndex(({ _id }) => _id === currentTermID);
                }

                canCycle = unsortedTerms.length > 0;
                canFlip = unsortedTerms.length > 0;
            } else if (mode === "cards") {
                canCycle = true;
                canFlip = true;

                // If the current index and the initial term are the same, then keep the same index otherwise reset to the first term
                const actualAndInitialIsSame: boolean =
                    actualTerms[currentTermIndex]?._id === set.terms[currentTermIndex]._id;

                actualTerms = set.terms;

                if (!actualAndInitialIsSame) currentTermIndex = 0;
            }

            flipCard(false, false);
        });
    });
</script>

<svelte:window onkeydown={handleKeyboardShortcuts} />

{#snippet navigationButton(icon: string, text: string, disabled: boolean, direction: -1 | 1)}
    <button
        class="button-primary !rounded-full !p-3.5"
        {disabled}
        onclick={() => cycle(direction)}
        in:fly={{ y: 5 }}
    >
        <img class="size-9" src={icon} alt={text} />
    </button>
{/snippet}

{#if actualTerms.length === 0}
    <p class="my-20 text-center text-lg font-bold md:my-24">This set has no terms</p>
{:else}
    <div class="study w-full">
        {#if $mode === "sort" && unsortedTerms.length === 0}
            <!--End of sorting results-->
            <div class="w-full space-y-6">
                <div>
                    <p class="text-4xl font-bold leading-none">{endOfSortingMessage}</p>
                    <p class="text-lg">Heres how you did.</p>
                </div>

                <div class="flex-center w-full gap-4">
                    <div class="w-3/5">
                        <div class="text-lg">
                            <p>
                                You are still learning <span class="text-alert font-bold"
                                    >{stillLearningTerms.length}</span
                                > terms
                            </p>
                            <p>
                                You know <span class="font-bold text-green-500"
                                    >{set.terms.length - stillLearningTerms.length}</span
                                > terms
                            </p>
                        </div>
                    </div>

                    <div class="flex-center flex-grow flex-col gap-4 [&>button]:w-full">
                        <button
                            class="button-attention"
                            onclick={studyStillLearningTerms}
                            disabled={stillLearningTerms.length === 0}
                            >Study {stillLearningTerms.length} still learning</button
                        >
                        <button class="button-primary">Study struggling terms</button>
                        <button class="text-lg" onclick={() => restart()}>Restart</button>
                    </div>
                </div>
            </div>
        {:else}
            {#if $mode === "sort"}
                <!--Sorting mode stats-->
                <div class="relative mb-1 flex items-center justify-between px-3">
                    <p class="text-alert text-lg">{stillLearningTerms.length}</p>

                    <!--Progress bar for sorting-->
                    <div class="x-center y-center h-1 w-1/2 rounded-full bg-primary-400">
                        <div
                            class="relative h-full overflow-hidden rounded-full bg-green-500 transition-[width] duration-200"
                            style:width="{((actualTerms.length - unsortedTerms.length) /
                                actualTerms.length) *
                                100}%"
                        >
                            <span
                                class="y-center bg-accent-alert left-0 h-full transition-[width] duration-200"
                                style:width="{(stillLearningTerms.length /
                                    (actualTerms.length - unsortedTerms.length)) *
                                    100}%"
                            ></span>
                        </div>
                    </div>

                    <p class="text-lg text-green-500">{knowTerms.length}</p>
                </div>
            {/if}

            <!--Term card-->
            <button
                class="relative aspect-[1.6] max-h-96 w-full text-3xl sm:aspect-[2]"
                style:perspective="1000px"
                onclick={() => flipCard()}
            >
                <div
                    class="absolute left-0 top-0 h-full w-full"
                    style:transform-style="preserve-3d"
                    bind:this={card}
                >
                    <div
                        class="absolute left-0 top-0 z-10 h-full w-full rounded-primary opacity-0"
                        bind:this={cardColorOverlay}
                    ></div>

                    <div class="cardFace" bind:this={cardFront}>
                        <p>{actualTerms[currentTermIndex].term}</p>
                    </div>

                    <div
                        class="cardFace"
                        style:display="none"
                        style:transform="rotateX(180deg)"
                        bind:this={cardBack}
                    >
                        <p class="text-light x-center top-6 text-base">
                            {actualTerms[currentTermIndex].term}
                        </p>
                        <p>{actualTerms[currentTermIndex].definition}</p>
                    </div>

                    <style lang="postcss">
                        .cardFace {
                            @apply absolute left-0 top-0 flex h-full w-full items-center justify-center overflow-y-auto rounded-primary border border-primary bg-primary-200 p-6 shadow-xl;
                        }
                    </style>
                </div>
            </button>

            <!--Controls-->
            <div class="relative mt-4 w-full">
                <div class="flex-center gap-1">
                    {#if $mode === "sort"}
                        {@render navigationButton("/icons/general/X.svg", "X", false, -1)}
                    {:else}
                        {@render navigationButton(
                            "/icons/general/LeftArrow.svg",
                            "Previous",
                            currentTermIndex === 0,
                            -1
                        )}
                    {/if}

                    <p class="w-20 text-center text-lg font-bold">
                        {Math.min(actualTerms.length, currentTermIndex + 1)}<span
                            class="font-normal">/</span
                        >{actualTerms.length}
                    </p>

                    {#if $mode === "sort"}
                        {@render navigationButton("/icons/general/Check.svg", "Check", false, 1)}
                    {:else}
                        {@render navigationButton(
                            "/icons/general/RightArrow.svg",
                            "Next",
                            currentTermIndex >= actualTerms.length - 1,
                            1
                        )}
                    {/if}
                </div>

                <div class="flex-center y-center absolute right-8 gap-2">
                    {#if actualTerms.length > 1}
                        <button
                            class="transition-transform hover:rotate-[28deg] hover:scale-110 active:rotate-[180deg]"
                            onclick={shuffle}
                        >
                            <img class="size-6" src="/icons/general/Shuffle.svg" alt="Shuffle" />
                        </button>
                    {/if}
                </div>
            </div>
        {/if}
    </div>
{/if}
