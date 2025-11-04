<script lang="ts">
    import { enhance } from "$app/forms";
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>

<div class="cover-screen flex-center page-title mb-0 flex-col gap-6">
    <div>
        <h1 class="title justify-center">Welcome to indxo.app</h1>
        <p class="description">A completely free, open-source platform for studying.</p>
    </div>

    <div class="row w-fit text-xl">
        <form method="POST" use:enhance>
            <button class="button-primary">
                <img class="size-7" src="/icons/Google.svg" alt="Google" />
                Login with Google
            </button>
        </form>
    </div>
</div>

<p class="text-light x-center absolute bottom-12">© 2025 Landon Redmond</p>
