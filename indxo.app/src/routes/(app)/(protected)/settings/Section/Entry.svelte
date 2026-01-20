<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        title,
        description,
        children,
    }: {
        title: string;
        description: string;
        children: Snippet<[]>;
    } = $props();
</script>

<div class="flex flex-col justify-start gap-4 md:flex-row md:items-start md:justify-between">
    <div class="md:max-w-3/5">
        <p class="text-lg leading-snug font-semibold">
            {title}
        </p>

        <p class="mt-1 leading-none">
            {description}
        </p>
    </div>

    <div>
        {@render children()}
    </div>
</div>
