<script lang="ts">
    import { getContext, type Snippet } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { dialogContextKey, type DialogContext } from ".";

    let {
        children,
    }: {
        children: Snippet<[]>;
    } = $props();

    const dialogContext: DialogContext = getContext(dialogContextKey);
</script>

{#if dialogContext().isVisible}
    <div
        class="fixed top-0 left-0 z-50 h-full w-full backdrop-blur-sm backdrop-brightness-50"
        transition:fade={{ duration: 100 }}
    >
        <div
            class="container-primary x-center y-center flex-center relative z-50 w-fit min-w-[20%] flex-col px-8 py-8"
            in:fly={{ y: 20, duration: 200 }}
        >
            {@render children()}
        </div>
    </div>
{/if}
