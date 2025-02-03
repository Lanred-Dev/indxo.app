<script lang="ts">
    import { type Writable } from "svelte/store";

    let { visible }: { visible: Writable<boolean> } = $props();
</script>

{#snippet group(name: string | null, links: { url: string; text: string; icon: string }[])}
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
    class="relative w-[17.5%] min-w-fit space-y-10 border-r border-primary-900 bg-primary-400 p-10"
    style="display: {$visible ? 'block' : 'none'};"
>
    {@render group(null, [{ icon: "/icons/sidebar/Home.svg", text: "Home", url: "/" }])}

    {@render group("My library", [
        { icon: "/icons/sidebar/Stars.svg", text: "Favorites", url: "/my/favorites" },
        { icon: "/icons/sidebar/Folder.svg", text: "Folders", url: "/my/folders" },
        { icon: "/icons/sidebar/Document.svg", text: "Study Sets", url: "/my/sets" },
    ])}

    {@render group("Create new", [
        { icon: "/icons/sidebar/FolderPlus.svg", text: "Folder", url: "/create?type=folder" },
        { icon: "/icons/sidebar/DocumentPlus.svg", text: "Study Set", url: "/create?type=set" },
    ])}

    <p class="text-dark absolute bottom-10 text-sm">Made for Savannah ❤️</p>
</div>
