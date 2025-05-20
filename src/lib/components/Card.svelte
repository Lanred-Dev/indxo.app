<script lang="ts">
    export type CardInfoItem = { text: string; image?: string };

    let {
        name,
        url,
        description,
        icon,
        info = [],
    }: {
        name: string;
        url: string;
        description?: string;
        icon?: string;
        info?: CardInfoItem[];
    } = $props();
</script>

<!--NOTE: For some reason not having the block class can cause some weird issues-->
<a
    class="container-primary clay-attention-bright block w-full px-6 py-5"
    style:--clay-color-dark-percentage="90%"
    href={url}
>
    {#if info.length > 0}
        <ol class="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {#each info as { text, image }}
                <li
                    class="flex-center container-primary bg-attention-dark gap-1 rounded-full border-0 shadow-xs {image
                        ? 'pr-2 pl-1'
                        : 'px-2'} py-1"
                >
                    {#if image}
                        <img class="size-5 rounded-full" src={image} alt={text} />
                    {/if}

                    <p
                        class="max-w-28 overflow-hidden leading-tight font-medium text-nowrap text-ellipsis"
                    >
                        {text}
                    </p>
                </li>
            {/each}
        </ol>
    {/if}

    <div class="flex-center gap-1">
        {#if icon}
            <img src={icon} alt="Folder" class="size-8" />
        {/if}

        <p class="w-full max-w-full text-2xl font-bold text-wrap text-ellipsis">
            {name}
        </p>
    </div>

    {#if description && description.length > 0}
        <p class="text-light w-full text-lg leading-none text-ellipsis">
            {description}
        </p>
    {/if}
</a>
