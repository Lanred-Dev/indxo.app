<script lang="ts">
    import { type Writable } from "svelte/store";

    let { visible }: { visible: Writable<boolean> } = $props();
</script>

{#snippet group(name: string | null, links: Array<{ url: string; text: string; icon: string }>)}
    <div>
        {#if name}
            <p class="text-light mb-2">{name}...</p>
        {/if}

        <ul class="space-y-1">
            {#each links as { url, text, icon }}
                <li>
                    <a class="flex items-center gap-2" href={url}>
                        <img class="aspect-1 h-6" src={icon} alt={text} />
                        <p class="text-lg">{text}</p>
                    </a>
                </li>
            {/each}
        </ul>
    </div>
{/snippet}

<div
    class="w-1/5 min-w-fit space-y-10 border-r border-primary-900 bg-primary-300 p-10"
    style="display: {$visible ? 'block' : 'none'};"
>
    {@render group(null, [{ icon: "/icons/sidebar/Home.svg", text: "Home", url: "/" }])}

    {@render group("My library", [
        { icon: "/icons/sidebar/Folder.svg", text: "Favorites", url: "/my/favorites" },
        { icon: "/icons/sidebar/Folder.svg", text: "Folders", url: "/my/folders" },
        { icon: "/icons/sidebar/Document.svg", text: "Study Sets", url: "/my/sets" },
    ])}

    {@render group("Create new", [
        { icon: "/icons/sidebar/FolderPlus.svg", text: "Folder", url: "/create?type=folder" },
        { icon: "/icons/sidebar/DocumentPlus.svg", text: "Study Set", url: "/create?type=set" },
    ])}
</div>
