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
    import { onMount } from "svelte";

    let { stage }: { stage: "creation" | "setup" } = $props();

    let sets: PublicSet[] = $state.raw([]);
    let addedSets: string[] = $state([]);
    let value: string = $derived(JSON.stringify(addedSets));

    /**
     * Adds or removes a set from the list of sets to be added to the folder.
     *
     * @param id The ID of the set to add or remove.
     * @returns never
     */
    function addSetToList(id: string) {
        if (addedSets.includes(id)) {
            addedSets.splice(addedSets.indexOf(id), 1);
        } else {
            addedSets.push(id);
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
                value: true,
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
            {#each sets as { name, subject, terms, description, _id }}
                <button
                    class="button-primary relative w-full !items-start gap-6 px-8 py-6 !text-left [&>p]:leading-tight"
                    onclick={() => addSetToList(_id)}
                    type="button"
                >
                    <div class="space-y-2">
                        <div>
                            <p class="w-full overflow-hidden overflow-ellipsis text-xl font-bold">
                                {name}
                            </p>

                            <div
                                class="[&>p]:text-dark flex items-center gap-3 text-sm [&>p]:leading-none"
                            >
                                {#if subject.length > 0}
                                    <p>{subject}</p>
                                {/if}

                                <p class="leading-tight">
                                    {terms.length}
                                    {terms.length === 1 ? "term" : "terms"}
                                </p>
                            </div>
                        </div>

                        <p class="line-clamp-1 overflow-ellipsis">{description}</p>
                    </div>

                    <img
                        class="absolute right-2 top-2 !size-6 flex-shrink-0"
                        src={addedSets.includes(_id)
                            ? "/icons/general/X.svg"
                            : "/icons/general/Plus.svg"}
                        alt={addedSets.includes(_id) ? "Remove" : "Add"}
                    />
                </button>
            {/each}
        </div>
    </FormInput>
{/if}
