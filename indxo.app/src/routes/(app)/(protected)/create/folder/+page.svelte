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
    import { DocumentType, DocumentVisibility, folderFields } from "$lib/documents";
    import {
        Dropdown,
        DropdownContent,
        DropdownItem,
        DropdownTrigger,
    } from "$lib/components/Dropdown";

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
                            <img src="/icons/general/Web.svg" alt="Public" />
                            Public
                        </DropdownItem>
                        <DropdownItem value={DocumentVisibility.private}>
                            <img src="/icons/general/Lock.svg" alt="Public" />
                            Private
                        </DropdownItem>
                        <DropdownItem value={DocumentVisibility.link}>
                            <img src="/icons/general/Link.svg" alt="Public" />
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
                        <DropdownItem value="/icons/folder/Folder.svg">
                            <img src="/icons/folder/Folder.svg" alt="Folder" />
                            Folder
                        </DropdownItem>
                        <DropdownItem value="/icons/folder/Camera.svg">
                            <img src="/icons/folder/Camera.svg" alt="Camera" />
                            Camera
                        </DropdownItem>
                        <DropdownItem value="/icons/folder/Briefcase.svg">
                            <img src="/icons/folder/Briefcase.svg" alt="Briefcase" />
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
            Next <Arrow class="size-4" state={ArrowState.right} />
        {/if}
    </FormSubmit>
</Form>
