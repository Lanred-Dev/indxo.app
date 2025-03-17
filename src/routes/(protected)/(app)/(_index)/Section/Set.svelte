<script lang="ts">
    import type { card } from "./Section.svelte";

    let { linkTo, name, subject, description }: card = $props();
</script>

<a class="button-primary inline-block h-full w-full space-y-2 !px-6 !py-4" href={linkTo}>
    <div class="w-full">
        <p class="w-full overflow-hidden overflow-ellipsis text-2xl font-bold">{name}</p>

        {#if subject.length > 0}
            <p class="text-dark flex items-center gap-4 leading-none">{subject}</p>
        {/if}
    </div>

    <p class="text-light line-clamp-1 overflow-hidden overflow-ellipsis">{description}</p>
</a>
