<script lang="ts">
    import SimplePage from "$lib/components/SimplePage.svelte";
    import { signIn } from "@auth/sveltekit/client";
</script>

{#snippet provider(text: string, icon: string, providerID: string)}
    <li>
        <button class="primary-dark w-full" onclick={() => signIn(providerID)}>
            <img class={providerID === "github" ? "dark:invert" : ""} src={icon} alt={text} />
            {text}
        </button>
    </li>
{/snippet}

<SimplePage
    title="Study at your full potential."
    text="Sign in with your preferred provider and get started."
>
    <ul class="space-y-3">
        {@render provider("Sign in with Google", "/icons/Google.svg", "google")}
    </ul>
</SimplePage>
