<script lang="ts" module>
    export interface DocumentEditContext {
        [key: string]: any;
        permission: DocumentPermission;
    }
</script>

<script lang="ts">
    import { setContext, type Component } from "svelte";
    import Header from "./Header.svelte";
    import { DocumentType, type DocumentPermission } from "$lib/documents";
    import { FormContent, FormSubmitMethods } from "$lib/components/Form";
    import Form from "$lib/components/Form/Form.svelte";
    import determineDocumentType from "$lib/utils/document/determineType";
    import SetForm from "./Set/Form.svelte";
    import { Tooltip, TooltipContent } from "$lib/components/Tooltip";

    let { data } = $props();

    setContext("documentEdit", {
        ...data.document,
        permission: data.permission,
    } satisfies DocumentEditContext);

    const FormComponent: Component<any> = $derived.by(() => {
        switch (determineDocumentType(data.document._id)) {
            case DocumentType.folder:
                return SetForm;
            default:
                return SetForm;
        }
    });

    let wasSubmitSuccessful: boolean = $state.raw(false);
    let isSubmitMessageVisible: boolean = $state.raw(false);
</script>

<svelte:head>
    <title>Editing {data.document.name}</title>
</svelte:head>

<Tooltip bind:isVisible={isSubmitMessageVisible} duration={5}>
    <TooltipContent class={wasSubmitSuccessful ? "bg-success" : "bg-alert"}>
        {#if wasSubmitSuccessful}
            Changes saved successfully.
        {:else}
            An error occurred while saving your changes.
        {/if}
    </TooltipContent>
</Tooltip>

<Form
    class="w-full"
    method={FormSubmitMethods.put}
    endpoint="/api/documents/{data.document._id}"
    afterSubmit={(result) => {
        wasSubmitSuccessful = result.ok;
        isSubmitMessageVisible = true;
    }}
>
    <Header />

    <FormContent>
        <FormComponent />
    </FormContent>
</Form>
