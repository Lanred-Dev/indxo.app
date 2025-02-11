<script lang="ts">
    import type { card } from "./Section.svelte";

    let { linkTo, name, subject, description, isPublic }: card = $props();
</script>

<div class="primary inline-block h-32 w-80 border border-primary">
    <a
        class="flex h-full w-full flex-col justify-between overflow-hidden px-8 py-6 [&>p]:leading-tight"
        href={linkTo}
    >
        <div class="w-full">
            <p class="w-full overflow-hidden overflow-ellipsis text-xl font-bold">{name}</p>
            <p class="text-dark text-sm">{subject}</p>
        </div>

        <p class="text-light line-clamp-1 overflow-hidden overflow-ellipsis">
            {description}
        </p>
    </a>
</div>
