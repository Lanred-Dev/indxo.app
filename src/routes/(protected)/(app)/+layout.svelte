<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import Header from "./Header.svelte";
    import Sidebar from "./Sidebar.svelte";
    import type { Snippet } from "svelte";
    import type { Session, User } from "@auth/sveltekit";

    let { data, children }: { data: { session: Session }; children: Snippet<[]> } = $props();

    const sidebarVisible: Writable<boolean> = writable(true);
</script>

<div class="flex h-screen w-full flex-col">
    <Header user={data.session.user as User} {sidebarVisible} />

    <div class="flex w-full flex-grow overflow-hidden">
        <Sidebar visible={sidebarVisible} />

        <main
            class="relative flex h-full w-full flex-col items-start justify-start overflow-y-auto overflow-x-hidden px-4 pb-6 pt-4 sm:px-14 sm:pt-12 md:px-36 md:pt-16 lg:px-52 lg:pt-24"
        >
            {@render children?.()}
        </main>
    </div>
</div>
