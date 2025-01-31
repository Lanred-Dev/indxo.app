<script lang="ts">
    import { FormRow, FormInput } from "$lib/components/Form";
</script>

<FormRow>
    <FormInput
        id="icon"
        label="Icon"
        type="dropdown"
        options={[
            { value: "folder", image: "/icons/folder/Folder.svg" },
            { value: "camera", image: "/icons/folder/Camera.svg" },
            { value: "briefcase", image: "/icons/folder/Briefcase.svg" },
        ]}
        placeholder={{ value: "folder", image: "/icons/folder/Folder.svg" }}
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
