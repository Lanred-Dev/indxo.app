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

<Form classes="w-full" method="PUT" endpoint="/api/documents/set/{data._id}/update" {afterSubmit}>
    <div class="flex items-center justify-between">
        <a class="button-primary" href="/set/{data._id}">Back to {determineWording("set")}</a>

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
                id="name"
                label="Name"
                type="text"
                componentProps={{ value: data.name, placeholder: "Yapping 101 final exam..." }}
            />

            <FormInput
                id="subject"
                label="Subject"
                type="text"
                componentProps={{ value: data.subject, placeholder: "Math, English, ..." }}
            />
        </FormRow>

        <FormInput
            id="description"
            label="What is this study set for?"
            type="textarea"
            classes="h-40"
            componentProps={{
                value: data.description,
                placeholder: "This study set is for my final exam...",
            }}
        />
    </div>

    <FormInput
        id="terms"
        type="editableList"
        componentProps={{
            addText: `Add ${determineWording("card")}`,
            startingItems: 3,
            isDraggable: true,
            items: data.terms.map(({ _id, term, definition }) => ({
                _id,
                properties: [
                    {
                        id: "term",
                        type: "input",
                        value: term,
                        placeholder: "Term",
                    },
                    {
                        id: "definition",
                        type: "textarea",
                        value: definition,
                        placeholder: "Definition",
                    },
                ],
            })),
            properties: [
                {
                    id: "term",
                    type: "input",
                    placeholder: "Term",
                },
                {
                    id: "definition",
                    type: "textarea",
                    placeholder: "Definition",
                },
            ],
        }}
    />
</Form>
