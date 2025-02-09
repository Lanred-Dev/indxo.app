<script lang="ts">
    import HamburgerIcon from "$lib/icons/Hamburger.svelte";
    import { type Writable } from "svelte/store";

    let { user, sidebarVisible }: { user: any; sidebarVisible: Writable<boolean> } = $props();

    let searching: boolean = $state(false);
</script>

<header
    class="relative top-0 flex w-full items-center justify-between border-primary border-b bg-accent-primary px-10 py-4"
>
    <div class="flex-center gap-1">
        <button onclick={() => sidebarVisible.update((visible: boolean) => !visible)}>
            <HamburgerIcon classes="aspect-1 h-10" />
        </button>
    </div>

    <div class="w-72">
        <input
            class="primary w-full"
            type="text"
            placeholder="Search"
            onfocus={() => {
                searching = true;
            }}
            onblur={() => {
                searching = false;
            }}
        />
    </div>

    <div>
        <img
            class="aspect-1 h-10 rounded-full border border-primary"
            src={user.image}
            alt={user.name}
        />
    </div>

    {#if searching}
        <div class="x-center primary top-full w-96 rounded-lg border border-primary">
            <div class="p-4">
                <p class="text-primary-900">Search results</p>
            </div>
        </div>
    {/if}
</header>
