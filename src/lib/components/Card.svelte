<script lang="ts">
    let {
        name,
        description,
        icon,
        url,
        meta,
    }: {
        name: string;
        description: string;
        icon?: string;
        url: string;
        meta: string[];
    } = $props();
</script>

<a class="button-primary !block w-full flex-col !items-start space-y-2 !px-6 !py-5" href={url}>
    <div class="w-full space-y-1">
        <div class="flex items-center gap-1">
            {#if icon}
                <img src={icon} alt="Folder" class="size-8" />
            {/if}

            <p class="w-full overflow-hidden overflow-ellipsis text-2xl font-bold leading-none">
                {name}
            </p>
        </div>

        <div class="[&>p]:text-dark flex items-center gap-4 [&>p]:leading-none">
            {#each meta as item}
                {#if item.length > 0}
                    <p class="leading-tight">{item}</p>
                {/if}
            {/each}
        </div>
    </div>

    <p class="text-light line-clamp-1 overflow-hidden overflow-ellipsis">
        {description}
    </p>
</a>
