<script lang="ts">
    import { getContext, type Snippet } from "svelte";
    import Loader from "../Loader.svelte";
    import { formContextKey, type FormContext } from ".";

    let { children }: { children: Snippet<[]> } = $props();

    const form: FormContext = getContext(formContextKey);
</script>

<button type="submit" class="button-attention mt-5 w-full" disabled={form.isSubmitting}>
    {#if form.isSubmitting}
        <Loader size={1.75} color="black" />
    {:else}
        {@render children()}
    {/if}
</button>
