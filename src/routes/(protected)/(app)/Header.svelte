<script lang="ts">
    import { type Writable } from "svelte/store";
    import type { PublicFolder } from "$lib/database/documents/Folder";
    import type { PublicSet } from "$lib/database/documents/Set";
    import type { PublicUser } from "$lib/database/documents/User";

    let { user, sidebarVisible }: { user: any; sidebarVisible: Writable<boolean> } = $props();

    let searching: boolean = $state(false);
    let searchResults: (PublicUser | PublicSet | PublicFolder)[] = $state([]);

    async function search(event: Event) {
        searchResults = await (
            await fetch("/api/search", {
                method: "POST",
                body: JSON.stringify({
                    query: (event.target as HTMLInputElement)?.value,
                }),
            })
        ).json();
    }
</script>

<header
    class="relative top-0 flex w-full items-center justify-between border-b border-primary bg-accent-primary px-10 py-4"
>
    <div class="flex-center gap-1">
        <button onclick={() => sidebarVisible.update((visible: boolean) => !visible)}>
            <img class="aspect-1 h-10" src="/icons/navigation/Hamburger.svg" alt="Sidebar toggle" />
        </button>
    </div>

    <div class="w-72">
        <input
            class="primary w-full"
            type="text"
            placeholder="Search"
            oninput={search}
            onfocus={() => {
                searching = true;
            }}
            onblur={() => {
                searching = false;
            }}
        />
    </div>

    <div>
        <img
            class="aspect-1 h-10 rounded-full border border-primary"
            src={user.image}
            alt={user.name}
        />
    </div>

    <div
        class="x-center primary top-full w-96 rounded-lg border border-primary"
        style:display={searching ? "block" : "none"}
    >
        <div class="p-4">
            {#each searchResults as result}
                <div>
                    <p>{result.name}</p>
                </div>
            {/each}
        </div>
    </div>
</header>
