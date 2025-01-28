<script lang="ts">
    import Hamburger from "$lib/icons/Hamburger.svelte";
    import { onMount } from "svelte";

    let { user } = $props();

    let showSidebar: boolean = false;
    let windowTitle: string = $state("");

    onMount(() => {
        windowTitle = document.title;
    });
</script>

<header
    class="flex-center top-0 w-full !justify-between border-b bg-accent-primary p-4 px-10 shadow-sm"
>
    <div class="flex-center gap-2">
        <button onclick={() => (showSidebar = !showSidebar)}>
            <Hamburger strokeWidth={1} classes="aspect-1 h-9" />
        </button>

        <p>{windowTitle}</p>
    </div>

    <div>
        <img class="border-light aspect-1 h-9 rounded-full" src={user.image} alt={user.name} />
    </div>
</header>
