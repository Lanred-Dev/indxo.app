<script lang="ts" module>
    export enum CycleDirection {
        previous = -1,
        next = 1,
    }
</script>

<script lang="ts">
    import ActionButton from "$lib/components/ActionButton.svelte";
    import { getContext, type ComponentProps, type Snippet } from "svelte";
    import { fade } from "svelte/transition";
    import { animate } from "motion";
    import type { Term } from "$lib/documents";
    import { ExpandableImage } from "$lib/components/Image";
    import MarkdownText from "$lib/components/MarkdownText.svelte";
    import type { SessionContext } from "$lib/utils/global";

    let {
        currentTermIndex = $bindable(0),
        Card = $bindable(),
        canCycle = $bindable(true),
        canFlip = $bindable(true),
        termCount,
        currentTerm,
        cycleButtons,
        actionButtons = [],
        Overlay,
    }: {
        currentTermIndex: number;
        Card: HTMLDivElement | undefined;
        canCycle: boolean;
        canFlip: boolean;
        termCount: number;
        currentTerm: Term & {
            index: number;
        };
        cycleButtons: {
            previous: {
                image: { properties?: { class?: string }; icon: string };
                text: string;
                disabled: boolean;
            };
            next: {
                image: { properties?: { class?: string }; icon: string };
                text: string;
                disabled: boolean;
            };
        };
        actionButtons?: ComponentProps<typeof ActionButton>[];
        Overlay?: Snippet<[]>;
    } = $props();

    const session: SessionContext = getContext("session");
    let flashcardScrollY: number = $state.raw(0);
    let isFlipped: boolean = $state.raw(false);
    let CardFront: HTMLDivElement;
    let CardBack: HTMLDivElement;

    /**
     * Flips the card.
     *
     * @param flipped Whether to flip the card or not. If null, it will flip the card to the opposite side.
     * @param animateFlip Whether to animate the flip or not. Defaults to true.
     * @returns never
     */
    export async function flipCard(flipped?: boolean, animateFlip?: boolean) {
        if (!canFlip) return;

        const lastFlippedState: boolean = isFlipped;

        if (typeof flipped === "boolean") {
            isFlipped = flipped;
        } else {
            isFlipped = !isFlipped;
        }

        if (lastFlippedState === isFlipped) return;

        if (
            (typeof animateFlip !== "boolean" || animateFlip) &&
            session.user.preferences.animatedTermCards
        ) {
            canFlip = false;
            canCycle = false;

            setTimeout(() => {
                CardFront.style.display = isFlipped ? "none" : "flex";
                CardBack.style.display = isFlipped ? "flex" : "none";
            }, 125);

            await animate(
                Card!,
                {
                    rotateX: [isFlipped ? 0 : 180, isFlipped ? 180 : 0],
                },
                {
                    duration: 0.25,
                    ease: "easeInOut",
                }
            );

            canFlip = true;
            canCycle = true;
        } else {
            Card!.style.transform = `rotateX(${isFlipped ? 180 : 0}deg)`;
            CardFront.style.display = isFlipped ? "none" : "flex";
            CardBack.style.display = isFlipped ? "flex" : "none";
        }
    }

    /**
     * Cycle through the terms in the set.
     *
     * @param direction The direction to cycle in. -1 for previous and 1 for next or during sort mode, 1 for knows term and -1 for still learning term
     * @returns never
     */
    export async function cycle(direction: -1 | 1) {
        if (currentTermIndex + direction < 0 || currentTermIndex + direction > termCount - 1)
            return;

        currentTermIndex += direction;
        flipCard(false, false);
        canFlip = false;

        if (session.user.preferences.animatedTermCards) {
            await animate(
                Card!,
                {
                    translateX: [direction === 1 ? "8%" : "-8%", "0%"],
                    rotateY: [direction === 1 ? -15 : 15, 0],
                    opacity: [0, 1],
                },
                {
                    duration: 0.3,
                    ease: "easeInOut",
                }
            );
        }

        canFlip = true;
    }
</script>

<svelte:window
    onkeydown={(event: KeyboardEvent) => {
        const target = event.target as HTMLElement | null;

        if (target && target !== document.body && !target.closest("#flashcard")) return;

        event.preventDefault();
        target?.blur();

        switch (event.key) {
            case "ArrowLeft":
                cycle(CycleDirection.previous);
                break;
            case "ArrowRight":
                cycle(CycleDirection.next);
                break;
            case " ":
                flipCard();
                break;
        }
    }}
/>

<div id="flashcard">
    <div
        class="md:aspect-2 relative aspect-[1.25] max-h-96 w-full cursor-pointer outline-none sm:aspect-[1.45]"
        style:perspective="1000px"
        in:fade={{ duration: 200 }}
        aria-label="Flip card"
        role="button"
        tabindex="0"
        onclick={() => {
            const selection: Selection | null = window.getSelection();

            if (!selection || selection.toString().length === 0) flipCard();
        }}
        onkeydown={(event) => {
            if (event.key === "Enter" || event.key === " ") flipCard();
        }}
    >
        <div
            class="break-word absolute top-0 left-0 h-full w-full text-center text-xl md:text-2xl"
            style:transform-style="preserve-3d"
            bind:this={Card}
        >
            {@render Overlay?.()}

            <div>
                <div class="CardFace" bind:this={CardFront}>
                    <MarkdownText text={currentTerm.term} aria-label="Term" />
                </div>

                <div
                    class="CardFace"
                    style:display="none"
                    style:transform="rotateX(180deg)"
                    bind:this={CardBack}
                >
                    {#if session.user.preferences.showTermOnDefinitionSide}
                        <div
                            class="x-center top-3 max-w-3/4 transition-opacity"
                            style:opacity={flashcardScrollY > 0 ? 0 : 1}
                        >
                            <MarkdownText
                                text={currentTerm.term}
                                class="text-light overflow-hidden text-base text-nowrap text-ellipsis"
                                aria-label="Term"
                            />
                        </div>
                    {/if}

                    <div
                        class="flex w-full flex-col items-center overflow-y-auto py-6"
                        onscroll={(event) => {
                            flashcardScrollY = event.currentTarget.scrollTop;
                        }}
                    >
                        {#if currentTerm.image}
                            <ExpandableImage
                                src={currentTerm.image}
                                alt="Term Image"
                                class="mb-3 h-30 w-auto"
                            />
                        {/if}

                        <MarkdownText text={currentTerm.definition} aria-label="Definition" />
                    </div>
                </div>

                <style lang="postcss">
                    @reference "../../../../../app.css";

                    .CardFace {
                        @apply rounded-container border-primary flex-center bg-input absolute top-0 left-0 h-full w-full flex-col overflow-x-hidden overflow-y-auto border p-6 shadow-xl inset-shadow-sm;
                    }
                </style>
            </div>
        </div>
    </div>

    <div class="relative mt-4 w-full" in:fade={{ duration: 200 }}>
        <div class="flex-center gap-1">
            <ActionButton
                class="button-primary rounded-full p-3.5"
                {...cycleButtons.previous}
                onclick={() => cycle(CycleDirection.previous)}
            />

            <p class="w-20 text-center text-lg font-semibold">
                {Math.min(currentTerm.index, termCount)}/{termCount}
            </p>

            <ActionButton
                class="button-primary rounded-full p-3.5"
                {...cycleButtons.next}
                onclick={() => cycle(CycleDirection.next)}
            />
        </div>

        <div class="flex-center sm:y-center mt-4 gap-2 sm:right-8 sm:mt-0">
            {#each actionButtons as button}
                <ActionButton class="button-icon" {...button} />
            {/each}
        </div>
    </div>
</div>
