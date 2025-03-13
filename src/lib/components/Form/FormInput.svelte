<!--NOTE: This component combines a lot of individual components into one.-->

<script lang="ts">
    import Dropdown from "$lib/components/Dropdown";
    import EditableList from "$lib/components/EditableList";
    import Checkbox from "$lib/components/Checkbox.svelte";
    import { twMerge } from "tailwind-merge";
    import { type Snippet } from "svelte";

    export type inputType =
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
        type: inputType;
        classes?: string;
        componentProps?: { [key: string]: any };

        // This is used for custom inputs
        children?: Snippet<[]>;
    } = $props();

    const inputClasses: string = twMerge(
        `w-full ${type === "dropdown" || type === "checkbox" || type === "editableList" ? "" : "input-primary"}`,
        classes
    );
</script>

<div
    class="formInput space-y-1 {type === 'dropdown' || type === 'checkbox'
        ? 'min-w-fit'
        : 'w-full flex-grow'}"
    data-type={type}
    data-id={id}
>
    {#if label}
        <label class="text-light cursor-text select-none text-nowrap pl-3" for={id}>{label}</label>
    {/if}

    {#if type === "dropdown"}
        <Dropdown classes={inputClasses} {...componentProps} />
    {:else if type === "editableList"}
        <EditableList classes={inputClasses} {...componentProps} />
    {:else if type === "checkbox"}
        <Checkbox classes={inputClasses} {...componentProps} />
    {:else if type === "textarea"}
        <textarea class="resize-none {inputClasses}" name={id} {id} {...componentProps}></textarea>
    {:else if type === "custom"}
        {@render children?.()}
    {:else}
        <input class={inputClasses} name={id} {id} {type} {...componentProps} />
    {/if}
</div>
