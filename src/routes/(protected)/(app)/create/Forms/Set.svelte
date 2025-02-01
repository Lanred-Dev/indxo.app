<script lang="ts">
    import { FormRow, FormInput } from "$lib/components/Form";

    let { stage }: { stage: "creation" | "setup" } = $props();
</script>

{#if stage === "creation"}
    <FormRow>
        <FormInput id="isPublic" label="Public" type="checkbox" placeholder={true} />
        <FormInput id="name" label="Name" type="text" placeholder="Awesome Study Set v2" />
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
    aa
{/if}
