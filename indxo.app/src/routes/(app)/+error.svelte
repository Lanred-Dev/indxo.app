<script lang="ts">
    import { page } from "$app/state";
    import { DialogContent, DialogContentHeader, DialogTrigger } from "$lib/components/Dialog";
    import Dialog from "$lib/components/Dialog/Dialog.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import { ResponseCodes } from "$lib/utils/apiResponses";

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
            title: "Login Required 🔒",
            message:
                "You need to sign in to access this area. Show your credentials to get past the door.",
        },
        [ResponseCodes.UserUnauthorized]: {
            title: "Whoa there, Scholar!",
            message: "Access denied. Maybe the answer lies elsewhere?",
        },
    };

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
    <a
        class="text-light font-semibold"
        style:font-family="GoogleSansCode, monospace;"
        href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/{page.status}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Learn more about HTTP status code {page.status}"
    >
        [{page.status}]
    </a>

    <h1 class="title">
        {title}
    </h1>

    <p class="description">{message}</p>
</div>

<Dialog>
    <DialogContent>
        <DialogContentHeader title={page.status.toString()} includeCloseButton={true} />

        <p class="text-lg">
            {page.error && page.error.message && page.error.message.length > 0
                ? page.error.message
                : "no additional information provided"}
        </p>

        <div class="gap-y-0.5 pt-3 text-left">
            <p><span class="font-bold">User Agent:</span> {navigator.userAgent}</p>
            <p><span class="font-bold">Occurred at:</span> {new Date().toISOString()}</p>
            <p><span class="font-bold">URL:</span> {location.href}</p>
        </div>
    </DialogContent>

    <DialogTrigger class="button-attention">
        <Icon icon="general/Expand" />
        View error details
    </DialogTrigger>
</Dialog>
