<script lang="ts">
    import { PUBLIC_IMAGE_SERVER_URL } from "$env/static/public";
    import { ResponseCodes } from "$lib/utils/apiResponses";
    import { PopupContent, PopupRelativity, PopupXAlignment, PopupYAlignment } from "../Popup";
    import Tooltip from "../Tooltip.svelte";

    let {
        value = $bindable(),
        placeholder = "https://placehold.co/200x200.webp",
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
        ...properties
    }: {
        value?: string | null;
        placeholder?: string;
        imageProperties?: Record<string, any>;
        onupload?: (file: File) => Promise<void>;
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

<button {...properties} onclick={() => fileInput.click()} type="button">
    <img src={value ?? placeholder} alt="Selected" {...imageProperties} />

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
