<script lang="ts">
    import type { CardBreadcrumb } from ".";
    import Icon from "../Icon.svelte";

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

<a class="container-primary block w-full px-6 py-5" href={url}>
    {#if breadcrumbs.length > 0}
        <ol class="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {#each breadcrumbs as { text, icon }}
                <li
                    class="flex-center container-primary bg-attention-light gap-1 rounded-full border-0 px-2 py-1 shadow-xs"
                >
                    {#if icon}
                        <Icon class="size-5 rounded-full" {icon} />
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
