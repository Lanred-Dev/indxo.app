<script lang="ts">
    let { data } = $props();

    // svelte-ignore non_reactive_update
    let startingTime: number = 10;
    let active: boolean = $state(false);
    let timeRemaining: number = $state(0);

    function start() {
        active = true;
        timeRemaining = startingTime;

        const timerUpdaterInterval = setInterval(() => {
            timeRemaining -= 0.05;

            if (timeRemaining <= 0) {
                timeRemaining = 0;
                active = false;
                clearInterval(timerUpdaterInterval);
            }
        }, 50);
    }
</script>

{#if active}
    <div class="w-full">
        <p class="text-center text-3xl font-bold">
            {timeRemaining.toFixed(2)}
        </p>
    </div>
{:else}
    <input class="input-primary" type="number" aria-label="Time" bind:value={startingTime} />

    <button class="button-primary" onclick={start}>Start</button>
{/if}
