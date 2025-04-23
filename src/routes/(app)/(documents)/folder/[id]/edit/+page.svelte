<script lang="ts">
    import { Form, FormSubmit, FormRow, FormInput } from "$lib/components/Form";
    import determineWording from "$lib/utils/determineWording";
    import { formatDistanceToNow } from "date-fns";
    import { onMount } from "svelte";

    let { data } = $props();

    let updated: number | null = null;
    let updatedText: string = $state.raw("");

    /**
     * This function is called after the form is submitted. It sets the last updated time so that the user knows when the set was last updated.
     *
     * @param status The status code of the response
     * @returns never
     */
    function afterSubmit(status: number) {
        if (status !== 204) return location.reload();

        updated = Date.now();
        updateLastUpdatedText();
    }

    /**
     * This function updates the last updated text.
     *
     * NOTE: It is called every 5 seconds to update the text to show how long ago the set was last updated.
     *
     * @returns never
     */
    function updateLastUpdatedText() {
        if (updated === null) return;

        updatedText = formatDistanceToNow(updated, {
            includeSeconds: true,
            addSuffix: true,
        });
    }

    onMount(() => {
        const updateTextInterval = setInterval(updateLastUpdatedText, 5000);

        return () => clearInterval(updateTextInterval);
    });
</script>

<svelte:head>
    <title>Edit {data.name}</title>
</svelte:head>

<Form
    classes="w-full"
    method="PUT"
    endpoint="/api/documents/folder/{data._id}/update"
    {afterSubmit}
>
    <div class="flex items-center justify-between">
        <a class="button-primary" href="/folder/{data._id}">Back to {determineWording("folder")}</a>

        <div class="flex-center gap-3">
            {#if updatedText.length > 0}
                <p class="text-light text-nowrap">Last updated {updatedText}</p>
            {/if}

            <FormSubmit text="Update" />
        </div>
    </div>

    <div class="space-y-5 py-12">
        <FormRow>
            <FormInput
                id="isPublic"
                label="Visiblity"
                type="checkbox"
                componentProps={{
                    value: data.isPublic,
                    text: ["Public", "Private"],
                    icons: ["/icons/general/Web.svg", "/icons/general/Lock.svg"],
                }}
            />

            <FormInput
                id="icon"
                label="Icon"
                type="dropdown"
                componentProps={{
                    value: data.icon,
                    items: [
                        {
                            value: "/icons/folder/Folder.svg",
                            image: "/icons/folder/Folder.svg",
                            text: "Folder",
                        },
                        {
                            value: "/icons/folder/Camera.svg",
                            image: "/icons/folder/Camera.svg",
                            text: "Camera",
                        },
                        {
                            value: "/icons/folder/Briefcase.svg",
                            image: "/icons/folder/Briefcase.svg",
                            text: "Briefcase",
                        },
                    ],
                }}
            />

            <FormInput
                id="name"
                label="Name"
                type="text"
                componentProps={{ value: data.name, placeholder: "AP Lit Exam" }}
            />
        </FormRow>

        <FormInput
            id="description"
            label="What is this folder for?"
            type="textarea"
            classes="h-40"
            componentProps={{
                value: data.description,
                placeholder: "This folder contains all my study sets for...",
            }}
        />
    </div>
</Form>
