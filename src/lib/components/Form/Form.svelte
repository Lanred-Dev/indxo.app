<script lang="ts">
    import { setContext, type Component, type Snippet } from "svelte";
    import { formContextKey, FormInput, FormSubmitMethods, type FormContext } from ".";
    import {
        DocumentCreationStage,
        DocumentFieldInputType,
        type DocumentField,
    } from "$lib/documents";
    import { ResponseCodes } from "$lib/utils/apiResponses";
    import Checkbox from "../Checkbox.svelte";
    import Textbox from "../Textbox.svelte";
    import Dropdown from "../Dropdown/Dropdown.svelte";
    import { DropdownContent, DropdownTrigger } from "../Dropdown";
    import type { ClassValue } from "svelte/elements";
    import { Dialog, DialogClose, DialogContent, DialogContentHeader } from "../Dialog";

    let {
        endpoint,
        method = FormSubmitMethods.post,
        fields = [],
        showCreationStage,
        afterSubmit,
        children,
        class: className,
        ...properties
    }: {
        endpoint: string;
        method: FormSubmitMethods;
        fields?: DocumentField[];
        showCreationStage?: DocumentCreationStage;
        afterSubmit?: (response: Response) => void;
        children?: Snippet<[]>;
        class?: ClassValue;
        [key: string]: any;
    } = $props();

    let fieldValues: Map<string, { value: unknown; label?: string }> = new Map();
    let fieldGroups: DocumentField[][] = $derived.by(() => {
        const groups: DocumentField[][] = [];
        const groupless: DocumentField[] = [];

        fields.forEach((field) => {
            const { stage, group, groupIndex } = field.input?.position ?? {};

            if (!field.input || (showCreationStage && (!stage || stage !== showCreationStage)))
                return;

            if (typeof group === "number") {
                if (!groups[group]) groups[group] = [];

                if (typeof groupIndex === "number") {
                    groups[group].splice(groupIndex, 0, field);
                } else {
                    groups[group].push(field);
                }
            } else {
                groupless.push(field);
            }
        });

        groups.push(groupless);
        return groups;
    });
    let requiredFields: Set<string> = new Set();
    let submitting: boolean = $state.raw(false);
    let submitError: { title: string; message: string } | null = $state.raw(null);

    setContext(formContextKey, (() => {
        return {
            submitting,
            fieldValues,
            registerValue: (id: string, value: unknown, optional: boolean, label?: string) => {
                fieldValues.set(id, { value, label });

                if (!optional) requiredFields.add(id);
            },
        };
    }) satisfies FormContext);

    /**
     * Handles submitting a form.
     *
     * @param event
     */
    async function onSubmit(event: SubmitEvent) {
        event.preventDefault();

        let missingFields: string[] = [];

        requiredFields.forEach((id) => {
            const { value, label } = fieldValues.get(id) ?? {};

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

        submitting = true;

        const response = await fetch(endpoint, {
            method,
            body: JSON.stringify(
                Object.fromEntries([...fieldValues].map(([id, data]) => [id, data.value]))
            ),
        });

        submitting = false;

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
                case ResponseCodes.BadRequest:
                case ResponseCodes.ServerError:
                case ResponseCodes.Unauthorized:
                case ResponseCodes.UserUnauthorized:
                    submitError.message = (await response.json()).message ?? response.statusText;
                    break;
            }
            return (submitError = {
                title: response.status.toString(),
                message: (await response.json()).message ?? response.statusText,
            });
        }

        if (afterSubmit) afterSubmit(response);
    }

    /**
     * Determines which input component to use depending on the field input type.
     *
     * @param type
     * @returns The input component
     */
    function determineInputFromFieldType(type: DocumentFieldInputType): Component<any> {
        switch (type) {
            case DocumentFieldInputType.textbox:
                return Textbox;
            case DocumentFieldInputType.number:
                return Textbox;
            case DocumentFieldInputType.dropdown:
                return Dropdown;
            case DocumentFieldInputType.checkbox:
                return Checkbox;
        }
    }
</script>

<Dialog visible={submitError !== null} onClose={() => (submitError = null)}>
    <DialogContent>
        <DialogContentHeader title={submitError?.title ?? ""} includeClose={false} />

        {submitError?.message}

        <DialogClose class="button-primary mt-4">Okay</DialogClose>
    </DialogContent>
</Dialog>

<form
    class={["space-y-5", className, submitting && "pointer-events-none"]}
    onsubmit={onSubmit}
    {...properties}
>
    {#each fieldGroups as group, index}
        {#if group.length > 0}
            <div
                class:space-y-5={index === fieldGroups.length - 1}
                class:row={index !== fieldGroups.length - 1}
            >
                {#each group as { id, input, defaultValue }}
                    <!--NOTE: input will always be defined here because it all non-input fields are filtered out in the fieldGroups derived function-->
                    <FormInput
                        {id}
                        Input={determineInputFromFieldType(input?.type as DocumentFieldInputType)}
                        label={input?.label}
                        inputProperties={{ value: defaultValue, ...input?.properties }}
                        class={input?.class}
                        optional={input?.optional}
                    >
                        {#if input?.type === DocumentFieldInputType.dropdown && input?.dropdownItems}
                            <DropdownTrigger />
                            <DropdownContent items={input.dropdownItems} />
                        {/if}
                    </FormInput>
                {/each}
            </div>
        {/if}
    {/each}

    {@render children?.()}
</form>
