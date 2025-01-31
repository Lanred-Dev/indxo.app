<script lang="ts">
    import { Form, FormSubmit } from "$lib/components/Form";
    import FolderForm from "./Forms/Folder.svelte";
    import SetForm from "./Forms/Set.svelte";
    import { page } from "$app/state";

    let type: string = $derived(page.url.searchParams.get("type") || "set");
</script>

<div class="x-center y-center w-2/3">
    <div class="mb-7">
        <p class="text-3xl">Lets create a new {type === "folder" ? "folder" : "study set"}!</p>
        <p class="text-light text-lg">Get started by entering the basics below.</p>
    </div>

    <Form classes="w-full" action={type === "folder" ? "/api/create/folder" : "/api/create/set"}>
        {#if type === "folder"}
            <FolderForm />
        {:else}
            <SetForm />
        {/if}

        <FormSubmit text="Create" />
    </Form>
</div>
