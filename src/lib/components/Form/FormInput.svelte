<!--NOTE: This component combines a lot of individual components into one.-->

<script lang="ts">
    import Dropdown from "./Dropdown.svelte";
    import EditableList from "./EditableList/EditableList.svelte";
    import Checkbox from "./Checkbox.svelte";
    import { type Snippet } from "svelte";

    export type InputType =
        | "text"
        | "file"
        | "email"
        | "radio"
        | "checkbox"
        | "dropdown"
        | "number"
        | "checkbox"
        | "textarea"
        | "password"
        | "editableList"
        | "custom";

    let {
        id,
        label,
        type,
        properties,
        children,
    }: {
        id: string;
        label?: string;
        type: InputType;
        properties?: { [key: string]: any };

        // This is used for custom inputs
        children?: Snippet<[]>;
    } = $props();

    const uid: string = $props.id();
    const labelID: string = `${uid}-label`;
    // This is only used for textareas and inputs
    let value: string = $state.raw("");
</script>

<div
    class="flex flex-col gap-y-0.5 {type === 'dropdown' || type === 'checkbox'
        ? 'min-w-fit'
        : 'grow'}"
    data-type={type}
    data-id={id}
    data-formInput
>
    {#if label || "maxlength" in (properties ?? {})}
        <div class="flex items-center space-x-1.5 pl-3 select-none">
            {#if label}
                <label class="text-light text-nowrap" for={uid} id={labelID}>{label}</label>
            {/if}

            {#if "maxlength" in (properties ?? {})}
                <p
                    class="text-xs {value.length === properties?.maxlength
                        ? 'text-alert'
                        : 'text-light'}"
                >
                    ({value.length}/{properties?.maxlength})
                </p>
            {/if}
        </div>
    {/if}

    {#if type === "custom"}
        {@render children?.()}
    {:else if type === "dropdown"}
        <Dropdown {labelID} {...properties} />
    {:else if type === "editableList"}
        <EditableList {labelID} {...properties} />
    {:else if type === "checkbox"}
        <Checkbox {labelID} {...properties} />
    {:else if type === "textarea"}
        <textarea
            class="input-primary field-sizing-content h-40 resize-none"
            id={uid}
            aria-labelledby={labelID}
            data-input
            data-max={value.length === properties?.maxlength}
            {...properties}
            bind:value
        ></textarea>
    {:else}
        <input
            class="input-primary"
            {type}
            id={uid}
            aria-labelledby={labelID}
            data-input
            data-max={value.length === properties?.maxlength}
            {...properties}
            bind:value
        />
    {/if}
</div>
