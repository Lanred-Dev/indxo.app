<script lang="ts">
    import { setContext, type Snippet } from "svelte";
    import { formContextKey, FormSubmitMethods, type FormContext } from ".";
    import { ResponseCodes } from "$lib/utils/apiResponses";
    import { Dialog, DialogContent, DialogContentHeader, DialogTrigger } from "../Dialog";

    let {
        endpoint,
        method = FormSubmitMethods.post,
        title,
        stage = null,
        afterSubmit,
        children,
        ...properties
    }: {
        endpoint: string;
        method: FormSubmitMethods;
        stage?: FormContext["stage"];
        afterSubmit?: (response: Response) => void;
        children: Snippet<[]>;
        [key: string]: any;
    } = $props();

    let fields: Map<string, { value: unknown; label?: string }> = new Map();
    let required: Set<string> = new Set();
    let isSubmitting: boolean = $state.raw(false);
    let submitError: { title: string; message: string } | null = $state.raw(null);

    setContext(formContextKey, {
        get isSubmitting() {
            return isSubmitting;
        },
        fields,
        stage,
        registerField: (id: string, value: unknown, isRequired: boolean, label?: string) => {
            fields.set(id, { value, label });

            if (isRequired) required.add(id);
        },
    } satisfies FormContext);

    /**
     * Handles submitting a form.
     *
     * @param event
     */
    async function onSubmit(event: SubmitEvent) {
        event.preventDefault();

        let missingFields: string[] = [];

        required.forEach((id) => {
            const { value, label } = fields.get(id) ?? {};

            if (
                value === null ||
                value === undefined ||
                ((typeof value === "string" || Array.isArray(value)) && value.length === 0)
            )
                missingFields.push(`${label} (${id})`);
        });

        if (missingFields.length > 0)
            return (submitError = {
                title: `Missing ${missingFields.length} required field${missingFields.length === 1 ? "" : "s"}.`,
                message: missingFields.join(", "),
            });

        isSubmitting = true;

        const response = await fetch(endpoint, {
            method,
            body: JSON.stringify(
                Object.fromEntries([...fields].map(([id, data]) => [id, data.value]))
            ),
        });

        isSubmitting = false;

        if (
            response.status !== ResponseCodes.Success &&
            response.status !== ResponseCodes.SuccessNoResponse
        ) {
            submitError = {
                title: response.status.toString(),
                message: "",
            };

            switch (response.status) {
                case ResponseCodes.NotFound:
                    submitError.message = "Could not send request.";
                    break;
                default:
                    submitError.message = (await response.json()).message ?? response.statusText;
                    break;
            }

            return;
        }

        if (afterSubmit) afterSubmit(response);
    }
</script>

<Dialog isVisible={submitError !== null} onClose={() => (submitError = null)}>
    <DialogContent>
        <DialogContentHeader title={submitError?.title ?? ""} includeClose={false} />

        {submitError?.message}

        <DialogTrigger class="button-primary mt-4">Okay</DialogTrigger>
    </DialogContent>
</Dialog>

<form style:pointer-events={isSubmitting ? "none" : undefined} onsubmit={onSubmit} {...properties}>
    {@render children()}
</form>
