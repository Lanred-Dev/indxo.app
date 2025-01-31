<script lang="ts">
    import { showSidebar } from "./state";
</script>

{#snippet group(name: string, links: Array<{ url: string; text: string; icon: string }>)}
    <div>
        <p class="text-light mb-2">{name}...</p>

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
    style="display: {$showSidebar ? 'block' : 'hidden'};"
>
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
