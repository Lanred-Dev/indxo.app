<script lang="ts">
    import { beforeNavigate } from "$app/navigation";
    import { getContext, onMount } from "svelte";
    import type { SidebarContext } from "../../../../+layout.svelte";
    import determineWording from "$lib/utils/determineWording";

    let { data, children } = $props();

    const sidebar: SidebarContext = getContext("sidebar");

    function checkIfShouldHideSidebar(url: string) {
        if (url.includes("/sort") || url.includes("/matching")) {
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

<div class="mb-10">
    <a href="/set/{data.id}">Back to {determineWording("set")}</a>
</div>

{@render children?.()}
