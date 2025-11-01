<script lang="ts">
    import EditableTermsList from "$lib/components/Lists/EditableTerms.svelte";
    import { getContext } from "svelte";
    import type { DocumentEditContext } from "../+page.svelte";
    import Details from "./Details.svelte";

    const document: DocumentEditContext = getContext("documentEdit");
</script>

<Details />

<EditableTermsList bind:value={document.terms} />
