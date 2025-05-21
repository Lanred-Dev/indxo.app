<script lang="ts">
    let { data } = $props();

    // svelte-ignore non_reactive_update
    let startingTime: number = 10;
    let isPlaying: boolean = $state(false);
    let timeRemaining: number = $state(0);

    function start() {
        isPlaying = true;
        timeRemaining = startingTime;

        const timerInterval = setInterval(() => {
            if (timeRemaining - 0.05 <= 0) {
                timeRemaining = 0;
                isPlaying = false;
                clearInterval(timerInterval);
            } else {
                timeRemaining -= 0.05;
            }
        }, 50);
    }
</script>

{#if isPlaying}
    <div class="w-full">
        <p class="text-center text-3xl font-bold">
            {timeRemaining.toFixed(2)}
        </p>
    </div>
{:else}
    <input class="input-primary" type="number" aria-label="Time" bind:value={startingTime} />

    <button class="button-primary" onclick={start}>Start</button>
{/if}
