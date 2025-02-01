<script lang="ts">
    import { FormRow, FormInput } from "$lib/components/Form";

    let { stage }: { stage: "creation" | "setup" } = $props();
</script>

{#if stage === "creation"}
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
        id="description"
        label="What is this folder for?"
        type="textarea"
        placeholder="This folder contains all my study sets for..."
        classes="h-40"
    />
{:else}
    aa
{/if}
