<script lang="ts">
    import Icon from "../Icon.svelte";
    import Trigger from "./Trigger.svelte";

    let {
        title,
        includeCloseButton = true,
    }: {
        title: string;
        includeCloseButton?: boolean;
    } = $props();
</script>

<div class="flex-center relative mb-2 w-full px-2 sm:px-5 md:px-11">
    <p class="text-center text-3xl font-bold">{title}</p>

    {#if includeCloseButton}
        <Trigger class="button-icon y-center right-0">
            <Icon icon="general/X" />
        </Trigger>
    {/if}
</div>
