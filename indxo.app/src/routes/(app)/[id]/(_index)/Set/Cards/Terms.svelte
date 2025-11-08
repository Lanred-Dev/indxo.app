<script lang="ts">
    import { getContext } from "svelte";
    import { DocumentPermission, type Term } from "$lib/documents";
    import TermCard from "../TermCard.svelte";
    import { Wording } from "$lib/utils/wording";
    import type { DocumentContext } from "../../+page.svelte";
    import isPermissionEqual from "$lib/utils/document/isPermissionEqual";
    import { FormContent, FormSubmit, FormSubmitMethods } from "$lib/components/Form";
    import Form from "$lib/components/Form/Form.svelte";
    import EditableTerms from "$lib/components/Lists/EditableTerms.svelte";
    import { EditableListAddItemButton } from "$lib/components/Lists/Editable";
    import { SegmentedButton, SegmentedButtonGroup } from "$lib/components/SegmentedButtonGroup";

    enum TermView {
        preview = "Preview",
        editable = "Editable",
    }

    const document: DocumentContext = getContext("document");
    let areChangesMade: boolean = $state.raw(false);
    let termsValue: Term[] = $state(document.terms);
    let savedTermsValue: Term[] | null = $state.raw(null);
    let hasEditPermission: boolean = $derived(
        isPermissionEqual(document.permission, DocumentPermission.edit)
    );
    let currentViewID: TermView = $derived(
        hasEditPermission ? TermView.editable : TermView.preview
    );

    function updateSavedValue() {
        savedTermsValue = JSON.parse(JSON.stringify(termsValue.filter((term) => term !== null)));
        document.terms = savedTermsValue;
    }

    $effect(() => {
        if (savedTermsValue === null) updateSavedValue();

        areChangesMade = JSON.stringify(termsValue) !== JSON.stringify(savedTermsValue);
    });
</script>

<div class="list-primary mt-20">
    <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p class="title mb-0!">{Wording.terms}</p>

        {#if hasEditPermission}
            <SegmentedButtonGroup bind:value={currentViewID} class="w-fit! min-w-fit!">
                {#each Object.values(TermView) as id}
                    <SegmentedButton {id} class="grow-0">{id}</SegmentedButton>
                {/each}
            </SegmentedButtonGroup>
        {/if}
    </div>

    {#if currentViewID === TermView.editable}
        <Form
            class="w-full"
            method={FormSubmitMethods.put}
            endpoint="/api/documents/{document._id}"
            afterSubmit={updateSavedValue}
        >
            <FormContent>
                <EditableTerms bind:value={termsValue}>
                    <EditableListAddItemButton
                        class="transition-[width]"
                        style="width: {areChangesMade ? '50%' : '100%'}"
                        >Add term</EditableListAddItemButton
                    >

                    {#if areChangesMade}
                        <div class="w-1/2">
                            <FormSubmit class="clay-attention-dark">Update</FormSubmit>
                        </div>
                    {/if}
                </EditableTerms>
            </FormContent>
        </Form>
    {:else if currentViewID === TermView.preview}
        <ol class="flex flex-col gap-4">
            {#each document.terms as term, index}
                <TermCard {...term} {index} />
            {/each}
        </ol>
    {/if}
</div>
