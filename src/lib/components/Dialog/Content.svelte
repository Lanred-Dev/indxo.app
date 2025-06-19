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
        <div class="x-center y-center flex-center w-full px-5 md:px-0">
            <div
                class="container-primary flex-center relative w-fit min-w-[20%] flex-col px-4 py-6 text-lg md:px-8 md:py-10"
                in:fly={{ y: 20, duration: 200 }}
            >
                {@render children()}
            </div>
        </div>
    </div>
{/if}
