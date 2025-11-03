<script lang="ts">
    import { goto } from "$app/navigation";

    let { data } = $props();
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
        <button
            class="button-attention clay-alert"
            onclick={async () => {
                const response = await fetch(`/api/user/${data.user._id}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    alert("Failed to delete account.");
                    return;
                }

                goto("/login");
            }}>Yes, delete my account</button
        >

        <a href="/settings" class="button-primary">No, take me back</a>
    </div>
</div>
