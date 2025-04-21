<script lang="ts">
    let {
        name,
        description,
        icon,
        url,
        meta,
    }: {
        name: string;
        description?: string;
        icon?: string;
        url: string;
        meta: string[];
    } = $props();
</script>

<a class="button-primary block! w-full flex-col items-start! px-6! py-5!" href={url}>
    <div class="w-full space-y-1">
        <div class="flex items-center gap-1">
            {#if icon}
                <img src={icon} alt="Folder" class="size-8" />
            {/if}

            <p class="w-full overflow-hidden text-2xl leading-none font-bold text-ellipsis">
                {name}
            </p>
        </div>

        <div class="[&>p]:text-dark flex flex-wrap items-center gap-x-4 gap-y-1 [&>p]:leading-none">
            {#each meta as item}
                {#if item.length > 0}
                    <p class="leading-tight text-nowrap">{item}</p>
                {/if}
            {/each}
        </div>
    </div>

    {#if description && description.length > 0}
        <p class="text-light mt-3 line-clamp-1 overflow-hidden leading-none text-ellipsis">
            {description}
        </p>
    {/if}
</a>
