<script lang="ts">
    import { signIn } from "@auth/sveltekit/client";
</script>

{#snippet provider(text: string, icon: string, providerID: string)}
    <li>
        <button class="w-full" onclick={() => signIn(providerID)}>
            <img class={providerID === "github" ? "dark:invert" : ""} src={icon} alt={text} />
            {text}
        </button>
    </li>
{/snippet}

<ul class="space-y-3">
    {@render provider("Sign in with Google", "/icons/Google.svg", "google")}
</ul>
