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
        value = $bindable(),
        placeholder = "/icons/general/Image.svg",
        imageProperties = {},
        onUpload = upload,
        onDelete = deleteImage,
        class: className,
        ...properties
    }: {
        buttons?: ComponentProps<typeof ActionButton>[];
        value?: string | null;
        placeholder?: string;
        imageProperties?: Record<string, any>;
        onUpload?: (file: File) => Promise<void>;
        onDelete?: (name: string) => Promise<void>;
        class: ClassValue;
        [key: string]: unknown;
    } = $props();

    let imageServerFilename: string | null = null;
    let actualValue: string = $state.raw("");
    let uploadError: string = $state.raw("");
    let isUploadErrorVisible: boolean = $state.raw(false);
    let fileInput: HTMLInputElement;

    async function deleteImage(name: string) {
        try {
            const response = await fetch(`${PUBLIC_IMAGE_SERVER_URL}/delete/${name}`, {
                method: "DELETE",
                credentials: "include",
            });

            // Force an error to be shown to the user
            if (response.status !== ResponseCodes.Success) throw new Error();

            value = null;
            actualValue = "";
            imageServerFilename = null;
        } catch {
            uploadError = "An unknown error occurred when deleting your image.";
            isUploadErrorVisible = true;
        }
    }

    async function upload(file: File) {
        // Delete the previous image if there was one
        if (value && value.startsWith(PUBLIC_IMAGE_SERVER_URL) && imageServerFilename)
            await deleteImage(imageServerFilename);

        const data = new FormData();
        data.append("file", file);

        const response = await fetch(`${PUBLIC_IMAGE_SERVER_URL}/upload`, {
            method: "POST",
            body: data,
            credentials: "include",
        });

        if (response.status !== ResponseCodes.Success) {
            switch (response.status) {
                case ResponseCodes.InvalidMediaType:
                case ResponseCodes.ContentTooLarge:
                case ResponseCodes.BadRequest:
                    uploadError = (await response.json()).message;
                    break;
                default:
                    uploadError = "An unknown error occurred when uploading your image.";
            }

            value = null;
            actualValue = "";
            isUploadErrorVisible = true;
            return;
        }

        imageServerFilename = await response.text();
        value = `${PUBLIC_IMAGE_SERVER_URL}/get/${imageServerFilename}`;
    }
</script>

<Tooltip bind:isVisible={isUploadErrorVisible} duration={5}>
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

<div class={["group rounded-input bg-input relative", className]} {...properties}>
    <Dialog>
        {#if value}
            <div
                class="absolute top-2 right-2 flex translate-y-2 gap-2 opacity-0 transition-[translate,opacity] group-hover:translate-y-0 group-hover:opacity-100"
            >
                <DialogTrigger>
                    <img class="size-8" src="/icons/general/Expand.svg" alt="Expand" />
                </DialogTrigger>

                <button onclick={() => onDelete(imageServerFilename!)} type="button">
                    <img class="size-8" src="/icons/general/Trash.svg" alt="Delete" />
                </button>
            </div>
        {/if}

        <DialogContent class="min-h-30! rounded-none! p-0">
            <DialogTrigger
                class="button-primary absolute top-3 right-3 rounded-full p-1.5! shadow-md"
            >
                <img class="size-8" src="/icons/general/X.svg" alt="Close" />
            </DialogTrigger>

            <img class="h-[200%] max-h-[80vh] w-auto max-w-[80vw]" src={value} alt="Expanded" />
        </DialogContent>
    </Dialog>

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

                onUpload(file);
            }}
        />
    </button>
</div>
