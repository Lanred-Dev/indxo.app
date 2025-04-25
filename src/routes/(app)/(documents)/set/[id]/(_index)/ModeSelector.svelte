<script lang="ts">
    import { goto } from "$app/navigation";
    import determineWording from "$lib/utils/determineWording";

    let { id }: { id: string } = $props();

    const MODES: {
        text: string;
        icon: string;
        endpoint: string;
    }[] = [
        {
            text: determineWording("sort"),
            icon: "/icons/general/Star.svg",
            endpoint: `/set/${id}/study`,
        },
        {
            text: determineWording("test"),
            icon: "/icons/general/Star.svg",
            endpoint: `/set/${id}/quiz`,
        },
    ];
</script>

<div class="list-primary">
    <p class="list-title">{determineWording("modes")}</p>

    <ul class="list flex">
        {#each MODES as { icon, text, endpoint }}
            <li class="grow">
                <button
                    class="button-primary flex-center h-full w-full gap-2 px-6!"
                    onclick={() => {
                        goto(`/set/${id}/${endpoint}`);
                    }}
                >
                    <img class="size-7" src={icon} alt={text} />
                    <p>{text}</p>
                </button>
            </li>
        {/each}
    </ul>
</div>
