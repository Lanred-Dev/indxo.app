<script lang="ts">
    import { Form, FormSubmit } from "$lib/components/Form";
    import FolderForm, { WORDING as FolderFormWording } from "./Folder.svelte";
    import SetForm, { WORDING as SetFormWording } from "./Set.svelte";
    import { page } from "$app/state";
    import { goto, beforeNavigate } from "$app/navigation";
    import determineWording from "$lib/utils/determineWording";

    let type: string = $derived(page.params.slug);
    let stage: "creation" | "setup" = $state("creation");
    let wording: [string, string] = $derived.by(() => {
        if (type === "folder") return FolderFormWording[stage];
        if (type === "set") return SetFormWording[stage];

        return ["", ""];
    }) as [string, string];
    let documentID: string = $state("");
    let endpoint: string = $derived(
        stage === "creation"
            ? `/api/documents/${type}/create`
            : `/api/documents/${type}/${documentID}/update`
    );

    /**
     * This function is called after the form is submitted, it determines what to do next.
     *
     * @param success If submission was successful
     * @param meta Meta data from the submission
     * @returns never
     */
    function afterSubmit(success: boolean, meta: any) {
        if (!success) {
            return location.reload();
        }

        if (stage === "setup") {
            goto(`/${type}/${documentID}`);
        } else {
            stage = "setup";
            documentID = meta.id;
        }
    }

    // This resets the stage if navigating to another creation page
    beforeNavigate((navigation) => {
        if (!navigation.to?.url.pathname.includes("/create/")) return;

        stage = "creation";
    });
</script>

<svelte:head>
    <title>Create a {determineWording(type)}</title>
</svelte:head>

<div class="mb-7">
    <p class="text-3xl font-bold">{wording[0]}</p>
    <p class="text-light text-lg">{wording[1]}</p>
</div>

<Form classes="w-full" action={endpoint} {afterSubmit}>
    {#if type === "folder"}
        <FolderForm {stage} />
    {:else if type === "set"}
        <SetForm {stage} />
    {/if}

    <FormSubmit text="Create" />
</Form>
