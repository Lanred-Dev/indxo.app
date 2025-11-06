<script lang="ts">
    import { enhance } from "$app/forms";
</script>

<svelte:head>
    <title>Logout</title>
</svelte:head>

<div class="cover-screen flex-center page-title mb-0 flex-col gap-6">
    <h1 class="title text-center">Are you sure you want to logout?</h1>

    <div class="row justify-center text-xl">
        <form method="POST" use:enhance>
            <button class="button-attention clay-alert">Yes, logout</button>
        </form>

        <a href="/" class="button-primary">No, take me back</a>
    </div>
</div>
