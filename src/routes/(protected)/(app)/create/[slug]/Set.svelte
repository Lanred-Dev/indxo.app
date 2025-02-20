<script lang="ts">
    import { FormRow, FormInput } from "$lib/components/Form";

    let { stage }: { stage: "creation" | "setup" } = $props();
</script>

{#if stage === "creation"}
    <FormRow>
        <FormInput
            id="isPublic"
            label="Visiblity"
            type="checkbox"
            placeholder={true}
            checkboxText={["Public", "Private"]}
            checkboxIcons={["/icons/general/Web.svg", "/icons/general/Lock.svg"]}
        />
        <FormInput id="name" label="Name" type="text" placeholder="Yapping 101 final exam..." />
        <FormInput id="subject" label="Subject" type="text" placeholder="Math, English, ..." />
    </FormRow>

    <FormInput
        id="description"
        label="What is this study set for?"
        type="textarea"
        placeholder="This study set is for my final exam..."
        classes="h-40"
    />
{:else}
    <FormInput id="terms" type="editableList" />
{/if}
