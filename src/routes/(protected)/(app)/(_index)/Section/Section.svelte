<script lang="ts">
    import Folder from "./Folder.svelte";
    import Set from "./Set.svelte";

    export type section = {
        title: string;
        type: sectionType;
        cards: card[];
        linkTo?: string;
    };

    export type card = {
        name: string;
        description: string;
        isPublic: boolean;
        linkTo: string;
        [key: string]: any;
    };

    export type sectionType = "set" | "folder";

    let { title, type, cards, linkTo }: section = $props();
</script>

<div class="list-primary">
    <div class="{linkTo ? 'flex items-center justify-between' : ''} w-full px-3">
        <p class="list-title">{title}</p>

        {#if linkTo}
            <a class="text-light text-lg" href={linkTo}>View all</a>
        {/if}
    </div>

    <ul class="list flex !flex-nowrap overflow-x-hidden px-1 pb-2">
        {#each cards as card}
            <li class="h-full min-w-fit flex-grow">
                {#if type === "set"}
                    <Set {...card} />
                {:else if type === "folder"}
                    <Folder {...card} />
                {/if}
            </li>
        {/each}
    </ul>
</div>

<style lang="postcss">
    .list-primary .list {
        -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 0));
        mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 0));
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-position: 0% 15%;
        mask-position: 0% 15%;
    }
</style>
