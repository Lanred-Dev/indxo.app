<script lang="ts">
    import { fade } from "svelte/transition";

    type CycleButton = {
        icon: string;
        label: string;
        disabled: boolean;
    };

    let {
        cycle,
        progress,
        cycleButtons,
        actionButtons = [],
    }: {
        cycle: (direction: -1 | 1) => void;
        progress: [number, number];
        cycleButtons: {
            "-1": CycleButton;
            "1": CycleButton;
        };
        actionButtons?: {
            icon: string;
            label: string;
            onClick?: (event: MouseEvent) => void;
        }[];
    } = $props();
</script>

<svelte:window
    onkeydown={(event: KeyboardEvent) => {
        // Only register events if the user is not focused on anything or if they are focused on the study cards
        if (
            document.activeElement?.tagName !== "BODY" &&
            !(event.target as HTMLElement | null)?.closest("main")
        )
            return;

        event.preventDefault();
        (event.target as HTMLElement).blur();

        switch (event.key) {
            case "ArrowLeft":
                cycle(-1);
                break;
            case "ArrowRight":
                cycle(1);
                break;
        }
    }}
/>

{#snippet navigationButton(icon: string, label: string, disabled: boolean, direction: -1 | 1)}
    <button
        class="button-primary rounded-full! p-3.5!"
        type="button"
        aria-label={label}
        {disabled}
        onclick={() => cycle(direction)}
    >
        <img class="size-9" src={icon} alt={label} />
    </button>
{/snippet}

<div class="relative mt-4 w-full" in:fade={{ duration: 200 }}>
    <div class="flex-center gap-1">
        {@render navigationButton(
            cycleButtons["-1"].icon,
            cycleButtons["-1"].label,
            cycleButtons["-1"].disabled,
            -1
        )}

        <p class="w-20 text-center text-lg font-bold">
            {Math.min(progress[0], progress[1])}<span class="font-normal">/</span>{progress[0]}
        </p>

        {@render navigationButton(
            cycleButtons["1"].icon,
            cycleButtons["1"].label,
            cycleButtons["1"].disabled,
            1
        )}
    </div>

    <div class="flex-center sm:y-center mt-4 gap-2 sm:right-8 sm:mt-0">
        {#if actionButtons.length > 1}
            {#each actionButtons as { icon, label, onClick }}
                <button class="button-icon" type="button" aria-label={label} onclick={onClick}>
                    <img class="size-6!" src={icon} alt={label} />
                </button>
            {/each}
        {/if}
    </div>
</div>
