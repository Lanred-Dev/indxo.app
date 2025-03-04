<script lang="ts">
    import { Form, FormSubmit } from "$lib/components/Form";
    import FolderForm from "./Folder.svelte";
    import SetForm from "./Set.svelte";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";

    let type: string = $derived(page.params.slug);
    let stage: "creation" | "setup" = $state("creation");
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
</script>

<svelte:head>
    <title>Create a {type === "folder" ? "folder" : "study set"}</title>
</svelte:head>

<div class="mb-7">
    <p class="text-3xl font-bold">
        {#if stage === "creation"}
            Lets create a new {type === "folder" ? "folder" : "study set"}!
        {:else if type === "folder"}
            Now lets add some sets to your folder.
        {:else}
            Nows its time to create some terms.
        {/if}
    </p>

    <p class="text-light text-lg">
        {#if stage === "creation"}
            Get started by entering the basics below.
        {:else if type === "folder"}
            Select the sets, from below, that you'd like to add to this folder.
        {:else}
            Get started by entering some terms and definitions below.
        {/if}
    </p>
</div>

<Form classes="w-full" action={endpoint} {afterSubmit}>
    {#if type === "folder"}
        <FolderForm {stage} />
    {:else if type === "set"}
        <SetForm {stage} />
    {/if}

    <FormSubmit text="Create" />
</Form>
