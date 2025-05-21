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

    let sorted: number = $derived(stillLearning + knows);
</script>

<div class="relative mb-1 flex w-full items-center justify-between px-6">
    <p class="text-alert text-2xl">{stillLearning}</p>

    <div class="x-center y-center bg-light h-1 w-1/2 rounded-full">
        <div
            class="relative h-full overflow-hidden rounded-full bg-green-500 transition-[width] duration-200"
            style:width="{(sorted / terms) * 100}%"
        >
            <span
                class="y-center bg-alert left-0 h-full transition-[width] duration-200"
                style:width="{(stillLearning / sorted) * 100}%"
            ></span>
        </div>
    </div>

    <p class="text-2xl text-green-500">{knows}</p>
</div>
