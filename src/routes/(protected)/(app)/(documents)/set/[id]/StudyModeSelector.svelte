<script lang="ts">
    import determineWording from "$lib/utils/determineWording";

    const modes = [
        {
            name: determineWording("cards"),
            icon: "/icons/general/Pencil.svg",
            link: `/set/{data.set?._id}/flashcards`,
        },
        {
            name: determineWording("test"),
            icon: "/icons/general/Pencil.svg",
            link: `/set/{data.set?._id}/quiz`,
        },
        {
            name: determineWording("sort"),
            icon: "/icons/general/Pencil.svg",
            link: `/set/{data.set?._id}/learn`,
        },
    ];
</script>

<div>
    <p class="text-light text-2xl font-bold">{determineWording("modes")}</p>

    <div class="flex flex-wrap gap-2">
        {#each modes as mode}
            <a href={mode.link} class="secondary flex-center">
                <img src={mode.icon} alt={mode.name} class="size-7" />
                <p
                    class="text-light
                    text-lg font-bold"
                >
                    {mode.name}
                </p>
            </a>
        {/each}
    </div>
</div>
