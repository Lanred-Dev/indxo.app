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
    import Textbox from "$lib/components/Textbox.svelte";
    import { DocumentType, DocumentVisibility, folderFields } from "$lib/documents";
    import {
        Dropdown,
        DropdownContent,
        DropdownItem,
        DropdownTrigger,
    } from "$lib/components/Dropdown";
    import Icon from "$lib/components/Icon.svelte";

    enum CreationStage {
        info = "i",
        sets = "t",
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
                stage = CreationStage.sets;
                documentID = await response.json();
                break;
            case CreationStage.sets:
                stage = CreationStage.permissions;
                break;
            case CreationStage.permissions:
                goto(`/${documentID}`);
                break;
        }
    }
</script>

<svelte:head>
    <title>Create a {Wording.folder}</title>
</svelte:head>

<Form
    class="w-full"
    method={stage === CreationStage.info ? FormSubmitMethods.post : FormSubmitMethods.put}
    endpoint={stage === CreationStage.info
        ? `/api/documents/create/${DocumentType.folder}`
        : `/api/documents/${documentID}`}
    {stage}
    {afterSubmit}
>
    <FormTitle
        titles={{
            [CreationStage.info]: {
                title: `Lets create a ${Wording.folder}!`,
                description: "Get started by entering the basics below.",
            },
            [CreationStage.sets]: {
                title: `What ${Wording.sets} will you create?`,
                description: `Enter the ${Wording.sets} you want to create in your ${Wording.folder}.`,
            },
            [CreationStage.permissions]: {
                title: "Share the responsibility.",
                description: `Choose who can do what with your ${Wording.folder}.`,
            },
        }}
    />

    <FormContent>
        {#if stage === CreationStage.info}
            <div class="row">
                <FormInput
                    id="visibility"
                    label="Visibility"
                    Component={Dropdown}
                    isRequired={folderFields.visibility.properties.isRequired}
                    value={folderFields.visibility.properties.defaultValue}
                >
                    <DropdownTrigger />

                    <DropdownContent>
                        <DropdownItem value={DocumentVisibility.public}>
                            <Icon icon="general/Web" />
                            Public
                        </DropdownItem>
                        <DropdownItem value={DocumentVisibility.private}>
                            <Icon icon="general/Lock" />
                            Private
                        </DropdownItem>
                        <DropdownItem value={DocumentVisibility.link}>
                            <Icon icon="general/Link" />
                            Link
                        </DropdownItem>
                    </DropdownContent>
                </FormInput>

                <FormInput
                    id="icon"
                    label="Icon"
                    Component={Dropdown}
                    isRequired={folderFields.icon.properties.isRequired}
                    value={folderFields.icon.properties.defaultValue}
                >
                    <DropdownTrigger />

                    <DropdownContent>
                        <DropdownItem value="/folder/Folder">
                            <Icon icon="folder/Folder" />
                            Folder
                        </DropdownItem>
                        <DropdownItem value="/folder/Camera">
                            <Icon icon="folder/Camera" />
                            Camera
                        </DropdownItem>
                        <DropdownItem value="/folder/Briefcase">
                            <Icon icon="folder/Briefcase" />
                            Briefcase
                        </DropdownItem>
                    </DropdownContent>
                </FormInput>

                <FormInput
                    id="name"
                    label="Name"
                    class="grow"
                    Component={Textbox}
                    isRequired={folderFields.name.properties.isRequired}
                    properties={{
                        placeholder: "An exquisite collection",
                        maxlength: folderFields.name.properties.maxlength,
                    }}
                />
            </div>

            <FormInput
                id="description"
                label="What is this study set for?"
                class="w-full"
                Component={Textbox}
                isRequired={folderFields.description.properties.isRequired}
                properties={{
                    placeholder: "A collection of stuff I should probably remember",
                    maxlength: folderFields.description.properties.maxlength,
                    multiline: true,
                }}
            />
        {:else if stage === CreationStage.sets}
            a
        {/if}
    </FormContent>

    <FormSubmit>
        {#if stage == CreationStage.permissions}
            Create
        {:else}
            Next <Icon class="size-4" icon="general/Arrows/Right" />
        {/if}
    </FormSubmit>
</Form>
