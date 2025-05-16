<script lang="ts">
    import type { PublicFolder } from "$lib/database/documents/Folder";
    import type { PublicSet } from "$lib/database/documents/Set";
    import determineDocumentType from "$lib/utils/determineDocumentType";
    import Card, { type CardInfoItem } from "$lib/components/Card.svelte";
    import determineWording from "$lib/utils/determineWording";
    import { slide } from "svelte/transition";
    import { getContext } from "svelte";
    import type { SimpleUserWithEmail } from "$lib/database/documents/User";

    export interface CardGroupInfo {
        name: string;
        documents: (PublicFolder | PublicSet)[];
    }

    let { name, documents }: CardGroupInfo = $props();

    const user: SimpleUserWithEmail = getContext("user");
    let visible: boolean = $state.raw(true);

    function getDocumentInfo(document: PublicFolder | PublicSet): {
        type: "set" | "folder" | "user";
        info: CardInfoItem[];
    } {
        const type = determineDocumentType(document);
        const info: CardInfoItem[] = [];

        if (user._id !== document.owner._id)
            info.push({ text: document.owner.name, image: document.owner.image });

        switch (type) {
            case "set":
                if ((document as PublicSet).subject.length > 0)
                    info.push({ text: (document as PublicSet).subject });

                const terms: number = (document as PublicSet).terms.length;
                info.push({ text: `${terms} ${determineWording(terms === 1 ? "term" : "terms")}` });
                break;
            case "folder":
                const sets: number = (document as PublicFolder).sets.length;
                info.push({ text: `${sets} ${determineWording(sets === 1 ? "set" : "sets")}` });
                break;
        }

        return { type, info };
    }
</script>

<div class="list-primary">
    {#if typeof name === "string" && name.length > 0}
        <button class="flex-center list-title gap-1" onclick={() => (visible = !visible)}>
            {name}

            <img
                class="size-4"
                src="/icons/general/{visible ? 'UpChevron' : 'DownChevron'}.svg"
                alt="Arrow {visible ? 'up' : 'down'}"
            />
        </button>
    {/if}

    {#if visible}
        <ul class="list flex-col" transition:slide>
            {#each documents as document}
                {@const { type, info } = getDocumentInfo(document)}

                <li>
                    {#if type === "folder"}
                        <Card
                            name={document.name}
                            description={document.description}
                            url={`/folder/${document._id}`}
                            icon={(document as PublicFolder).icon}
                            {info}
                        />
                    {:else if type === "set"}
                        <Card
                            name={document.name}
                            description={document.description}
                            url={`/set/${document._id}`}
                            {info}
                        />
                    {/if}
                </li>
            {/each}
        </ul>
    {/if}
</div>
