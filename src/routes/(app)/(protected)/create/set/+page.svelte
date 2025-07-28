<script lang="ts">
    import {
        Form,
        FormContent,
        FormInput,
        FormSubmit,
        FormSubmitMethods,
        FormTitle,
    } from "$lib/components/Form";
    import { goto } from "$app/navigation";
    import { ResponseCodes } from "$lib/utils/apiResponses";
    import { Wording } from "$lib/utils/wording";
    import Arrow, { ArrowState } from "$lib/components/Icons/Arrow.svelte";
    import Textbox from "$lib/components/Textbox.svelte";
    import {
        DocumentType,
        DocumentVisiblity,
        setFields,
        termFields,
        termPlaceholders,
    } from "$lib/documents";
    import {
        Dropdown,
        DropdownContent,
        DropdownItem,
        DropdownTrigger,
    } from "$lib/components/Dropdown";
    import {
        DefaultEditableListItemButton,
        EditableList,
        EditableListAddItemButton,
        EditableListContent,
        EditableListControls,
        EditableListItem,
    } from "$lib/components/EditableList";
    import generateDocumentID from "$lib/utils/document/generateID";
    import type { ComponentProps } from "svelte";
    import randomArrayEntry from "$lib/utils/randomArrayEntry";
    import { ImageSelector } from "$lib/components/Image";

    enum CreationStage {
        info = "i",
        terms = "t",
        permissions = "p",
    }

    let stage: CreationStage = $state.raw(CreationStage.info);
    let documentID: string = $state.raw("");

    /**
     * This function is called after the form is submitted, it determines what to do next.
     *
     * @param status The status code of the response
     * @param data Meta data from the submission
     * @returns never
     */
    async function afterSubmit(response: Response) {
        if (
            response.status !== ResponseCodes.Success &&
            response.status !== ResponseCodes.SuccessNoResponse
        )
            return location.reload();

        switch (stage) {
            case CreationStage.info:
                stage = CreationStage.terms;
                documentID = await response.json();
                break;
            case CreationStage.terms:
                stage = CreationStage.permissions;
                break;
            case CreationStage.permissions:
                goto(`/${documentID}`);
                break;
        }
    }
</script>

<svelte:head>
    <title>Create a {Wording.set}</title>
</svelte:head>

<Form
    class="w-full"
    method={stage === CreationStage.info ? FormSubmitMethods.post : FormSubmitMethods.put}
    endpoint={stage === CreationStage.info
        ? `/api/documents/create/${DocumentType.set}`
        : `/api/documents/${documentID}`}
    {stage}
    {afterSubmit}
>
    <FormTitle
        titles={{
            [CreationStage.info]: {
                title: `Lets create a ${Wording.set}!`,
                description: "Get started by entering the basics below.",
            },
            [CreationStage.terms]: {
                title: `What ${Wording.terms} will you study?`,
                description: `Enter the ${Wording.terms} you want to study in your ${Wording.set}.`,
            },
            [CreationStage.permissions]: {
                title: "Share the responsibility.",
                description: `Choose who can do what with your ${Wording.set}.`,
            },
        }}
    />

    <FormContent>
        {#if stage === CreationStage.info}
            <div class="row">
                <FormInput
                    id="visiblity"
                    label="Visiblity"
                    Component={Dropdown}
                    isRequired={setFields.visiblity.properties.isRequired}
                    value={setFields.visiblity.properties.defaultValue}
                >
                    <DropdownTrigger />

                    <DropdownContent>
                        <DropdownItem value={DocumentVisiblity.public}>
                            <img src="/icons/general/Web.svg" alt="Public" />
                            Public
                        </DropdownItem>
                        <DropdownItem value={DocumentVisiblity.private}>
                            <img src="/icons/general/Lock.svg" alt="Public" />
                            Private
                        </DropdownItem>
                        <DropdownItem value={DocumentVisiblity.link}>
                            <img src="/icons/general/Link.svg" alt="Public" />
                            Link
                        </DropdownItem>
                    </DropdownContent>
                </FormInput>

                <FormInput
                    id="name"
                    label="Name"
                    class="grow"
                    Component={Textbox}
                    isRequired={setFields.name.properties.isRequired}
                    properties={{
                        placeholder: "Things My Brain Keeps Forgetting",
                        maxlength: setFields.name.properties.maxlength,
                    }}
                />

                <FormInput
                    id="subject"
                    label="Subject"
                    class="grow"
                    Component={Textbox}
                    isRequired={setFields.subject.properties.isRequired}
                    properties={{
                        placeholder: "Magical Math",
                        maxlength: setFields.subject.properties.maxlength,
                    }}
                />
            </div>

            <FormInput
                id="description"
                label="What is this study set for?"
                class="w-full"
                Component={Textbox}
                isRequired={setFields.description.properties.isRequired}
                properties={{
                    placeholder: "A wild collection of terms I *swear* I studied",
                    maxlength: setFields.description.properties.maxlength,
                    multiline: true,
                }}
            />
        {:else if stage === CreationStage.terms}
            <FormInput
                id="terms"
                Component={EditableList}
                value={[]}
                properties={{
                    placeholderItems: 3,
                    buttons: [
                        DefaultEditableListItemButton.moveUp,
                        DefaultEditableListItemButton.moveDown,
                        DefaultEditableListItemButton.delete,
                    ],
                    addItem: (index) => {
                        const placeholders: { term: string; definition: string } =
                            randomArrayEntry(termPlaceholders);

                        return {
                            index,
                            _id: generateDocumentID(5, DocumentType.term),
                            fields: [
                                {
                                    _id: "term",
                                    Component: Textbox,
                                    properties: {
                                        placeholder: placeholders.term,
                                        maxlength: termFields.term.properties.maxlength,
                                    },
                                    position: { group: 0, index: 0 },
                                },
                                {
                                    _id: "definition",
                                    Component: Textbox,
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
                    <EditableListAddItemButton>Add term</EditableListAddItemButton>
                </EditableListControls>
            </FormInput>
        {/if}
    </FormContent>

    <FormSubmit>
        {#if stage == CreationStage.permissions}
            Create
        {:else}
            Next <Arrow class="size-4" state={ArrowState.right} />
        {/if}
    </FormSubmit>
</Form>
