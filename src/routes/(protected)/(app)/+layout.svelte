<script lang="ts">
    import Header from "./Header.svelte";
    import Sidebar from "./Sidebar.svelte";
    import type { Snippet } from "svelte";

    let { children }: { children: Snippet<[]> } = $props();
</script>

<Header />
<Sidebar />

{@render children?.()}
