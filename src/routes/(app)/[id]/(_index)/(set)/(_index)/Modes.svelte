<script lang="ts">
    import { Wording } from "$lib/utils/wording";
    import { getContext } from "svelte";
    import type { DocumentContext } from "../../+page.svelte";
    import { StudyModes } from "$lib/documents";

    const document: DocumentContext = getContext("document");
</script>

<div class="list-primary mt-16">
    <p class="list-title">{Wording.modes}</p>

    <ul class="list-container">
        {#each Object.values(StudyModes) as { icon, text, url }}
            <li class="grow">
                <a class="button-primary" href={url.replace("[id]", document.id)}>
                    <img class="size-7" src={icon} alt={text} />
                    <p>{text}</p>
                </a>
            </li>
        {/each}
    </ul>
</div>
