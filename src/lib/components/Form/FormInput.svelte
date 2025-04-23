<!--NOTE: This component combines a lot of individual components into one.-->

<script lang="ts">
    import Dropdown from "$lib/components/Dropdown.svelte";
    import EditableList from "$lib/components/EditableList";
    import Checkbox from "$lib/components/Checkbox.svelte";
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
    let labelID: string = `${id}-label`;

    const inputClasses: string = twMerge(
        `w-full field-sizing-content ${type === "dropdown" || type === "checkbox" || type === "editableList" ? "" : "input-primary"}`,
        classes
    );
</script>

<div
    class="formInput space-y-0.5 {type === 'dropdown' || type === 'checkbox'
        ? 'min-w-fit'
        : 'grow'}"
    data-type={type}
    data-id={id}
>
    {#if label}
        <label class="text-light cursor-text pl-3 text-nowrap select-none" for={id} id={labelID}
            >{label}</label
        >
    {/if}

    {#if type === "dropdown"}
        <Dropdown classes={inputClasses} {labelID} {...componentProps} />
    {:else if type === "editableList"}
        <EditableList classes={inputClasses} {labelID} {...componentProps} />
    {:else if type === "checkbox"}
        <Checkbox classes={inputClasses} {labelID} {...componentProps} />
    {:else if type === "textarea"}
        <textarea
            class={twMerge("resize-none", inputClasses)}
            {id}
            aria-labelledby={labelID}
            {...componentProps}
        ></textarea>
    {:else if type === "custom"}
        {@render children?.()}
    {:else}
        <input class={inputClasses} {id} {type} {...componentProps} aria-labelledby={labelID} />
    {/if}
</div>
