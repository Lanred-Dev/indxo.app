<script lang="ts" module>
    export interface DocumentEditContext {
        [key: string]: any;
        permission: DocumentPermission;
    }
</script>

<script lang="ts">
    import { setContext, type Component } from "svelte";
    import Header from "./Header.svelte";
    import { DocumentPermission, DocumentType } from "$lib/documents";
    import { FormContent, FormSubmitMethods } from "$lib/components/Form";
    import Form from "$lib/components/Form/Form.svelte";
    import determineDocumentType from "$lib/utils/document/determineType";
    import SetForm from "./Set/Form.svelte";
    import { Tooltip, TooltipContent } from "$lib/components/Tooltip";

    let { data } = $props();

    let document: DocumentEditContext = $state({ permission: DocumentPermission.none });

    $effect(() => {
        document = {
            ...data.document,
            permission: data.permission,
        };
    });

    setContext(
        "documentEdit",
        new Proxy({} as DocumentEditContext, {
            get(_, property: string | symbol) {
                if (typeof property === "symbol") return undefined;
                return document[property];
            },
            set(_, property: string | symbol, value: unknown) {
                if (typeof property === "symbol") return true;
                document[property] = value;
                return true;
            },
        })
    );

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
    <title>Edit {data.document.name}</title>
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
