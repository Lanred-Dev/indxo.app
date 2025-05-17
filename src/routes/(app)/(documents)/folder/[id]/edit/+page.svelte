<script lang="ts">
    import { Form, FormRow, FormInput } from "$lib/components/Form";
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
    endpoint="/api/documents/folder/{data.folder._id}/update"
    {afterSubmit}
>
    <EditHeader type="folder" document={data.folder} {updated} />

    <div class="space-y-5 py-12">
        <FormRow>
            <FormInput
                id="isPublic"
                label="Visiblity"
                type="checkbox"
                properties={{
                    value: data.folder.isPublic,
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
                id="icon"
                label="Icon"
                type="dropdown"
                properties={{
                    value: data.folder.icon,
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
                properties={{ value: data.folder.name, placeholder: "AP Lit Exam" }}
            />
        </FormRow>

        <FormInput
            id="description"
            label="What is this folder for?"
            type="textarea"
            properties={{
                value: data.folder.description,
                placeholder: "This folder contains all my study sets for...",
            }}
        />
    </div>
</Form>
