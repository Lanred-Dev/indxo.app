<script lang="ts">
    import { PUBLIC_IMAGE_SERVER_URL } from "$env/static/public";
    import { ResponseCodes } from "$lib/utils/apiResponses";
    import type { ClassValue } from "svelte/elements";
    import { DialogContent, DialogTrigger } from "../Dialog";
    import Dialog from "../Dialog/Dialog.svelte";
    import { PopupContent, PopupRelativity, PopupXAlignment, PopupYAlignment } from "../Popup";
    import Tooltip from "../Tooltip.svelte";
    import type { ComponentProps } from "svelte";
    import ActionButton from "../ActionButton.svelte";

    let {
        buttons = [],
        value = $bindable(),
        placeholder = "/icons/general/Image.svg",
        imageProperties = {},
        onupload = async (file: File) => {
            // Delete the previous image if there was one
            if (value && value.startsWith(PUBLIC_IMAGE_SERVER_URL)) {
                try {
                    await fetch(`${PUBLIC_IMAGE_SERVER_URL}/delete/${imageServerFilename}`, {
                        method: "DELETE",
                        credentials: "include",
                    });
                } catch {
                    // Ignore errors when deleting the previous image
                }
            }

            const formData = new FormData();
            formData.append("file", file);

            const uploadResponse = await fetch(`${PUBLIC_IMAGE_SERVER_URL}/upload`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            if (uploadResponse.status !== ResponseCodes.Success) {
                switch (uploadResponse.status) {
                    case ResponseCodes.InvalidMediaType:
                    case ResponseCodes.ContentTooLarge:
                    case ResponseCodes.BadRequest:
                        uploadError = (await uploadResponse.json()).message;
                        break;
                    default:
                        uploadError = "An unknown error occurred when uploading your image.";
                }

                value = null;
                actualValue = "";
                uploadErrorVisible = true;
                return;
            }

            imageServerFilename = await uploadResponse.text();
            value = `${PUBLIC_IMAGE_SERVER_URL}/get/${imageServerFilename}`;
        },
        class: className,
        ...properties
    }: {
        buttons?: ComponentProps<typeof ActionButton>[];
        value?: string | null;
        placeholder?: string;
        imageProperties?: Record<string, any>;
        onupload?: (file: File) => Promise<void>;
        class: ClassValue;
        [key: string]: unknown;
    } = $props();

    let imageServerFilename: string | null = null;
    let actualValue: string = $state.raw("");
    let uploadError: string = $state.raw("");
    let uploadErrorVisible: boolean = $state.raw(false);
    let fileInput: HTMLInputElement;
</script>

<Tooltip bind:isVisible={uploadErrorVisible} duration={5}>
    <PopupContent
        class="bg-alert"
        xAlignment={PopupXAlignment.center}
        yAlignment={PopupYAlignment.bottom}
        positionRelativity={PopupRelativity.page}
        offset={15}
    >
        {uploadError}
    </PopupContent>
</Tooltip>

<div class={["group relative", className]} {...properties}>
    <Dialog>
        {#if value}
            <DialogTrigger
                class="absolute top-2 right-2 translate-y-2 opacity-0 transition-[translate,opacity] group-hover:translate-y-0 group-hover:opacity-100"
            >
                <img class="size-8" src="/icons/general/Expand.svg" alt="Expand" />
            </DialogTrigger>
        {/if}

        <DialogContent class="!rounded-none !p-0">
            <DialogTrigger
                class="button-primary absolute top-3 right-3 rounded-full !p-1.5 shadow-md"
            >
                <img class="size-8" src="/icons/general/X.svg" alt="Close" />
            </DialogTrigger>

            <img class="h-[200%] max-h-[80vh] w-auto max-w-[80vw]" src={value} alt="Expanded" />
        </DialogContent>
    </Dialog>

    {#if buttons.length > 0}
        <div class="absolute right-2 bottom-2 flex gap-1">
            {#each buttons as button}
                <ActionButton {...button} />
            {/each}
        </div>
    {/if}

    <button onclick={() => fileInput.click()} type="button">
        <img
            src={value ?? placeholder}
            alt="Selected"
            {...imageProperties}
            style:transform={value ? undefined : "scale(0.3)"}
            style:opacity={value ? undefined : "0.8"}
        />

        <input
            bind:this={fileInput}
            bind:value={actualValue}
            style:display="none"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onchange={(event) => {
                const file = (event.target as HTMLInputElement).files?.[0];

                if (!file) return;

                onupload(file);
            }}
        />
    </button>
</div>
