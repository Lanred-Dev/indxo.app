<script lang="ts">
    import { page } from "$app/state";
    import Chevron, { ChevronState } from "$lib/components/Icons/Chevron.svelte";
    import { ResponseCodes } from "$lib/utils/apiResponses";
    import { slide } from "svelte/transition";

    const messages: Record<number, { title: string; message: string }> = {
        [ResponseCodes.NotFound]: {
            title: "Nothing to See Here…",
            message: "Except maybe your reflection in the screen.",
        },
        [ResponseCodes.ServerError]: {
            title: "Well, that escalated quickly...",
            message: "Something went kaboom 💥 behind the scenes.",
        },
        [ResponseCodes.Unauthorized]: {
            title: "You're not on the list 📋",
            message: "This area’s VIP only. Flash your login credentials at the door.",
        },
        [ResponseCodes.UserUnauthorized]: {
            title: "Whoa there, Scholar!",
            message: "Access denied. Maybe the answer lies elsewhere?",
        },
    };

    let showErrorDetails: boolean = $state.raw(false);
    let { title, message } = $derived.by(() => {
        return page.status in messages
            ? messages[page.status]
            : {
                  title: "Unexpected Error",
                  message: "Something went wrong, but we're not sure what.",
              };
    });
</script>

<div class="page-title">
    <p class="text-light font-semibold" style:font-family="GoogleSansCode, monospace;">
        [{page.status}]
    </p>

    <h1 class="title">
        {title}
    </h1>

    <p class="description">{message}</p>
</div>

<button
    class="button-attention"
    onclick={() => {
        showErrorDetails = !showErrorDetails;
    }}
>
    <Chevron class="size-6" state={showErrorDetails ? ChevronState.up : ChevronState.down} />
    Show error details
</button>

{#if showErrorDetails}
    <div
        class="mt-5 w-full"
        transition:slide={{ axis: "y", duration: 300 }}
        style:font-family="GoogleSansCode, monospace;"
    >
        <p class="text-2xl">code: {page.status}</p>
        <p class="text-lg">
            message: {page.error && page.error.message && page.error.message.length > 0
                ? page.error.message
                : "no additional information provided"}
        </p>

        <div class="flex flex-col gap-y-0.5 pt-3">
            <p>user agent: {navigator.userAgent}</p>
            <p>occured at: {new Date().toISOString()}</p>
            <p>url: {location.href}</p>
        </div>
    </div>
{/if}
