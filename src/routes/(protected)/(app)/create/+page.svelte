<script lang="ts">
    import { Form, FormSubmit } from "$lib/components/Form";
    import FolderForm from "./Forms/Folder.svelte";
    import SetForm from "./Forms/Set.svelte";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";

    let type: string = $derived(page.url.searchParams.get("type") || "set");
    let stage: "creation" | "setup" = $state("creation");
    let linkTo: string;

    function afterSubmit(success: boolean, meta: any) {
        if (!success) {
            return location.reload();
        }

        if (stage === "setup") {
            goto(linkTo);
        } else {
            stage = "setup";
            linkTo = meta.linkTo;
        }
    }
</script>

<svelte:head>
    <title>Create</title>
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

<Form
    classes="w-full"
    action={type === "folder" ? "/api/documents/create/folder" : "/api/documents/create/set"}
    {afterSubmit}
>
    {#if type === "folder"}
        <FolderForm {stage} />
    {:else}
        <SetForm {stage} />
    {/if}

    <FormSubmit text={stage === "creation" ? "Create" : "Finalize"} />
</Form>
