<!--NOTE: This component combines a lot of individual components into one.-->

<script lang="ts">
    import Dropdown from "./Dropdown.svelte";
    import EditableList from "./EditableList/EditableList.svelte";
    import Checkbox from "./Checkbox.svelte";
    import { twMerge } from "tailwind-merge";
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
        classes,
        componentProps,
        children,
    }: {
        id: string;
        label?: string;
        type: InputType;
        classes?: string;
        componentProps?: { [key: string]: any };

        // This is used for custom inputs
        children?: Snippet<[]>;
    } = $props();

    const uid: string = $props.id();
    const labelID: string = `${uid}-label`;
    const inputClasses: string = twMerge(
        `w-full field-sizing-content ${type === "dropdown" || type === "checkbox" || type === "editableList" ? "" : "input-primary"}`,
        classes
    );
</script>

<div
    class="flex flex-col gap-y-0.5 {type === 'dropdown' || type === 'checkbox'
        ? 'min-w-fit'
        : 'grow'}"
    data-type={type}
    data-id={id}
    data-formInput
>
    {#if label}
        <label class="text-light cursor-text pl-3 text-nowrap select-none" for={uid} id={labelID}
            >{label}</label
        >
    {/if}

    {#if type === "custom"}
        {@render children?.()}
    {:else if type === "dropdown"}
        <Dropdown classes={inputClasses} {labelID} {...componentProps} />
    {:else if type === "editableList"}
        <EditableList classes={inputClasses} {labelID} {...componentProps} />
    {:else if type === "checkbox"}
        <Checkbox classes={inputClasses} {labelID} {...componentProps} />
    {:else if type === "textarea"}
        <textarea
            class={twMerge("resize-none", inputClasses)}
            id={uid}
            aria-labelledby={labelID}
            data-input
            {...componentProps}
        ></textarea>
    {:else}
        <input
            class={inputClasses}
            id={uid}
            {type}
            aria-labelledby={labelID}
            data-input
            {...componentProps}
        />
    {/if}
</div>
