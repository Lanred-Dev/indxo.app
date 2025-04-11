<script lang="ts">
    import { goto } from "$app/navigation";
    import determineWording from "$lib/utils/determineWording";
    import { type Writable } from "svelte/store";

    let { id, mode }: { id: string; mode: Writable<string> } = $props();

    type modeInfo = {
        id: string;
        name: string;
        icon: string;
        link?: string;
    };

    const MODES: modeInfo[] = [
        {
            id: "cards",
            name: determineWording("cards"),
            icon: "/icons/general/Star.svg",
        },
        {
            id: "sort",
            name: determineWording("sort"),
            icon: "/icons/general/Star.svg",
        },
        {
            id: "test",
            name: determineWording("test"),
            icon: "/icons/general/Star.svg",
            link: `/set/${id}/quiz`,
        },
    ];

    function setMode(modeInfo: modeInfo) {
        if (modeInfo?.link) goto(modeInfo.link);

        mode.set(modeInfo.id);
    }
</script>

<div class="list-primary">
    <p class="list-title">{determineWording("modes")}</p>

    <ul class="list flex">
        {#each MODES as mode}
            <li class="grow">
                <button
                    class="button-primary flex-center h-full w-full gap-2 px-6!"
                    onclick={() => setMode(mode)}
                >
                    <img class="size-7" src={mode.icon} alt={mode.name} />
                    <p>{mode.name}</p>
                </button>
            </li>
        {/each}
    </ul>
</div>
