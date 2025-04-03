<script lang="ts">
    import type { PublicSet, Term } from "$lib/database/documents/Set";
    import { type Writable } from "svelte/store";

    let { set, mode }: { set: PublicSet; mode: Writable<string> } = $props();
    let actualTerms: Term[] = $state(set.terms);
    let cardFlipped: boolean = $state(false);
    let currentTermIndex: number = $state(0);
    let stillLearningTerms: number[] = $state([]);
    let knowTerms: number[] = $state([]);
    let endOfCards: boolean = $state(false);
    let unsortedTerms: number[] = $state([]);
    let endOfSortingMessage: string = $derived.by(() => {
        if (!endOfCards || $mode !== "sort") return "";

        let messages: string[] = [];

        SORTING_MESSAGES.forEach(([threshold, potentialMessages]) => {
            if (knowTerms.length / actualTerms.length < threshold) return;

            messages = potentialMessages;
        });

        return messages[Math.floor(Math.random() * messages.length)];
    });

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
    function cycle(direction: -1 | 1) {
        cardFlipped = false;

        if ($mode === "sort") {
            if (direction === 1) {
                knowTerms.push(currentTermIndex);
            } else if (direction === -1) {
                stillLearningTerms.push(currentTermIndex);
            }

            unsortedTerms = unsortedTerms.filter(
                (termIndex: number) => termIndex !== currentTermIndex
            );
            endOfCards = unsortedTerms.length === 0;

            // If its the end of the sorting then we need to show the message
            if (endOfCards) {
                currentTermIndex = actualTerms.length - 1;
            } else {
                // If we are not at the end of the sorting then we need to show the next term
                const alreadySortedNextTerm: boolean = !unsortedTerms.includes(
                    currentTermIndex + 1
                );

                if (currentTermIndex + 1 < actualTerms.length - 1 && !alreadySortedNextTerm) {
                    currentTermIndex++;
                } else if (alreadySortedNextTerm || unsortedTerms.length > 0) {
                    currentTermIndex = unsortedTerms[0];
                }
            }
        } else if ($mode === "cards" && currentTermIndex + direction >= 0) {
            currentTermIndex += direction;
            endOfCards = currentTermIndex >= actualTerms.length - 1;
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

        // Allow keyboard shortcuts
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
     * @returns never
     */
    function flipCard() {
        if ($mode === "sort" && endOfCards) return;

        cardFlipped = !cardFlipped;
    }

    /**
     * Restarts the study session by resetting all the state variables.
     *
     * @param startAtIndex The index to start the study session from. Defaults to 0 (the first term). NOTE: If shuffleTerms is true, this will be ignored.
     * @param shuffleTerms Whether to shuffle the terms again or not. Defaults to false.
     * @returns never
     */
    function restart(startAtIndex: number = 0, shuffleTerms: boolean = false) {
        endOfCards = false;
        currentTermIndex = startAtIndex;
        cardFlipped = false;
        knowTerms = [];
        stillLearningTerms = [];

        if ($mode === "sort") {
            unsortedTerms = [...Array(actualTerms.length).keys()];
        } else {
            unsortedTerms = [];
        }

        if (shuffleTerms) shuffle();
    }

    function studyStillLearningTerms() {
        if (stillLearningTerms.length === 0) return;

        actualTerms = actualTerms.filter((_term, index) => {
            return stillLearningTerms.includes(index);
        });

        restart(0, true);
    }

    $effect(() => {
        restart(currentTermIndex);

        switch ($mode) {
            case "sort":
                unsortedTerms = [...Array(actualTerms.length).keys()];
        }
    });
</script>

<svelte:window onkeydown={handleKeyboardShortcuts} />

{#snippet navigationButton(icon: string, text: string, disabled: boolean, direction: -1 | 1)}
    <button class="button-primary !rounded-full !p-3.5" {disabled} onclick={() => cycle(direction)}>
        <img class="size-9" src={icon} alt={text} />
    </button>
{/snippet}

{#if actualTerms.length === 0}
    <p class="my-20 text-center text-lg font-bold md:my-24">This set has no terms</p>
{:else}
    <div class="study w-full">
        {#if $mode === "sort" && endOfCards}
            <div class="w-full space-y-6">
                <div>
                    <p class="text-4xl font-bold leading-none">{endOfSortingMessage}</p>
                    <p class="text-lg">Heres how you did.</p>
                </div>

                <div class="flex-center w-full gap-4">
                    <div class="w-3/5">
                        <p class="text-lg text-green-500">
                            {knowTerms.length} know{knowTerms.length !== 1 ? "s" : ""}
                        </p>
                        <p class="text-sm text-gray-500">You know {knowTerms.length} terms</p>
                    </div>

                    <div class="flex-center flex-grow flex-col gap-4 [&>button]:w-full">
                        <button
                            class="button-attention"
                            onclick={studyStillLearningTerms}
                            disabled={stillLearningTerms.length === 0}
                            >Study {stillLearningTerms.length} still learning</button
                        >
                        <button class="button-primary">Study struggling terms</button>
                        <button class="text-lg" onclick={() => restart(0, true)}>Restart</button>
                    </div>
                </div>
            </div>
        {:else}
            {#if $mode === "sort"}
                <div class="relative mb-1 flex items-center justify-between px-3">
                    <p class="text-lg text-red-500">{stillLearningTerms.length}</p>

                    <!--Progress bar along with the amount correct and wrong-->
                    <div class="x-center y-center h-1 w-1/2 rounded-full bg-primary-400">
                        <div
                            class="relative h-full overflow-hidden rounded-full bg-green-500 transition-[width] duration-200"
                            style:width="{((actualTerms.length - unsortedTerms.length) /
                                actualTerms.length) *
                                100}%"
                        >
                            <span
                                class="y-center left-0 h-full bg-red-500 transition-[width] duration-200"
                                style:width="{(stillLearningTerms.length /
                                    (actualTerms.length - unsortedTerms.length)) *
                                    100}%"
                            ></span>
                        </div>
                    </div>

                    <p class="text-lg text-green-500">{knowTerms.length}</p>
                </div>
            {/if}

            <button
                class="relative aspect-[1.6] max-h-96 w-full text-3xl sm:aspect-[2] {$mode ===
                    'sort' && endOfCards
                    ? 'cursor-default'
                    : 'cursor-pointer'}"
                style:perspective="1000px"
                onclick={flipCard}
            >
                <div
                    class="absolute left-0 top-0 h-full w-full transition-transform duration-300 will-change-transform"
                    style:transform-style="preserve-3d"
                    style:transform={cardFlipped ? "rotateX(180deg)" : "rotateX(0deg)"}
                >
                    <div class="cardFace">
                        <p>{actualTerms[currentTermIndex].term}</p>
                    </div>

                    <div class="cardFace" style:transform="rotateX(180deg)">
                        <p class="text-light x-center top-6 text-base">
                            {actualTerms[currentTermIndex].term}
                        </p>
                        <p>{actualTerms[currentTermIndex].definition}</p>
                    </div>

                    <style lang="postcss">
                        .cardFace {
                            backface-visibility: hidden;
                            @apply absolute left-0 top-0 flex h-full w-full items-center justify-center overflow-y-auto rounded-primary border border-primary bg-primary-200 p-6 shadow-xl;
                        }
                    </style>
                </div>
            </button>

            <div class="relative mt-4 w-full">
                <div class="flex-center gap-1">
                    {@render navigationButton(
                        $mode === "sort" ? "/icons/general/X.svg" : "/icons/general/LeftArrow.svg",
                        $mode === "sort" ? "X" : "Previous",
                        $mode === "sort" ? endOfCards : currentTermIndex === 0,
                        -1
                    )}

                    <p class="w-20 text-center text-lg font-bold">
                        {Math.min(actualTerms.length, currentTermIndex + 1)}<span
                            class="font-normal">/</span
                        >{actualTerms.length}
                    </p>

                    {@render navigationButton(
                        $mode === "sort"
                            ? "/icons/general/Check.svg"
                            : "/icons/general/RightArrow.svg",
                        $mode === "sort" ? "Check" : "Next",
                        endOfCards,
                        1
                    )}
                </div>

                <div class="flex-center y-center absolute right-8 gap-2">
                    {#if actualTerms.length > 1}
                        <button
                            class="transition-transform hover:rotate-[28deg] hover:scale-110 active:rotate-[180deg]"
                            style="-webkit-animation-fill-mode: forwards; animation-fill-mode: forwards;"
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
