<script lang="ts">
    import { getContext } from "svelte";
    import type { DocumentContext } from "./+page.svelte";
    import determineDocumentType from "$lib/utils/document/determineType";
    import { DocumentType } from "$lib/documents";

    const document: DocumentContext = getContext("document");
    const contentWording: string =
        determineDocumentType(document._id) === DocumentType.folder ? "sets" : "terms";
</script>

<div class="page-title">
    <h1 class="title">{document.name} looks ready, but it’s empty right now</h1>

    <p class="description">No {contentWording} have arrived yet. Perhaps check back later?</p>
</div>

<div class="row">
    <a class="button-attention" href="/{document._id}/edit">Add {contentWording}</a>
    <a class="button-primary" href="/search?query={document.subject ?? document.name}"
        >Search for similar</a
    >
</div>
