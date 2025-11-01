<script lang="ts">
    import { DialogTrigger } from ".";

    let {
        title,
        includeCloseButton = true,
    }: {
        title: string;
        includeCloseButton?: boolean;
    } = $props();
</script>

<div class="flex-center relative mb-2 px-2 sm:px-5 md:px-11">
    <p class="text-center text-3xl font-bold">{title}</p>

    {#if includeCloseButton}
        <DialogTrigger class="button-icon y-center right-0">
            <img src="/icons/general/X.svg" alt="Close dialog" />
        </DialogTrigger>
    {/if}
</div>
