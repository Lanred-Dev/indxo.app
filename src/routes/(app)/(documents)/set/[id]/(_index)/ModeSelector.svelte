<script lang="ts">
    import determineWording from "$lib/utils/determineWording";

    let {
        id,
        modes,
    }: {
        id: string;
        modes: {
            text: string;
            icon: string;
            endpoint: string;
        }[];
    } = $props();
</script>

<div class="list-primary">
    <p class="list-title">{determineWording("modes")}</p>

    <ul class="list flex">
        {#each modes as { icon, text, endpoint }}
            <li class="grow">
                <a class="button-primary" href="/set/{id}/{endpoint}">
                    <img class="size-7" src={icon} alt={text} />
                    <p>{text}</p>
                </a>
            </li>
        {/each}
    </ul>
</div>
