<script lang="ts">
    import FolderForm from "./Forms/Folder.svelte";
    import SetForm from "./Forms/Set.svelte";
    import { onMount } from "svelte";

    let type: "folder" | "set";

    onMount(() => {
        const params = new URLSearchParams(location.search);
        type = (params.get("type") as any) || "folder";
    });
</script>

<div class="x-center y-center w-2/3">
    {#if type === "folder"}
        <FolderForm classes="w-full" action="/create" />
    {:else}
        <SetForm />
    {/if}
</div>
