<script lang="ts">
    import { Wording } from "$lib/data/ui/wording";
    import { getContext } from "svelte";
    import type { DocumentContext } from "../../+page.svelte";
    import { StudyModes } from "$lib/documents";
    import Icon from "$lib/components/Icon.svelte";

    const document: DocumentContext = getContext("document");
</script>

<div class="grid-primary mt-16">
    <p class="title">{Wording.modes}</p>

    <ul class="content grid-cols-2 md:grid-cols-3">
        {#each Object.values(StudyModes) as { icon, text, url }}
            <li class="aspect-16/9 w-full">
                <a
                    class="container-primary flex-center h-full w-full flex-col"
                    href={url.replace("[id]", document.data._id)}
                >
                    <Icon class="size-8" {icon} />
                    <p>{text}</p>
                </a>
            </li>
        {/each}
    </ul>
</div>
