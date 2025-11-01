<script lang="ts">
    import { DocumentType } from "$lib/documents";
    import determineDocumentType from "$lib/utils/document/determineType";
    import { Wording } from "$lib/utils/wording";
    import { getContext } from "svelte";
    import Chevron, { ChevronState } from "$lib/components/Icons/Chevron.svelte";
    import { FormSubmit } from "$lib/components/Form";
    import type { DocumentEditContext } from "./+page.svelte";

    const document: DocumentEditContext = getContext("documentEdit");
</script>

<div class="mb-5 flex justify-between">
    <a class="button-basic" href="/{document._id}">
        <Chevron class="size-4" state={ChevronState.left} />
        Back to {Wording[
            determineDocumentType(document._id) === DocumentType.folder ? "folder" : "set"
        ]}
    </a>

    <FormSubmit class="w-fit!">Save Changes</FormSubmit>
</div>
