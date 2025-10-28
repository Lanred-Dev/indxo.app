<script lang="ts" module>
    export interface DocumentContext {
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

    let { data } = $props();

    setContext("document", {
        ...data.document,
        permission: data.permission,
    } satisfies DocumentContext);

    const FormComponent: Component<any> = $derived.by(() => {
        switch (determineDocumentType(data.document._id)) {
            case DocumentType.folder:
                return SetForm;
            default:
                return SetForm;
        }
    });
</script>

<svelte:head>
    <title>Editing {data.document.name}</title>
</svelte:head>

<Form class="w-full" method={FormSubmitMethods.put} endpoint="/api/documents/{data.document._id}">
    <Header />

    <FormContent>
        <FormComponent />
    </FormContent>
</Form>
