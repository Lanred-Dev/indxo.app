<!--NOTE: This component combines a lot of individual components into one.-->

<script lang="ts">
    import { Dropdown, DropdownItem } from "$lib/components/Dropdown";
    import EditableList from "$lib/components/EditableList";
    import Checkbox from "$lib/components/Checkbox.svelte";
    import { twMerge } from "tailwind-merge";
    import { type Snippet } from "svelte";
    import type { props as DropdownItemProps } from "$lib/components/Dropdown/DropdownItem.svelte";

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
        placeholder,
        classes,
        options = [],
        checkboxIcons,
        checkboxText,
        children,
    }: {
        id: string;
        label?: string;
        type: inputType;
        placeholder?: string | boolean | DropdownItemProps;
        classes?: string;
        options?: string[] | { value: string; text?: string; image?: string }[];

        // These is only used for the checkbox component
        checkboxIcons?: [string, string];
        checkboxText?: [string, string];

        // This is used for custom inputs
        children?: Snippet<[]>;
    } = $props();

    const stringPlaceholder: string | undefined =
        typeof placeholder === "string" ? placeholder : undefined;
    const inputClasses: string = twMerge(
        `${type === "dropdown" || type === "checkbox" || type === "editableList" ? "" : "primary"} w-full text-lg`,
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
        <Dropdown placeholder={placeholder as DropdownItemProps} classes={inputClasses}>
            {#each options as option}
                {#if typeof option === "string"}
                    <DropdownItem value={option} text={option} />
                {:else}
                    <DropdownItem value={option.value} text={option.text} image={option.image} />
                {/if}
            {/each}
        </Dropdown>
    {:else if type === "editableList"}
        <EditableList classes={inputClasses} />
    {:else if type === "checkbox"}
        <Checkbox
            placeholder={typeof placeholder === "boolean" ? placeholder : false}
            classes={inputClasses}
            text={checkboxText}
            icons={checkboxIcons}
        />
    {:else if type === "textarea"}
        <textarea class="resize-none {inputClasses}" name={id} {id} placeholder={stringPlaceholder}
        ></textarea>
    {:else if type === "custom"}
        {@render children?.()}
    {:else}
        <input class={inputClasses} name={id} {id} {type} placeholder={stringPlaceholder} />
    {/if}
</div>
