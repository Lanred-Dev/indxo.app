<script lang="ts">
    import { fade } from "svelte/transition";

    type CycleButton = {
        icon: string;
        text: string;
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
            text: string;
            onClick?: (event: MouseEvent) => void;
        }[];
    } = $props();
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
        class="button-primary rounded-full p-3.5"
        type="button"
        aria-label={label}
        {disabled}
        onclick={() => cycle(direction)}
    >
        <img class="size-9" src={icon} alt={label} />
    </button>
{/snippet}

<div id="controls" class="relative mt-4 w-full" in:fade={{ duration: 200 }}>
    <div class="flex-center gap-1">
        {@render navigationButton(
            cycleButtons["-1"].icon,
            cycleButtons["-1"].text,
            cycleButtons["-1"].disabled,
            -1
        )}

        <p class="w-20 text-center text-lg font-bold">
            {Math.min(progress[0] ?? 0, progress[1] ?? 0)}<span class="font-normal">/</span
            >{progress[0] ?? 0}
        </p>

        {@render navigationButton(
            cycleButtons["1"].icon,
            cycleButtons["1"].text,
            cycleButtons["1"].disabled,
            1
        )}
    </div>

    <div class="flex-center sm:y-center mt-4 gap-2 sm:right-8 sm:mt-0">
        {#if actionButtons.length > 1}
            {#each actionButtons as { icon, text, onClick }}
                <button class="button-icon" type="button" aria-label={text} onclick={onClick}>
                    <img src={icon} alt={text} />
                </button>
            {/each}
        {/if}
    </div>
</div>
