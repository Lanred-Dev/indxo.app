<script lang="ts">
    import EditableTermsList from "$lib/components/Lists/EditableTerms.svelte";
    import { getContext } from "svelte";
    import type { DocumentContext } from "../+page.svelte";
    import Details from "./Details.svelte";

    const document: DocumentContext = getContext("document");
</script>

<Details />

<EditableTermsList bind:value={document.terms} />
