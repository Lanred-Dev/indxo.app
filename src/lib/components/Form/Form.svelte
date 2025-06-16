<script lang="ts">
    import { setContext, type Snippet } from "svelte";
    import { formContextKey, FormSubmitMethods } from ".";

    let {
        endpoint,
        method = FormSubmitMethods.post,
        afterSubmit,
        children,
        ...properties
    }: {
        endpoint: string;
        method: FormSubmitMethods;
        afterSubmit?: (response: Response) => void;
        children: Snippet<[]>;
        [key: string]: any;
    } = $props();

    let fields: Record<string, unknown> = {};
    let submitting: boolean = $state.raw(false);

    setContext(formContextKey, () => {
        return {
            submitting,
            fields,
        };
    });

    async function onSubmit(event: SubmitEvent) {
        event.preventDefault();
        submitting = true;

        const response = await fetch(endpoint, {
            method,
            body: JSON.stringify(fields),
        });

        if (afterSubmit) afterSubmit(response);

        submitting = false;
    }
</script>

<form
    class={["space-y-5", submitting && "pointer-events-none", properties.class]}
    onsubmit={onSubmit}
    {...properties}
>
    {@render children()}
</form>
