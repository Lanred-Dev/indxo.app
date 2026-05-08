<script lang="ts">
    import { enhance } from "$app/forms";
    import Icon from "$lib/components/Icon.svelte";
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>

<header class="flex-center x-center fixed top-12 z-40">
    <p class="flex items-center gap-1">
        <img class="size-7" src="/favicon.svg" alt="Logo" />
        <span class="text-xl font-medium">indxo</span>
    </p>
</header>

<div class="cover-screen flex-center page-title mb-0 flex-col gap-6">
    <div class="text-center *:justify-center">
        <h1 class="title">Welcome back 👋</h1>
        <p class="description">Log in to your indxo account</p>
    </div>

    <div class="row w-fit text-xl">
        <form method="POST" use:enhance>
            <button class="button-primary">
                <Icon icon="Google" />
                Continue with Google
            </button>
        </form>
    </div>
</div>

<footer class="x-center absolute bottom-12 space-y-2">
    <ul class="flex-center gap-4">
        <li><a href="/support" class="button-link">Support</a></li>
        <li><a href="/terms" class="button-link">Terms</a></li>
    </ul>

    <p class="text-light">© 2026 Landon Redmond</p>
</footer>
