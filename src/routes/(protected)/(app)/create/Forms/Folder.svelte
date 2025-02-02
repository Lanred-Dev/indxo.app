<script lang="ts">
    import { FormRow, FormInput } from "$lib/components/Form";

    let { stage }: { stage: "creation" | "setup" } = $props();
</script>

{#if stage === "creation"}
    <FormRow>
        <FormInput id="isPublic" label="Public" type="checkbox" placeholder={true} />
        <FormInput
            id="icon"
            label="Icon"
            type="dropdown"
            options={[
                { value: "/icons/folder/Folder.svg", image: "/icons/folder/Folder.svg" },
                { value: "/icons/folder/Camera.svg", image: "/icons/folder/Camera.svg" },
                { value: "/icons/folder/Briefcase.svg", image: "/icons/folder/Briefcase.svg" },
            ]}
            placeholder={{ value: "/icons/folder/Folder.svg", image: "/icons/folder/Folder.svg" }}
        />
        <FormInput id="name" label="Name" type="text" placeholder="AP Lit Exam" />
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
