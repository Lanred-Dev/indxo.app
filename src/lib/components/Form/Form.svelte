<script lang="ts">
    import { setContext, type Snippet } from "svelte";
    import { formContextKey, FormSubmitMethods, type FormContext } from ".";
    import { ResponseCodes } from "$lib/utils/apiResponses";
    import Tooltip from "../Tooltip.svelte";
    import { PopupContent, PopupRelativity, PopupXAlignment, PopupYAlignment } from "../Popup";
    import type { ClassValue } from "svelte/elements";

    let {
        endpoint,
        method = FormSubmitMethods.post,
        title,
        stage = null,
        afterSubmit,
        children,
        class: className,
        ...properties
    }: {
        endpoint: string;
        method: FormSubmitMethods;
        stage?: FormContext["stage"];
        afterSubmit?: (response: Response) => void;
        children: Snippet<[]>;
        class: ClassValue;
        [key: string]: any;
    } = $props();

    let fields: Map<string, { value: unknown; label?: string }> = new Map();
    let required: Set<string> = new Set();
    let isSubmitting: boolean = $state.raw(false);
    let submitError: string = $state.raw("");
    let submitErrorVisible: boolean = $state.raw(false);

    setContext(formContextKey, {
        get isSubmitting() {
            return isSubmitting;
        },
        fields,
        stage,
        registerField: (id, value, isRequired, label) => {
            fields.set(id, { value, label });

            if (isRequired) required.add(id);
        },
        removeField: (id) => {
            fields.delete(id);
            required.delete(id);
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

        if (missingFields.length > 0) {
            submitError = `Missing ${missingFields.length} required field${missingFields.length === 1 ? "" : "s"}.`;
            submitErrorVisible = true;
            return;
        }

        isSubmitting = true;

        const response = await fetch(endpoint, {
            method,
            body: JSON.stringify(
                Object.fromEntries([...fields].map(([id, { value }]) => [id, value]))
            ),
        });

        isSubmitting = false;

        if (
            response.status !== ResponseCodes.Success &&
            response.status !== ResponseCodes.SuccessNoResponse
        ) {
            switch (response.status) {
                case ResponseCodes.NotFound:
                    submitError = "Could not send request.";
                    break;
                default:
                    submitError = (await response.json()).message ?? response.statusText;
                    break;
            }

            submitErrorVisible = true;
            return;
        }

        if (afterSubmit) afterSubmit(response);
    }
</script>

<Tooltip bind:isVisible={submitErrorVisible} duration={5}>
    <PopupContent
        class="bg-alert"
        xAlignment={PopupXAlignment.center}
        yAlignment={PopupYAlignment.bottom}
        positionRelativity={PopupRelativity.page}
        offset={15}
    >
        {submitError}
    </PopupContent>
</Tooltip>

<form
    class={["flex flex-col gap-y-5", className]}
    style:pointer-events={isSubmitting ? "none" : undefined}
    onsubmit={onSubmit}
    {...properties}
>
    {@render children()}
</form>
