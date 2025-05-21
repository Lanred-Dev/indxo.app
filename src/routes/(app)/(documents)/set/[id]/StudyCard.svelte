<script lang="ts">
    import { animate } from "motion";
    import type { Snippet } from "svelte";
    import { fade } from "svelte/transition";

    let {
        card = $bindable(),
        canCycle = $bindable(true),
        canFlip = $bindable(true),
        term = $bindable(""),
        definition = $bindable(""),
        overlay,
    }: {
        card: HTMLDivElement;
        canCycle: boolean;
        canFlip: boolean;
        term: string;
        definition: string;
        overlay?: Snippet<[]>;
    } = $props();

    let cardFlipped: boolean = $state.raw(false);
    let cardFront: HTMLDivElement;
    let cardBack: HTMLDivElement;

    /**
     * Flips the card.
     *
     * @param flipped Whether to flip the card or not. If null, it will flip the card to the opposite side.
     * @param animateFlip Whether to animate the flip or not. Defaults to true.
     * @returns never
     */
    export async function flipCard(flipped?: boolean, animateFlip?: boolean) {
        if (!canFlip) return;

        const lastFlippedState: boolean = cardFlipped;

        if (typeof flipped === "boolean") {
            cardFlipped = flipped;
        } else {
            cardFlipped = !cardFlipped;
        }

        if (lastFlippedState === cardFlipped) return;

        if (typeof animateFlip !== "boolean" || animateFlip) {
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
</script>

<svelte:window
    onkeydown={(event: KeyboardEvent) => {
        const target = event.target as HTMLElement | null;

        if (
            target !== null &&
            target !== document.body &&
            !target.closest("#controls") &&
            !target.closest("#termCard")
        )
            return;

        event.preventDefault();
        target?.blur();

        switch (event.key) {
            case " ":
                flipCard();
                break;
        }
    }}
/>

<button
    id="termCard"
    class="sm:aspect-2 relative aspect-[1.6] max-h-96 w-full text-3xl outline-none"
    style:perspective="1000px"
    onclick={() => flipCard()}
    in:fade={{ duration: 200 }}
>
    <div
        class="absolute top-0 left-0 h-full w-full"
        style:transform-style="preserve-3d"
        bind:this={card}
    >
        {@render overlay?.()}

        <div>
            <div class="CardFace" bind:this={cardFront}>
                <p class="font-medium">{term}</p>
            </div>

            <div
                class="CardFace"
                style:display="none"
                style:transform="rotateX(180deg)"
                bind:this={cardBack}
            >
                <p class="text-light x-center top-6 text-base font-medium">
                    {term}
                </p>

                <p>{definition}</p>
            </div>

            <style lang="postcss">
                @reference "../../../../../app.css";

                .CardFace {
                    @apply rounded-container border-primary flex-center absolute top-0 left-0 h-full w-full overflow-y-auto border bg-[#f6f9fb] p-6 shadow-xl inset-shadow-sm;
                }
            </style>
        </div>
    </div>
</button>
