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
            class="relative flex h-full w-full flex-col items-start justify-start overflow-y-auto overflow-x-hidden px-36 pb-6 pt-24 lg:px-52"
        >
            {@render children?.()}
        </main>
    </div>
</div>
