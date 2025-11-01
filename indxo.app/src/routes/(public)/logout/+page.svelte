<svelte:head>
    <title>Logout</title>
</svelte:head>

<div class="cover-screen flex-center page-title mb-0 flex-col gap-6">
    <h1 class="title">Are you sure you want to logout?</h1>

    <div class="row w-fit text-xl">
        <a class="button-attention clay-alert" href="/api/auth/logout" data-sveltekit-reload
            >Yes, logout</a
        >
        <a href="/" class="button-primary">No, take me back</a>
    </div>
</div>
