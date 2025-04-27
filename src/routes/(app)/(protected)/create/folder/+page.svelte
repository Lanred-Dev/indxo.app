<script lang="ts">
    import { Form, FormInput, FormSubmit, FormRow } from "$lib/components/Form";
    import { goto } from "$app/navigation";
    import determineWording from "$lib/utils/determineWording";
    import type { PublicSet } from "$lib/database/documents/Set";
    import { SvelteSet } from "svelte/reactivity";

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

    let { data } = $props();

    let stage: "creation" | "setup" = $state.raw("creation");
    let documentID: string = $state.raw("");
    let addedSets: SvelteSet<string> = new SvelteSet();
    let value: string = $derived(JSON.stringify(Array.from(addedSets)));

    /**
     * Adds or removes a set from the list of sets to be added to the folder.
     *
     * @param id The ID of the set to add or remove.
     * @returns never
     */
    function addSetToList(id: string) {
        if (addedSets.has(id)) {
            addedSets.delete(id);
        } else {
            addedSets.add(id);
        }
    }

    /**
     * This function is called after the form is submitted, it determines what to do next.
     *
     * @param status The status code of the response
     * @param data Meta data from the submission
     * @returns never
     */
    function afterSubmit(status: number, data: any) {
        if (status !== 201 && status !== 204) return location.reload();

        if (stage === "setup") {
            goto(`/folder/${documentID}`);
        } else if (stage === "creation") {
            stage = "setup";
            documentID = data;
        }
    }
</script>

<svelte:head>
    <title>Create a {determineWording("folder")}</title>
</svelte:head>

<div class="page-message">
    <p>{WORDING[stage][0]}</p>
    <p>{WORDING[stage][1]}</p>
</div>

<Form
    classes="w-full"
    method={stage === "creation" ? "POST" : "PUT"}
    endpoint={stage === "creation"
        ? `/api/documents/folder/create`
        : `/api/documents/folder/${documentID}/update`}
    {afterSubmit}
>
    {#if stage === "creation"}
        <FormRow>
            <FormInput
                id="isPublic"
                label="Visiblity"
                type="checkbox"
                properties={{
                    value: true,
                    text: ["Public", "Private"],
                    icons: ["/icons/general/Web.svg", "/icons/general/Lock.svg"],
                }}
            />

            <FormInput
                id="icon"
                label="Icon"
                type="dropdown"
                properties={{
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
                properties={{ placeholder: "AP Lit Exam" }}
            />
        </FormRow>

        <FormInput
            id="description"
            label="What is this folder for?"
            type="textarea"
            properties={{ placeholder: "This folder contains all my study sets for..." }}
        />
    {:else}
        <FormInput
            id="sets"
            type="custom"
            properties={{ "data-type": "json", "data-value": value }}
        >
            <div class="grid grid-cols-2 gap-4">
                {#each data.userSets as { name, subject, terms, description, _id }}
                    <button
                        class="button-primary relative items-start! justify-start! text-left [&>p]:leading-tight"
                        onclick={() => addSetToList(_id)}
                        type="button"
                    >
                        <div class="space-y-2">
                            <div>
                                <p class="w-full overflow-hidden text-xl font-bold text-ellipsis">
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
                                        {determineWording(terms.length === 1 ? "term" : "terms")}
                                    </p>
                                </div>
                            </div>

                            <p class="line-clamp-1 text-ellipsis">{description}</p>
                        </div>

                        <img
                            class="absolute top-2 right-2 size-6! shrink-0"
                            src={addedSets.has(_id)
                                ? "/icons/general/X.svg"
                                : "/icons/general/Plus.svg"}
                            alt={addedSets.has(_id) ? "Remove" : "Add"}
                        />
                    </button>
                {/each}
            </div>
        </FormInput>
    {/if}

    <FormSubmit text="Create" />
</Form>
