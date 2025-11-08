<script lang="ts">
    import { getContext } from "svelte";
    import { formContextKey, type FormContext } from ".";

    type Title = {
        title: string;
        description: string;
    };

    let {
        titles,
        title,
    }: {
        titles?: Record<string, Title>;
        title?: Title;
    } = $props();

    let form: FormContext = getContext(formContextKey);
    let { title: currentTitle, description: currentDescription }: Title = $derived.by(() => {
        if (title) {
            return title;
        } else if (titles && "stage" in form && form.stage && form.stage in titles) {
            return titles[form.stage];
        } else {
            return { title: "", description: "" };
        }
    });
</script>

<div class="page-title mb-7">
    <h1 class="title">{currentTitle}</h1>
    <p class="description">{currentDescription}</p>
</div>
