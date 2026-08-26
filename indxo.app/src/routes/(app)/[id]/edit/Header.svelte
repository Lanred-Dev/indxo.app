<script lang="ts">
    import { DocumentType } from "$lib/documents";
    import determineDocumentType from "$lib/utils/document/determineType";
    import { Wording } from "$lib/data/ui/wording";
    import { getContext } from "svelte";
    import { FormSubmit } from "$lib/components/Form";
    import type { DocumentContext } from "./+page.svelte";
    import Icon from "$lib/components/Icon.svelte";

    const document: DocumentContext = getContext("document");
</script>

<div class="mb-5 flex justify-between">
    <a class="button-basic" href="/{document.data._id}">
        <Icon icon="general/Chevrons/Left" />
        Back to {Wording[
            determineDocumentType(document.data._id) === DocumentType.folder ? "folder" : "set"
        ]}
    </a>

    <FormSubmit class="w-fit!">Save Changes</FormSubmit>
</div>
