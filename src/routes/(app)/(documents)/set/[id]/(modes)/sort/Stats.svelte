<script lang="ts">
    let {
        stillLearning,
        knows,
        terms,
    }: {
        stillLearning: number;
        knows: number;
        terms: number;
    } = $props();
    let termsSorted: number = $state(stillLearning + knows);
</script>

<div class="relative mb-1 flex w-full items-center justify-between px-3">
    <p class="text-alert text-lg">{stillLearning}</p>

    <!--Progress bar for sorting-->
    <div class="x-center y-center bg-primary-400 h-1 w-1/2 rounded-full">
        <div
            class="relative h-full overflow-hidden rounded-full bg-green-500 transition-[width] duration-200"
            style:width="{(termsSorted / terms) * 100}%"
        >
            <span
                class="y-center bg-accent-alert left-0 h-full transition-[width] duration-200"
                style:width="{(stillLearning / termsSorted) * 100}%"
            ></span>
        </div>
    </div>

    <p class="text-lg text-green-500">{knows}</p>
</div>
