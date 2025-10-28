<script lang="ts">
    import { getContext, type Snippet } from "svelte";
    import Loader from "../Icons/Loader.svelte";
    import { formContextKey, type FormContext } from ".";
    import type { ClassValue } from "svelte/elements";

    let {
        class: className,
        children,
        ...properties
    }: { children: Snippet<[]>; class?: ClassValue; [key: string]: unknown } = $props();

    const form: FormContext = getContext(formContextKey);
</script>

<button
    type="submit"
    class={["button-attention w-full", className]}
    disabled={form.isSubmitting}
    {...properties}
>
    {#if form.isSubmitting}
        <Loader size={1.75} color="black" />
    {:else}
        {@render children()}
    {/if}
</button>
