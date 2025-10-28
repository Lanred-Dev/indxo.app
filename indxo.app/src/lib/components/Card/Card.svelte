<script lang="ts">
    import type { CardBreadcrumb } from ".";

    let {
        name,
        url,
        description,
        icon,
        breadcrumbs = [],
    }: {
        name: string;
        url: string;
        description?: string;
        icon?: string;
        breadcrumbs?: CardBreadcrumb[];
    } = $props();
</script>

<a
    class="container-primary clay-attention-bright block w-full px-6 py-5"
    style:--clay-color-dark-percentage="90%"
    href={url}
>
    {#if breadcrumbs.length > 0}
        <ol class="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {#each breadcrumbs as { text, icon }}
                <li
                    class="flex-center container-primary bg-attention-dark gap-1 rounded-full border-0 shadow-xs {icon
                        ? 'pr-2 pl-1'
                        : 'px-2'} py-1"
                >
                    {#if icon}
                        <img class="size-5 rounded-full" src={icon} alt={text} />
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
