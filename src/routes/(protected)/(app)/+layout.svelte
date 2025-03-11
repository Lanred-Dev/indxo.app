<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import Header from "./Header.svelte";
    import Sidebar from "./Sidebar.svelte";
    import type { Snippet } from "svelte";
    import type { Session, User } from "@auth/sveltekit";

    let { data, children }: { data: { session: Session }; children: Snippet<[]> } = $props();

    const sidebarVisible: Writable<boolean> = writable(true);
    const mobileSidebarVisible: Writable<boolean> = writable(false);
</script>

<div class="flex h-screen max-h-screen w-full flex-col overflow-hidden">
    <Header user={data.session.user as User} {sidebarVisible} {mobileSidebarVisible} />

    <div class="flex max-h-full w-full flex-grow overflow-hidden">
        <Sidebar visible={sidebarVisible} mobileVisible={mobileSidebarVisible} />

        <main
            class="md:px-18 relative flex h-full w-full flex-col items-start justify-start overflow-y-auto overflow-x-hidden px-7 pb-6 pt-12 md:pl-[10%] md:pr-[22.5%] md:pt-16 lg:pt-24"
        >
            {@render children?.()}
        </main>
    </div>
</div>
