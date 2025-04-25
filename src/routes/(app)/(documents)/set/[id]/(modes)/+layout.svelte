<script lang="ts">
    import { beforeNavigate } from "$app/navigation";
    import { getContext, onMount } from "svelte";

    let { children } = $props();

    const sidebarVisible: { visible: boolean } = getContext("sidebarVisible");

    function checkIfShouldHideSidebar(url: string) {
        if (url.includes("/sort")) {
            sidebarVisible.visible = false;
        } else if (window.innerWidth > 786) {
            sidebarVisible.visible = true;
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
