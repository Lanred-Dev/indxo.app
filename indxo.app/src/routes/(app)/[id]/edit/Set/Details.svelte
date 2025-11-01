<script lang="ts">
    import {
        Dropdown,
        DropdownContent,
        DropdownItem,
        DropdownTrigger,
    } from "$lib/components/Dropdown";
    import { FormInput } from "$lib/components/Form";
    import Textbox from "$lib/components/Textbox.svelte";
    import { DocumentVisibility, setFields } from "$lib/documents";
    import { getContext } from "svelte";
    import type { DocumentEditContext } from "../+page.svelte";

    const document: DocumentEditContext = getContext("documentEdit");
</script>

<div class="row">
    <FormInput
        id="visibility"
        label="Visibility"
        Component={Dropdown}
        isRequired={setFields.visibility.properties.isRequired}
        value={document.visibility}
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
        value={document.name}
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
        value={document.subject || ""}
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
    value={document.description || ""}
/>
