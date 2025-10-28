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
        } else if (titles && form.stage && form.stage in titles) {
            return titles[form.stage];
        }

        return { title: "", description: "" };
    });
</script>

<div class="page-title">
    <h1 class="title">{currentTitle}</h1>
    <p class="description">{currentDescription}</p>
</div>
