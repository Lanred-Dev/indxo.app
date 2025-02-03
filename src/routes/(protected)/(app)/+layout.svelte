<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import Header from "./Header.svelte";
    import Sidebar from "./Sidebar.svelte";
    import type { Snippet } from "svelte";

    let { data, children }: { data: any; children: Snippet<[]> } = $props();

    const sidebarVisible: Writable<boolean> = writable(true);
</script>

<div class="flex h-screen w-full flex-col">
    <Header user={data.session.user} {sidebarVisible} />

    <div class="flex h-full w-full flex-grow">
        <Sidebar visible={sidebarVisible} />

        <main
            class="relative flex h-full w-full flex-col items-start justify-start overflow-hidden px-36 pt-24 lg:px-52"
        >
            {@render children?.()}
        </main>
    </div>
</div>
