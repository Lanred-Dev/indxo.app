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
    <title>Edit {data.set.name}</title>
</svelte:head>

<Form
    classes="w-full"
    method="PUT"
    endpoint="/api/documents/set/{data.set._id}/update"
    {afterSubmit}
>
    <div class="relative w-full">
        <p class="md:x-center md:y-center mb-3 text-2xl md:mb-0">{data.set.name}</p>

        <div class="flex w-full flex-wrap items-center justify-between gap-5">
            <a class="button-basic" href="/set/{data.set._id}">
                <img src="/icons/general/LeftChevron.svg" alt="Back" />
                Back to {determineWording("set")}
            </a>

            <div class="flex-center gap-3">
                <FormSubmit text="Update" />
            </div>
        </div>

        {#if updatedText.length > 0}
            <p class="text-light mt-1 w-full text-right text-nowrap">Last updated {updatedText}</p>
        {/if}
    </div>

    <div class="space-y-5 py-12">
        <FormRow>
            <FormInput
                id="isPublic"
                label="Visiblity"
                type="checkbox"
                properties={{
                    value: data.set.isPublic,
                    states: {
                        true: {
                            text: "Public",
                            icon: "/icons/general/Web.svg",
                        },
                        false: {
                            text: "Private",
                            icon: "/icons/general/Lock.svg",
                        },
                    },
                }}
            />

            <FormInput
                id="name"
                label="Name"
                type="text"
                properties={{ value: data.set.name, placeholder: "Yapping 101 final exam..." }}
            />

            <FormInput
                id="subject"
                label="Subject"
                type="text"
                properties={{ value: data.set.subject, placeholder: "Math, English, ..." }}
            />
        </FormRow>

        <FormInput
            id="description"
            label="What is this study set for?"
            type="textarea"
            properties={{
                value: data.set.description,
                placeholder: "This study set is for my final exam...",
            }}
        />
    </div>

    <FormInput
        id="terms"
        type="editableList"
        properties={{
            addText: `Add ${determineWording("card")}`,
            startingItems: 3,
            isDraggable: true,
            items: data.set.terms.map(({ _id, term, definition }) => ({
                _id,
                properties: {
                    term,
                    definition,
                },
            })),
            properties: [
                {
                    _id: "term",
                    type: "input",
                    placeholder: "Term",
                },
                {
                    _id: "definition",
                    type: "textarea",
                    placeholder: "Definition",
                },
            ],
        }}
    />
</Form>
