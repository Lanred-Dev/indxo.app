<script lang="ts">
    import { getContext, type ComponentProps } from "svelte";
    import {
        DocumentPermission,
        DocumentType,
        termFields,
        termPlaceholders,
        type Term,
    } from "$lib/documents";
    import TermCard from "../TermCard.svelte";
    import { Wording } from "$lib/utils/wording";
    import type { DocumentContext } from "../../+page.svelte";
    import permissionIsEqual from "$lib/utils/document/permissionIsEqual";
    import {
        DefaultEditableListItemButton,
        EditableList,
        EditableListAddItemButton,
        EditableListContent,
        EditableListControls,
        EditableListItem,
    } from "$lib/components/EditableList";
    import { FormContent, FormInput, FormSubmit, FormSubmitMethods } from "$lib/components/Form";
    import Form from "$lib/components/Form/Form.svelte";
    import generateDocumentID from "$lib/utils/document/generateID";
    import randomArrayEntry from "$lib/utils/randomArrayEntry";
    import Textbox from "$lib/components/Textbox.svelte";
    import { ImageSelector } from "$lib/components/Image";

    const document: DocumentContext = getContext("document");
    let areChangesMade: boolean = $state.raw(false);
    let termsValue: Term[] = $state(document.terms);
    let savedTermsValue: Term[] | null = $state.raw(null);

    function updateSavedValue() {
        savedTermsValue = JSON.parse(JSON.stringify(termsValue.filter((term) => term !== null)));
        document.terms = savedTermsValue;
    }

    $effect(() => {
        if (savedTermsValue === null) updateSavedValue();

        areChangesMade = JSON.stringify(termsValue) !== JSON.stringify(savedTermsValue);
    });
</script>

<div class="list-primary mt-16">
    <p class="list-title">{Wording.cards}</p>

    {#if permissionIsEqual(document.permission, DocumentPermission.edit)}
        <Form
            class="w-full"
            method={FormSubmitMethods.put}
            endpoint="/api/documents/{document._id}"
            afterSubmit={updateSavedValue}
        >
            <FormContent>
                <FormInput
                    id="terms"
                    Component={EditableList}
                    bind:value={termsValue}
                    properties={{
                        placeholderItems: 3,
                        buttons: [
                            DefaultEditableListItemButton.moveUp,
                            DefaultEditableListItemButton.moveDown,
                            DefaultEditableListItemButton.delete,
                        ],
                        addItem: (index, value) => {
                            const placeholders: { term: string; definition: string } =
                                randomArrayEntry(termPlaceholders);

                            return {
                                index,
                                _id:
                                    (value?.id as string) ??
                                    generateDocumentID(5, DocumentType.term),
                                fields: [
                                    {
                                        _id: "term",
                                        Component: Textbox,
                                        value: value?.term,
                                        properties: {
                                            placeholder: placeholders.term,
                                            maxlength: termFields.term.properties.maxlength,
                                        },
                                        position: { group: 0, index: 0 },
                                    },
                                    {
                                        _id: "definition",
                                        Component: Textbox,
                                        value: value?.definition,
                                        properties: {
                                            class: "w-full",
                                            placeholder: placeholders.definition,
                                            maxlength: termFields.definition.properties.maxlength,
                                            multiline: true,
                                        },
                                        position: { group: 1, index: 0 },
                                    },
                                    {
                                        _id: "image",
                                        Component: ImageSelector,
                                        value: value?.image,
                                        properties: {
                                            class: "min-w-fit",
                                            imageProperties: {
                                                class: "size-40 rounded-input object-contain",
                                            },
                                        },
                                        position: { group: 1, index: 1 },
                                    },
                                ],
                                isDraggable: true,
                            } satisfies ComponentProps<typeof EditableListItem>;
                        },
                    }}
                >
                    <EditableListContent />

                    <EditableListControls>
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
                    </EditableListControls>
                </FormInput>
            </FormContent>
        </Form>
    {:else}
        <ol class="flex flex-col gap-4">
            {#each document.terms as term, index}
                <TermCard {...term} {index} />
            {/each}
        </ol>
    {/if}
</div>
