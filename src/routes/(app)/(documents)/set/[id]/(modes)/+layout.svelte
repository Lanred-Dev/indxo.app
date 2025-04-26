<script lang="ts">
    import { beforeNavigate } from "$app/navigation";
    import { getContext, onMount } from "svelte";
    import type { SidebarContext } from "../../../../+layout.svelte";

    let { children } = $props();

    const sidebar: SidebarContext = getContext("sidebar");

    function checkIfShouldHideSidebar(url: string) {
        if (url.includes("/sort")) {
            sidebar.visible = false;
        } else if (window.innerWidth > 786) {
            sidebar.visible = true;
        }
    }

    beforeNavigate((navigation) => {
        checkIfShouldHideSidebar(navigation.to?.url.pathname ?? "");
    });

    onMount(() => {
        checkIfShouldHideSidebar(window.location.pathname);
    });
</script>

{@render children?.()}
