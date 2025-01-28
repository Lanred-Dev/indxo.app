<script lang="ts">
    import { showSidebar } from "./state";
</script>

{#snippet group(name: string, links: Array<[string, string, string]>)}
    <div>
        <p class="text-light mb-2">{name}...</p>

        <ul class="space-y-1">
            {#each links as [icon, title, link]}
                <li>
                    <a class="flex items-center gap-2" href={link}>
                        <img class="aspect-1 h-6" src={icon} alt={title} />
                        <p class="text-lg">{title}</p>
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
        ["/icons/Folder.svg", "Folders", "/my/folders"],
        ["/icons/Document.svg", "Study Sets", "/my/sets"],
    ])}

    {@render group("Create new", [
        ["/icons/FolderPlus.svg", "Folder", "/create?type=folder"],
        ["/icons/DocumentPlus.svg", "Study Set", "/create?type=set"],
    ])}
</div>
