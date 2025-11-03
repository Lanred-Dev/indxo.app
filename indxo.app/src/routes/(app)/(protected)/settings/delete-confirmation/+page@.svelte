<script lang="ts">
    import { enhance } from "$app/forms";
</script>

<svelte:head>
    <title>Delete Account</title>
</svelte:head>

<div class="cover-screen flex-center page-title mb-0 flex-col gap-6">
    <div class="text-center">
        <h1 class="title">Are you sure you want to delete your account?</h1>
        <p class="description">This action is irreversible.</p>
    </div>

    <div class="row w-fit text-xl">
        <form method="POST" use:enhance>
            <button class="button-attention clay-alert">Yes, delete my account</button>
        </form>

        <a href="/settings" class="button-primary">No, take me back</a>
    </div>
</div>
