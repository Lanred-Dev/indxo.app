<script lang="ts">
    import Folder from "./Folder.svelte";
    import Set from "./Set.svelte";

    export type card = {
        name: string;
        description: string;
        isPublic: boolean;
        linkTo: string;
        [key: string]: any;
    };

    export type sectionType = "set" | "folder";

    let {
        title,
        type,
        cards,
        linkTo,
    }: { title: string; type: sectionType; cards: card[]; linkTo?: string } = $props();
</script>

<div class="w-full space-y-2">
    <div class="{linkTo ? 'flex-center' : ''} w-full justify-between px-3">
        <p class="text-3xl font-bold">{title}</p>

        {#if linkTo}
            <a class="text-light text-lg" href={linkTo}>View all</a>
        {/if}
    </div>

    <ul class="flex gap-2">
        {#each cards as card}
            <li>
                {#if type === "set"}
                    <Set {...card} />
                {:else if type === "folder"}
                    <Folder {...card} />
                {/if}
            </li>
        {/each}
    </ul>
</div>
