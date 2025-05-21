<script lang="ts">
    import { onMount } from "svelte";
    import Loader from "../Loader.svelte";

    let { text }: { text: string } = $props();

    let submitting: boolean = $state.raw(false);
    let button: HTMLButtonElement;

    onMount(() => {
        const form: HTMLFormElement | null = button.closest("form");

        if (!form) return;

        const observer: MutationObserver = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                submitting = form.getAttribute("data-submitting") === "true";
            });
        });

        observer.observe(form, {
            attributes: true,
            attributeFilter: ["data-submitting"],
        });

        return () => observer.disconnect();
    });
</script>

<button
    type="submit"
    class="button-attention flex-center w-full"
    disabled={submitting}
    bind:this={button}
>
    {#if submitting}
        <Loader size={1.75} color="black" />
    {:else}
        {@html text}
    {/if}
</button>
