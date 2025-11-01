<script lang="ts">
    import { enhance } from "$app/forms";
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>

<div class="cover-screen flex-center page-title mb-0 flex-col gap-6">
    <h1 class="title">Welcome to indxo.app</h1>

    <div class="row w-fit text-xl">
        <form method="POST" use:enhance>
            <button class="button-primary">
                <img class="size-7" src="/icons/Google.svg" alt="Google" />
                Sign in with Google
            </button>
        </form>
    </div>
</div>
