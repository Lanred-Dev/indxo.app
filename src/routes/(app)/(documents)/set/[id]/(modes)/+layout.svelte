<script lang="ts">
    import { afterNavigate } from "$app/navigation";
    import { getContext } from "svelte";

    let { children } = $props();

    const sidebarVisible: { visible: boolean } = getContext("sidebarVisible");

    afterNavigate((navigation) => {
        if (navigation.to?.url.pathname.includes("/sort")) {
            sidebarVisible.visible = false;
        } else if (window.innerWidth > 786) {
            sidebarVisible.visible = true;
        }
    });
</script>

{@render children?.()}
