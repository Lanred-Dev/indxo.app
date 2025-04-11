<script lang="ts">
    import { type itemProps, type sectionProps } from "../+page";

    let { title, items, linkTo }: sectionProps = $props();
</script>

{#snippet card({ linkTo, name, description, owner }: itemProps)}
    <li class="h-full w-full">
        <a class="button-primary inline-block h-full w-full space-y-2 px-6! py-4!" href={linkTo}>
            <div class="w-full">
                <p class="w-full overflow-hidden text-ellipsis text-nowrap text-2xl font-bold">
                    {name}
                </p>
                <p>{owner.name}</p>
            </div>

            <p class="text-light line-clamp-1 overflow-hidden text-ellipsis">{description}</p>
        </a>
    </li>
{/snippet}

<div class="list-primary">
    <div class="{linkTo ? 'flex items-center justify-between' : ''} w-full px-3">
        <p class="list-title">{title}</p>

        {#if linkTo}
            <a class="text-light" href={linkTo}>View all</a>
        {/if}
    </div>

    <ul class="list grid grid-cols-2 grid-rows-2">
        {#each items as item}
            {@render card(item)}
        {/each}
    </ul>
</div>
