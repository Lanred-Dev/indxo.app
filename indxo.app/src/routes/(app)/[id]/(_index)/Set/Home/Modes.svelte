<script lang="ts">
    import { Wording } from "$lib/utils/wording";
    import { getContext } from "svelte";
    import type { DocumentContext } from "../../+page.svelte";
    import { StudyModes } from "$lib/documents";
    import Icon from "$lib/components/Icon.svelte";

    const document: DocumentContext = getContext("document");
</script>

<div class="list-primary mt-16">
    <p class="title">{Wording.modes}</p>

    <ul class="content">
        {#each Object.values(StudyModes) as { icon, text, url }}
            <li class="grow">
                <a class="button-primary" href={url.replace("[id]", document.data._id)}>
                    <Icon {icon} />
                    <p>{text}</p>
                </a>
            </li>
        {/each}
    </ul>
</div>
