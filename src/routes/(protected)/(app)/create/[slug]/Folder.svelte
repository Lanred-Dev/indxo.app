<script lang="ts" module>
    export const WORDING = {
        creation: [
            `Lets create a new ${determineWording("folder")}!`,
            "Get started by entering the basics below.",
        ],
        setup: [
            `Now lets add some ${determineWording("sets")} to your ${determineWording("folder")}.`,
            `Select the ${determineWording("sets")}, from below, that you'd like to add to this ${determineWording("folder")}.`,
        ],
    };
</script>

<script lang="ts">
    import { FormRow, FormInput } from "$lib/components/Form";
    import type { PublicSet } from "$lib/database/documents/Set";
    import determineWording from "$lib/utils/determineWording";
    import type { ObjectId } from "mongodb";
    import { onMount } from "svelte";

    let { stage }: { stage: "creation" | "setup" } = $props();

    let sets: PublicSet[] = $state([]);
    let addedSets: string[] = $state([]);
    let value: string = $derived.by(() => {
        const sets = addedSets;
        return JSON.stringify(sets);
    });

    /**
     * Adds or removes a set from the list of sets to be added to the folder.
     *
     * @param id The ID of the set to add or remove.
     * @returns never
     */
    function addSetToList(id: ObjectId) {
        if (addedSets.includes(id.toString())) {
            addedSets.splice(addedSets.indexOf(id.toString()), 1);
        } else {
            addedSets.push(id.toString());
        }
    }

    onMount(async () => {
        const userID: string = await (await fetch("/api/account")).json();
        sets = await (await fetch(`/api/account/${userID}/sets`)).json();
    });
</script>

{#if stage === "creation"}
    <FormRow>
        <FormInput
            id="isPublic"
            label="Visiblity"
            type="checkbox"
            componentProps={{
                placeholder: true,
                text: ["Public", "Private"],
                icons: ["/icons/general/Web.svg", "/icons/general/Lock.svg"],
            }}
        />

        <FormInput
            id="icon"
            label="Icon"
            type="dropdown"
            componentProps={{
                items: [
                    {
                        value: "/icons/folder/Folder.svg",
                        image: "/icons/folder/Folder.svg",
                        text: "Folder",
                    },
                    {
                        value: "/icons/folder/Camera.svg",
                        image: "/icons/folder/Camera.svg",
                        text: "Camera",
                    },
                    {
                        value: "/icons/folder/Briefcase.svg",
                        image: "/icons/folder/Briefcase.svg",
                        text: "Briefcase",
                    },
                ],
            }}
        />

        <FormInput
            id="name"
            label="Name"
            type="text"
            componentProps={{ placeholder: "AP Lit Exam" }}
        />
    </FormRow>

    <FormInput
        id="description"
        label="What is this folder for?"
        type="textarea"
        classes="h-40"
        componentProps={{ placeholder: "This folder contains all my study sets for..." }}
    />
{:else}
    <FormInput id="sets" type="custom">
        <div class="data" data-type="json" data-value={value}></div>

        <div class="grid grid-cols-2 gap-4">
            {#each sets as set}
                <div
                    class="container-primary flex w-full justify-between gap-6 px-8 py-6 [&>p]:leading-tight"
                >
                    <div class="space-y-2">
                        <div>
                            <p class="w-full overflow-hidden overflow-ellipsis text-xl font-bold">
                                {set.name}
                            </p>
                            <p class="text-dark text-sm">{set.subject}</p>
                        </div>

                        <p class="line-clamp-1 overflow-ellipsis">{set.description}</p>
                    </div>

                    <div class="flex-shrink-0">
                        <button onclick={() => addSetToList(set._id)} type="button">
                            {#if addedSets.includes(set._id.toString())}
                                <img class="size-6" src="/icons/general/X.svg" alt="Remove" />
                            {:else}
                                <img class="size-6" src="/icons/general/Plus.svg" alt="Add" />
                            {/if}
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    </FormInput>
{/if}
