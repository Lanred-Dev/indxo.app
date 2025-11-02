<script lang="ts">
    import { type ComponentProps, type Snippet } from "svelte";
    import { DocumentType, termFields, termPlaceholders, type Term } from "$lib/documents";
    import {
        DefaultEditableListItemButton,
        EditableList,
        EditableListAddItemButton,
        EditableListContent,
        EditableListControls,
        EditableListItem,
    } from "$lib/components/Lists/Editable";
    import { FormInput } from "$lib/components/Form";
    import generateDocumentID from "$lib/utils/document/generateID";
    import randomArrayEntry from "$lib/utils/randomArrayEntry";
    import Textbox from "$lib/components/Textbox.svelte";
    import { ImageSelector } from "$lib/components/Image";

    let {
        value = $bindable([]),
        children = controls,
    }: {
        value: Term[];
        children?: Snippet<[]>;
    } = $props();
</script>

{#snippet controls()}
    <EditableListAddItemButton>Add term</EditableListAddItemButton>
{/snippet}

<FormInput
    id="terms"
    Component={EditableList}
    bind:value
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
                            class: "min-w-fit size-40",
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
        {@render children()}
    </EditableListControls>
</FormInput>
