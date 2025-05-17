<script lang="ts">
    import { Form, FormRow, FormInput } from "$lib/components/Form";
    import determineWording from "$lib/utils/determineWording";
    import EditHeader from "../../../EditHeader.svelte";

    let { data } = $props();

    let updated: number | null = $state.raw(null);

    /**
     * This function is called after the form is submitted. It sets the last updated time so that the user knows when the set was last updated.
     *
     * @param status The status code of the response
     * @returns never
     */
    function afterSubmit(status: number) {
        if (status !== 204) return location.reload();

        updated = Date.now();
    }
</script>

<Form
    classes="w-full"
    method="PUT"
    endpoint="/api/documents/set/{data.set._id}/update"
    {afterSubmit}
>
    <EditHeader type="set" document={data.set} {updated} />

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
