<script lang="ts">
    import type { PublicFolder } from "$lib/database/documents/Folder";
    import type { PublicSet } from "$lib/database/documents/Set";
    import determineDocumentType from "$lib/utils/determineDocumentType";
    import Card, { type CardInfoItem } from "$lib/components/Card.svelte";
    import determineWording from "$lib/utils/determineWording";
    import { slide } from "svelte/transition";
    import { getContext } from "svelte";
    import type { PublicUser, SimplePrivateuser } from "$lib/database/documents/User";

    export interface CardGroupProperties {
        isCollapsible?: boolean;
        name?: string;
        documents: (PublicFolder | PublicSet | PublicUser)[];
    }

    let { isCollapsible = true, name, documents }: CardGroupProperties = $props();

    const user: SimplePrivateuser = getContext("user");
    let visible: boolean = $state.raw(true);

    function getDocumentInfo(document: PublicFolder | PublicSet | PublicUser): {
        type: string | null;
        info: CardInfoItem[];
    } {
        const type = determineDocumentType(document);
        const info: CardInfoItem[] = [];

        if ("owner" in document && user._id !== document.owner._id)
            info.push({ text: document.owner.name, image: document.owner.image });

        switch (type) {
            case "set": {
                if ((document as PublicSet).subject.length > 0)
                    info.push({ text: (document as PublicSet).subject });

                const terms: number = (document as PublicSet).terms.length;
                info.push({ text: `${terms} ${determineWording(terms === 1 ? "term" : "terms")}` });
                break;
            }
            case "folder": {
                const sets: number = (document as PublicFolder).sets.length;
                info.push({ text: `${sets} ${determineWording(sets === 1 ? "set" : "sets")}` });
                break;
            }
            case "user": {
                const sets: number = (document as PublicUser).sets.length;
                info.push({ text: `${sets} ${determineWording(sets === 1 ? "set" : "sets")}` });
                const folders: number = (document as PublicUser).folders.length;
                info.push({
                    text: `${folders} ${determineWording(folders === 1 ? "folder" : "folders")}`,
                });
                break;
            }
        }

        return { type, info };
    }
</script>

<div class="list-primary">
    {#if typeof name === "string" && name.length > 0}
        <button
            class="flex-center list-title gap-1 {!isCollapsible ? 'pointer-events-none' : ''}"
            onclick={() => (visible = !visible)}
        >
            {name}

            {#if isCollapsible}
                <img
                    class="size-5"
                    src="/icons/general/{visible ? 'UpChevron' : 'DownChevron'}.svg"
                    alt="Arrow {visible ? 'up' : 'down'}"
                />
            {/if}
        </button>
    {/if}

    {#if visible}
        <ul class="list-container" transition:slide>
            {#each documents as document}
                {@const { type, info } = getDocumentInfo(document)}

                {#if type}
                    <li class="w-full">
                        {#if type === "folder"}
                            <Card
                                name={document.name}
                                description={(document as PublicFolder).description}
                                url="/folder/${document._id}"
                                icon={(document as PublicFolder).icon}
                                {info}
                            />
                        {:else if type === "set"}
                            <Card
                                name={document.name}
                                description={(document as PublicSet).description}
                                url="/set/{document._id}"
                                {info}
                            />
                        {:else if type === "user"}
                            <Card name={document.name} url="/user/{document._id}" {info} />
                        {/if}
                    </li>
                {/if}
            {/each}
        </ul>
    {/if}
</div>
