<script lang="ts">
    import Hamburger from "$lib/icons/Hamburger.svelte";

    let showSidebar = false;
</script>

<header
    class="x-center bg-accent-primary top-0 flex w-full items-center justify-between border-b shadow-sm"
>
    <button onclick={() => (showSidebar = !showSidebar)} class="p-2 lg:hidden">
        <Hamburger classes="aspect-1 h-6" />
    </button>
</header>
