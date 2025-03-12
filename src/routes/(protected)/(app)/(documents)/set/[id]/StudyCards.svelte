<script lang="ts">
    import type { PublicSet, Term } from "$lib/database/documents/Set";

    let { set, activity }: { set: PublicSet; activity: string } = $props();
    let actualTerms: Term[] = $state(set.terms);
    let showDescription: boolean = $state(false);
    let currentTermIndex: number = $state(0);
    let currentTerm: Term = $derived(actualTerms[currentTermIndex]);

    /**
     * Shuffle the terms in the set. Resets the current term to the first one.
     *
     * @returns never
     */
    function shuffle() {
        currentTermIndex = 0;
        showDescription = false;
        actualTerms.sort(() => Math.random() - 0.5);
    }

    /**
     * Cycle through the terms in the set.
     *
     * @param direction The direction to cycle in. -1 for previous, 1 for next.
     * @returns never
     */
    function cycle(direction: -1 | 1) {
        if (currentTermIndex + direction < 0 || currentTermIndex + direction >= actualTerms.length)
            return;

        showDescription = false;

        if (activity === "study") {
            currentTermIndex += direction;
        } else {
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
            !(event.target as HTMLElement | null)?.closest(".studyCards")
        )
            return;

        event.preventDefault();
        (event.target as HTMLElement).blur();

        // Allow keyboard shortcuts
        switch (event.key) {
            case " ":
                showDescription = !showDescription;
                break;
            case "ArrowLeft":
                cycle(-1);
                break;
            case "ArrowRight":
                cycle(1);
                break;
        }
    }
</script>

<svelte:window onkeydown={handleKeyboardShortcuts} />

{#if actualTerms.length === 0}
    <p class="my-20 text-center text-lg font-bold md:my-24">This set has no terms</p>
{:else}
    <div class="studyCards w-full space-y-4 2xl:w-8/12">
        <div class="w-full">
            <button
                class="relative aspect-[1.6] max-h-96 w-full overflow-y-auto rounded-primary border border-primary bg-primary-200 p-6 shadow-xl sm:aspect-[2]"
                onclick={() => (showDescription = !showDescription)}
            >
                {#if showDescription}
                    <p class="text-light x-center top-6">{currentTerm.term}</p>
                {/if}

                <p class="text-3xl">
                    {#if showDescription}
                        {currentTerm.definition}
                    {:else}
                        {currentTerm.term}
                    {/if}
                </p>
            </button>
        </div>

        <div class="relative w-full">
            <div class="flex-center gap-1">
                <button
                    class="primary group transition-opacity disabled:pointer-events-none disabled:opacity-50"
                    disabled={currentTermIndex === 0}
                    onclick={() => cycle(-1)}
                >
                    <img
                        class="relative size-8 transition-transform group-hover:-translate-x-0.5 group-hover:scale-105"
                        src={activity === "sort"
                            ? "/icons/general/X.svg"
                            : "/icons/general/LeftArrow.svg"}
                        alt={activity === "sort" ? "X" : "Previous"}
                    />
                </button>

                <p class="w-20 text-center text-lg font-bold">
                    {currentTermIndex + 1}<span class="font-normal">/</span>{actualTerms.length}
                </p>

                <button
                    class="primary group transition-opacity disabled:pointer-events-none disabled:opacity-50"
                    disabled={currentTermIndex === actualTerms.length - 1}
                    onclick={() => cycle(1)}
                >
                    <img
                        class="relative size-8 transition-transform group-hover:translate-x-0.5 group-hover:scale-105"
                        src={activity === "sort"
                            ? "/icons/general/Check.svg"
                            : "/icons/general/RightArrow.svg"}
                        alt={activity === "sort" ? "Check" : "Next"}
                    />
                </button>
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
    </div>
{/if}
