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
    class="relative w-[18%] min-w-fit space-y-10 border-r border-primary bg-primary-400 p-10"
    style="display: {$visible ? 'block' : 'none'};"
>
    {@render group(null, [
        { icon: "/icons/navigation/Home.svg", text: "Home", url: "/" },
        { icon: "/icons/navigation/Account.svg", text: "Account", url: "/my" },
    ])}

    {@render group("My library", [
        { icon: "/icons/navigation/Stars.svg", text: "Favorites", url: "/my/favorites" },
        { icon: "/icons/navigation/Folder.svg", text: "Folders", url: "/my/folders" },
        { icon: "/icons/navigation/Document.svg", text: "Study Sets", url: "/my/sets" },
    ])}

    {@render group("Create new", [
        { icon: "/icons/navigation/FolderPlus.svg", text: "Folder", url: "/create?type=folder" },
        { icon: "/icons/navigation/DocumentPlus.svg", text: "Study Set", url: "/create?type=set" },
    ])}

    <p class="text-dark absolute bottom-10 text-sm">Made for Savannah ❤️</p>
</div>
