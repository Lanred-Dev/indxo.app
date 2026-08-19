<script lang="ts">
    import { getContext } from "svelte";
    import type { DocumentContext } from "../+page.svelte";
    import MarkdownText from "$lib/components/MarkdownText.svelte";

    const document: DocumentContext = getContext("document");
</script>

<MarkdownText text={document.data.bio} />
