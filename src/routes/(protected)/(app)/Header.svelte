<script lang="ts">
    import Hamburger from "$lib/icons/Hamburger.svelte";
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import { showSidebar } from "./state";

    let { user }: { user: any } = $props();

    let windowTitle: string = $state("");

    onMount(() => {
        windowTitle = document.title;
    });
</script>

<header
    class="flex-center top-0 w-full !justify-between border-b border-primary-900 bg-accent-primary px-10 py-4"
>
    <div>
        <button onclick={() => showSidebar.set(!get(showSidebar))}>
            <Hamburger strokeWidth={1} classes="aspect-1 h-9" />
        </button>

        <p>{windowTitle}</p>
    </div>

    <div>
        <img class="border-light aspect-1 h-9 rounded-full" src={user.image} alt={user.name} />
    </div>
</header>
