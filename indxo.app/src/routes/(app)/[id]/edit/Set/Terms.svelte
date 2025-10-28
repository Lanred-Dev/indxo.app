<script lang="ts">
    import { getContext, type ComponentProps } from "svelte";
    import { DocumentType, termFields, termPlaceholders } from "$lib/documents";
    import {
        DefaultEditableListItemButton,
        EditableList,
        EditableListAddItemButton,
        EditableListContent,
        EditableListControls,
        EditableListItem,
    } from "$lib/components/Lists/Editable";
    import { FormContent, FormInput } from "$lib/components/Form";
    import generateDocumentID from "$lib/utils/document/generateID";
    import randomArrayEntry from "$lib/utils/randomArrayEntry";
    import Textbox from "$lib/components/Textbox.svelte";
    import { ImageSelector } from "$lib/components/Image";
    import type { DocumentContext } from "../+page.svelte";

    const document: DocumentContext = getContext("document");
</script>

<FormContent>
    <FormInput
        id="terms"
        Component={EditableList}
        bind:value={document.terms}
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
                    _id: (value?.id as string) ?? generateDocumentID(5, DocumentType.term),
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
            <EditableListAddItemButton class="transition-[width]"
                >Add term</EditableListAddItemButton
            >
        </EditableListControls>
    </FormInput>
</FormContent>
