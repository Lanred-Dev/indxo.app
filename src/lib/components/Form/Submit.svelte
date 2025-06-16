<script lang="ts">
    import { getContext, type Snippet } from "svelte";
    import Loader from "../Loader.svelte";
    import { formContextKey, type FormContext } from ".";

    let { children }: { children: Snippet<[]> } = $props();

    const formContext: FormContext = getContext(formContextKey);
</script>

<button type="submit" class="button-attention w-full" disabled={formContext().submitting}>
    {#if formContext().submitting}
        <Loader size={1.75} color="black" />
    {:else}
        {@render children()}
    {/if}
</button>
