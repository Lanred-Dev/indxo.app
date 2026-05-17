<script lang="ts">
    import { enhance } from "$app/forms";
    import Loader from "$lib/components/Icons/Loader.svelte";
    import { Wording } from "$lib/utils/wording";

    let isSubmitting: boolean = $state.raw(false);
</script>

<svelte:head>
    <title>Delete Account</title>
</svelte:head>

<div class="cover-screen flex-center page-title mb-0 flex-col gap-6">
    <div class="text-center md:max-w-1/2">
        <h1 class="title">You're about to delete your account</h1>
        <p class="description">
            This action is irreversible. All data including your {Wording.sets}, {Wording.folders},
            and {Wording.favorites}, and preferences will be permanently removed.
        </p>
    </div>

    <div class="row justify-center text-xl">
        <form method="POST" use:enhance onsubmit={() => (isSubmitting = true)}>
            <button class="button-alert" disabled={isSubmitting}>
                {#if isSubmitting}
                    <Loader size={1.75} color="black" />
                {:else}
                    Yes, delete my account
                {/if}
            </button>
        </form>

        <a href="/settings" class="button-primary">No, take me back</a>
    </div>
</div>
