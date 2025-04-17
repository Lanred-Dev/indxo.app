<script lang="ts">
    import type { PublicSet, Term } from "$lib/database/documents/Set";
    import { getContext, onDestroy, onMount } from "svelte";
    import { type Writable } from "svelte/store";
    import { animate } from "motion";
    import { fade, fly } from "svelte/transition";
    import type { SortingTerm } from "$lib/database/documents/User";
    import determineWording from "$lib/utils/determineWording";
    import type { Session } from "$lib/database/documents/Session";
    import { afterNavigate } from "$app/navigation";

    const STRUGGLING_TERM_THRESHOLD: number = 3;

    const SORTING_MESSAGES: [number, string[]][] = [
        [0, ["You're still learning.", "You've got room to grow."]],
        [0.5, ["You know this.", "You're doing great."]],
        [1, ["Awesome!", "You're a genius."]],
    ];

    let {
        setID,
        terms,
        savedSorting,
        mode,
    }: { setID: string; terms: Term[]; savedSorting: SortingTerm[]; mode: Writable<string> } =
        $props();

    const session: Session | null = getContext("session");

    let canCycle: boolean = true;
    let canFlip: boolean = true;
    let cardFlipped: boolean = $state.raw(false);
    let currentTermIndex: number = $state.raw(0);

    let actualTerms: Term[] = $state(terms);
    let stillLearningTerms: string[] = $state(
        savedSorting.filter(([_id, knows]) => knows === -1).map(([id]) => id)
    );
    let knowTerms: string[] = $state(
        savedSorting.filter(([_id, knows]) => knows === 1).map(([id]) => id)
    );
    let timesMissedCounter: { [id: string]: number } = savedSorting.reduce(
        (object, [id, _knows, timesMissed]) => {
            object[id] = timesMissed;
            return object;
        },
        {} as { [id: string]: number }
    );
    let strugglingTerms: string[] = $state(
        savedSorting
            .filter(([_id, _knows, timesMissed]) => timesMissed >= STRUGGLING_TERM_THRESHOLD)
            .map(([id]) => id)
    );
    let sortingTerms: string[] = terms.map(({ _id }) => _id);
    let unsortedTerms: string[] = $state.raw(
        sortingTerms.filter((id) => !knowTerms.includes(id) && !stillLearningTerms.includes(id))
    );

    let endOfSortingMessage: string = $derived.by(() => {
        if (unsortedTerms.length > 0 || $mode !== "sort") return "";

        let messages: string[] = [];

        SORTING_MESSAGES.forEach(([threshold, potentialMessages]) => {
            if (knowTerms.length / terms.length < threshold) return;

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
     * Handles the sorting of the terms. It will sort the terms into the knowTerms and stillLearningTerms arrays.
     *
     * @param direction The direction to sort the term in. -1 for still learning and 1 for know.
     * @returns never
     */
    async function _sortCycle(direction: -1 | 1) {
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
    }

    /**
     * Cycles through the terms in the set. This is used for the cards mode.
     *
     * @param direction The direction to cycle in. -1 for previous and 1 for next.
     * @returns never
     */
    async function _cardsCycle(direction: -1 | 1) {
        if (currentTermIndex + direction < 0 || currentTermIndex + direction > actualTerms.length)
            return;

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

    /**
     * Cycle through the terms in the set.
     *
     * @param direction The direction to cycle in. -1 for previous and 1 for next or during sort mode, 1 for knows term and -1 for still learning term
     * @returns never
     */
    function cycle(direction: -1 | 1) {
        if (!canCycle) return;

        if ($mode === "sort") {
            _sortCycle(direction);
        } else if ($mode === "cards") {
            _cardsCycle(direction);
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
            canCycle = false;

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
            canCycle = true;
        } else {
            card.style.transform = `rotateX(${cardFlipped ? 180 : 0}deg)`;
            cardFront.style.display = cardFlipped ? "none" : "flex";
            cardBack.style.display = cardFlipped ? "flex" : "none";
        }
    }

    /**
     * Restarts the study session by resetting all the state variables.
     *
     * @param withTerms The terms to study. Defaults to all terms in the set.
     * @param fullReset Whether to reset the knowTerms and stillLearningTerms arrays. Defaults to true.
     * @returns never
     */
    function restart(withTerms: string[] = terms.map(({ _id }) => _id), fullReset: boolean = true) {
        currentTermIndex = 0;
        actualTerms = terms.filter(({ _id }) => withTerms.includes(_id));

        // NOTE: As of now the sort mode is the only mode that has reset functionality.
        // Reset the unsorted terms so that the user can start over. And if its a full reset then reset the know and still learning terms as well.
        if ($mode === "sort") {
            unsortedTerms = actualTerms.map(({ _id }) => _id);
            sortingTerms = unsortedTerms;

            if (fullReset) {
                knowTerms = [];
                stillLearningTerms = [];
            }
        }

        canCycle = true;
        canFlip = true;
        flipCard(false, false);
        shuffle();
    }

    // After navigating to a new set, reset the mode to cards and restart the study session
    afterNavigate(() => {
        mode.set("cards");
        restart(
            terms.map(({ _id }) => _id),
            true
        );
    });

    onMount(() => {
        return mode.subscribe((mode: string) => {
            if (mode === "sort") {
                actualTerms = terms.filter(({ _id }) => sortingTerms.includes(_id));

                // If the current term is not in the unsorted terms, find the next unsorted term
                const currentTermID: string = unsortedTerms.includes(
                    actualTerms[currentTermIndex]?._id
                )
                    ? actualTerms[currentTermIndex]._id
                    : unsortedTerms[0];
                currentTermIndex = actualTerms.findIndex(({ _id }) => _id === currentTermID);

                canCycle = unsortedTerms.length > 0;
                canFlip = unsortedTerms.length > 0;
            } else if (mode === "cards") {
                canCycle = true;
                canFlip = true;

                // If the current index and the initial term are the same, then keep the same index otherwise reset to the first term
                if (
                    !terms[currentTermIndex] ||
                    actualTerms[currentTermIndex]?._id !== terms[currentTermIndex]?._id
                )
                    currentTermIndex = 0;

                actualTerms = terms;
            }

            flipCard(false, false);
        });
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

        savedSorting = [];

        knowTerms.forEach((id) => {
            savedSorting.push([id, 1, timesMissedCounter[id] ?? 0]);
        });

        stillLearningTerms.forEach((id) => {
            savedSorting.push([id, -1, timesMissedCounter[id] ?? 0]);
        });

        await fetch(`/api/documents/set/${setID}/sorting/update`, {
            method: "POST",
            body: JSON.stringify(savedSorting),
        });
    });
</script>

<svelte:window
    onkeydown={(event: KeyboardEvent) => {
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
    }}
/>

{#snippet navigationButton(icon: string, text: string, disabled: boolean, direction: -1 | 1)}
    <button
        class="button-primary rounded-full! p-3.5!"
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
                                    >{terms.length - stillLearningTerms.length}</span
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
                            >Study {stillLearningTerms.length > 0 ? stillLearningTerms.length : ""} still
                            learning</button
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
                                    knowTerms = knowTerms.filter(
                                        (id) => !sortingTerms.includes(id)
                                    );
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
            {#if $mode === "sort"}
                <!--Sorting mode stats-->
                <div class="relative mb-1 flex items-center justify-between px-3">
                    <p class="text-alert text-lg">{stillLearningTerms.length}</p>

                    <!--Progress bar for sorting-->
                    <div class="x-center y-center bg-primary-400 h-1 w-1/2 rounded-full">
                        <div
                            class="relative h-full overflow-hidden rounded-full bg-green-500 transition-[width] duration-200"
                            style:width="{((knowTerms.length + stillLearningTerms.length) /
                                terms.length) *
                                100}%"
                        >
                            <span
                                class="y-center bg-accent-alert left-0 h-full transition-[width] duration-200"
                                style:width="{(stillLearningTerms.length /
                                    (knowTerms.length + stillLearningTerms.length)) *
                                    100}%"
                            ></span>
                        </div>
                    </div>

                    <p class="text-lg text-green-500">{knowTerms.length}</p>
                </div>
            {/if}

            <!--Term card-->
            <button
                class="sm:aspect-2 relative aspect-[1.6] max-h-96 w-full text-3xl"
                style:perspective="1000px"
                onclick={() => flipCard()}
                in:fade={{ duration: 200 }}
            >
                <div
                    class="absolute top-0 left-0 h-full w-full"
                    style:transform-style="preserve-3d"
                    bind:this={card}
                >
                    <div
                        class="rounded-primary absolute top-0 left-0 z-10 h-full w-full opacity-0"
                        bind:this={cardColorOverlay}
                    ></div>

                    <div
                        class="[&>*]:rounded-primary [&>*]:border-primary [&>*]:bg-primary-200 [&>*]:absolute [&>*]:top-0 [&>*]:left-0 [&>*]:flex [&>*]:h-full [&>*]:w-full [&>*]:items-center [&>*]:justify-center [&>*]:overflow-y-auto [&>*]:border [&>*]:p-6 [&>*]:shadow-xl"
                    >
                        <div bind:this={cardFront}>
                            <p>{actualTerms[currentTermIndex]?.term}</p>
                        </div>

                        <div
                            style:display="none"
                            style:transform="rotateX(180deg)"
                            bind:this={cardBack}
                        >
                            <p class="text-light x-center top-6 text-base">
                                {actualTerms[currentTermIndex]?.term}
                            </p>
                            <p>{actualTerms[currentTermIndex]?.definition}</p>
                        </div>
                    </div>
                </div>
            </button>

            <!--Controls-->
            <div class="relative mt-4 w-full" in:fade={{ duration: 200 }}>
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
                            class="button-icon transition-all! hover:rotate-[28deg] active:rotate-180"
                            onclick={shuffle}
                        >
                            <img class="size-6!" src="/icons/general/Shuffle.svg" alt="Shuffle" />
                        </button>
                    {/if}
                </div>
            </div>
        {/if}
    </div>
{/if}
