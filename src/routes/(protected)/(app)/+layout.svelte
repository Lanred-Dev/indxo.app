<script lang="ts">
    import Header from "./Header.svelte";
    import Sidebar from "./Sidebar.svelte";
    import type { Snippet } from "svelte";

    let { data, children }: { data: any; children: Snippet<[]> } = $props();
</script>

<div class="flex h-screen w-full flex-col">
    <Header user={data.session.user} />

    <div class="flex h-full w-full flex-grow">
        <Sidebar />

        <main class="relative h-full w-full">
            {@render children?.()}
        </main>
    </div>
</div>
