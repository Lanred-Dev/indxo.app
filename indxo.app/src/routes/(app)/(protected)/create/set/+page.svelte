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
    import { DocumentType, DocumentVisibility, setFields } from "$lib/documents";
    import {
        Dropdown,
        DropdownContent,
        DropdownItem,
        DropdownTrigger,
    } from "$lib/components/Dropdown";
    import EditableTermsList from "$lib/components/Lists/EditableTerms.svelte";

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
                    id="visibility"
                    label="Visibility"
                    Component={Dropdown}
                    isRequired={setFields.visibility.properties.isRequired}
                    value={setFields.visibility.properties.defaultValue}
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
            <EditableTermsList value={[]} />
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
