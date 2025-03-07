<script lang="ts">
    import { Form, FormSubmit, FormRow, FormInput } from "$lib/components/Form";
    import determineWording from "$lib/utils/determineWording";
    import { formatDistanceToNow } from "date-fns";

    let { data } = $props();

    let lastUpdated: number | null = $state(null);

    /**
     * This function is called after the form is submitted. It sets the last updated time so that the user knows when the set was last updated.
     *
     * @param success If submission was successful
     * @returns never
     */
    function afterSubmit(success: boolean) {
        if (!success) {
            return location.reload();
        }

        lastUpdated = Date.now();
    }
</script>

<Form classes="w-full" action="/api/documents/set/{data._id}/update" {afterSubmit}>
    <div class="flex items-center justify-between">
        <a class="primary" href="/set/{data._id}">Back to {determineWording("set")}</a>

        <div class="flex-center gap-3">
            {#if lastUpdated}
                <p class="text-light text-nowrap">
                    Last updated {formatDistanceToNow(lastUpdated, {
                        includeSeconds: true,
                        addSuffix: true,
                    })}
                </p>
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
                    placeholder: data.isPublic,
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
            items: data.terms.map((term) => [
                {
                    id: "term",
                    type: "input",
                    value: term.term,
                    placeholder: "Term",
                },
                {
                    id: "definition",
                    type: "textarea",
                    value: term.definition,
                    placeholder: "Definition",
                },
            ]),
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
