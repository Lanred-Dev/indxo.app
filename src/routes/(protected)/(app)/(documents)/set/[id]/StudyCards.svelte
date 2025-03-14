<script lang="ts">
    import type { PublicSet, Term } from "$lib/database/documents/Set";
    import type { Writable } from "svelte/store";

    let { set, mode }: { set: PublicSet; mode: Writable<string> } = $props();
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

        currentTermIndex += direction;
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

{#snippet navigationButton(icon: string, text: string, disabled: number, direction: -1 | 1)}
    <button
        class="button-primary group !rounded-full !p-3.5"
        disabled={currentTermIndex === disabled}
        onclick={() => cycle(direction)}
    >
        <img class="size-9" src={icon} alt={text} />
    </button>
{/snippet}

{#if actualTerms.length === 0}
    <p class="my-20 text-center text-lg font-bold md:my-24">This set has no terms</p>
{:else}
    <div class="study w-full 2xl:w-8/12">
        {#if $mode === "sort"}
            <div class="mb-1 flex items-center justify-between px-3">
                <p class="text-red-400">0 still learning</p>

                <p class="text-green-400">know 0</p>
            </div>
        {/if}

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

        <div class="relative mt-4 w-full">
            <div class="flex-center gap-1">
                {@render navigationButton(
                    $mode === "sort" ? "/icons/general/X.svg" : "/icons/general/LeftArrow.svg",
                    $mode === "sort" ? "X" : "Previous",
                    0,
                    -1
                )}

                <p class="w-20 text-center text-lg font-bold">
                    {currentTermIndex + 1}<span class="font-normal">/</span>{actualTerms.length}
                </p>

                {@render navigationButton(
                    $mode === "sort" ? "/icons/general/Check.svg" : "/icons/general/RightArrow.svg",
                    $mode === "sort" ? "Check" : "Next",
                    actualTerms.length - 1,
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
    </div>
{/if}
