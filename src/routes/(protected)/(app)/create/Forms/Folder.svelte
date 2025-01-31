<script lang="ts">
    import { Form, FormRow, FormInput, FormSubmit, type props } from "$lib/components/Form";

    let formProps: props = $props();
</script>

<Form {...formProps}>
    <FormRow>
        <FormInput
            id="icon"
            label="Icon"
            type="dropdown"
            options={[
                { value: "Folder", image: "/icons/folder/Folder.svg" },
                { value: "Camera", image: "/icons/folder/Camera.svg" },
                { value: "Briefcase", image: "/icons/folder/Briefcase.svg" },
            ]}
            placeholder="John Doe"
        />
        <FormInput id="name" label="Name" type="text" placeholder="Most awesome name" />
    </FormRow>

    <FormInput
        id="about"
        label="What is this folder for?"
        type="textarea"
        placeholder="Something important..."
        classes="h-40"
    />

    <FormSubmit text="Send" />
</Form>
