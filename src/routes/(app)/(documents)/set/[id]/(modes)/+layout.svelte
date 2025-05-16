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

<div class="relative mb-10 w-full">
    <p class="md:x-center md:y-center mb-3 text-2xl">{data.name}</p>

    <a class="button-basic w-fit" href="/set/{data._id}">
        <img src="/icons/general/LeftChevron.svg" alt="Back" />
        Back to {determineWording("set")}
    </a>
</div>

{@render children?.()}
