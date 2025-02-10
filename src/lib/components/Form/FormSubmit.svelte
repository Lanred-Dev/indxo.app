<script lang="ts">
    import { onMount } from "svelte";

    let { text }: { text: string } = $props();
    let submitting: boolean = $state(false);
    let button: HTMLButtonElement;
    let form: HTMLFormElement;

    onMount(() => {
        form = button.closest("form")!;

        const observer: MutationObserver = new MutationObserver((mutationList) => {
            mutationList.forEach((mutation) => {
                if (
                    mutation.type === "attributes" &&
                    mutation.attributeName === "data-submitting"
                ) {
                    submitting = form.getAttribute("data-submitting") === "true";
                }
            });
        });

        observer.observe(form, { attributes: true, attributeFilter: ["data-submitting"] });

        return () => {
            observer.disconnect();
        };
    });
</script>

<button type="submit" class="primary w-full" bind:this={button}>
    {#if submitting}
        ...
    {:else}
        {@html text}
    {/if}
</button>
