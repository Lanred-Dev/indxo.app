<script lang="ts">
    import { DialogClose } from ".";

    let {
        title,
        includeClose = true,
    }: {
        title: string;
        includeClose?: boolean;
    } = $props();
</script>

<div class="flex-center relative mb-5 px-11">
    <p class="text-3xl font-bold">{title}</p>

    {#if includeClose}
        <DialogClose class="button-icon y-center right-0">
            <img src="/icons/general/X.svg" alt="Close dialog" />
        </DialogClose>
    {/if}
</div>
