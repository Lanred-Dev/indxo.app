<script lang="ts">
    import { goto } from "$app/navigation";
    import type { SessionContext } from "$lib/utils/global";
    import { getContext } from "svelte";

    const session: SessionContext = getContext("session");
</script>

<button
    class="button-attention clay-alert"
    onclick={async () => {
        const response = await fetch(`/api/user/${session.user._id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            alert("Failed to delete account.");
            return;
        }

        goto("/login");
    }}
>
    Delete Account
</button>
