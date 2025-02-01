<script lang="ts">
    import HamburgerIcon from "$lib/icons/Hamburger.svelte";
    import { type Writable } from "svelte/store";

    let { user, sidebarVisible }: { user: any; sidebarVisible: Writable<boolean> } = $props();
</script>

<header
    class="flex-center top-0 w-full !justify-between border-b border-primary-900 bg-accent-primary px-10 py-4"
>
    <div class="flex-center gap-1">
        <button onclick={() => sidebarVisible.update((visible: boolean) => !visible)}>
            <HamburgerIcon classes="aspect-1 h-9" />
        </button>
    </div>

    <div>
        <img class="border-light aspect-1 h-9 rounded-full" src={user.image} alt={user.name} />
    </div>
</header>
