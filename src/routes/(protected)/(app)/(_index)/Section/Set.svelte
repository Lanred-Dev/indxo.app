<script lang="ts">
    import type { card } from "./Section.svelte";

    let { linkTo, name, subject, description, isPublic }: card = $props();
</script>

<a
    class="border-light inline-block h-36 w-96 space-y-3 overflow-hidden rounded-button bg-primary-800 px-8 py-6 text-primary [&>p]:leading-tight"
    href={linkTo}
>
    <div>
        <p class="text-lg">{name}</p>
        <p class="text-bright text-sm">{subject}</p>
    </div>

    <p class="text-light w-full overflow-hidden text-ellipsis">
        {#if description.length > 0}
            {description}
        {:else}
            No description
        {/if}
    </p>
</a>
