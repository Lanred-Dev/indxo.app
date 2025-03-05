<script lang="ts">
    import { FormRow, FormInput } from "$lib/components/Form";
    import type { PublicSet } from "$lib/database/documents/Set";
    import { onMount } from "svelte";

    let { stage }: { stage: "creation" | "setup" } = $props();

    let sets: PublicSet[] = $state([]);
    let addedSets: string[] = $state([]);
    let value: string = $derived.by(() => {
        const sets = addedSets;
        return JSON.stringify(sets);
    });

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
            placeholder={true}
            checkboxText={["Public", "Private"]}
            checkboxIcons={["/icons/general/Web.svg", "/icons/general/Lock.svg"]}
        />
        <FormInput
            id="icon"
            label="Icon"
            type="dropdown"
            options={[
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
            ]}
            placeholder={{
                value: "/icons/folder/Folder.svg",
                image: "/icons/folder/Folder.svg",
                text: "Folder",
            }}
        />
        <FormInput id="name" label="Name" type="text" placeholder="AP Lit Exam" />
    </FormRow>

    <FormInput
        id="description"
        label="What is this folder for?"
        type="textarea"
        placeholder="This folder contains all my study sets for..."
        classes="h-40"
    />
{:else}
    <FormInput id="sets" type="custom">
        <div class="data" data-type="json" data-value={value}></div>

        <div class="grid grid-cols-2 gap-4">
            {#each sets as set}
                <div
                    class="primary flex w-full justify-between gap-6 border border-primary px-8 py-6 [&>p]:leading-tight"
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
                        <button
                            onclick={() => {
                                if (addedSets.includes(set._id.toString())) {
                                    addedSets.splice(addedSets.indexOf(set._id.toString()), 1);
                                } else {
                                    addedSets.push(set._id.toString());
                                }
                            }}
                            type="button"
                        >
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
