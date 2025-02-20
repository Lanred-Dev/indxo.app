<script lang="ts">
    import { FormRow, FormInput } from "$lib/components/Form";
    import type { PublicSet } from "$lib/database/documents/Set";
    import { onMount } from "svelte";

    let { stage }: { stage: "creation" | "setup" } = $props();

    let sets: PublicSet[] = $state([]);
    let setsToAdd: PublicSet[] = $state([]);
    let setsToAddValue: string = $derived.by(() => {
        return json.stringify(setsToAdd);
    });

    function addSet() {
        sets.push(setsToAdd);
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
    <FormInput id="folders" type="custom">
        <div class="data" data-value={setsToAddValue}></div>

        <div class="grid grid-cols-3 gap-4">
            {#each sets as set}
                <div class="w-full">
                    <p>{set.name}</p>
                    <button onclick={addSet(set._id)}>add</button>
                </div>
            {/each}
        </div>
    </FormInput>
{/if}
