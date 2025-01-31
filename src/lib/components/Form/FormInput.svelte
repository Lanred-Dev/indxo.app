<script lang="ts">
    import { Dropdown, DropdownItem } from "$lib/components/Dropdown";
    import { twMerge } from "tailwind-merge";
    import type { props as DropdownItemProps } from "../Dropdown/DropdownItem.svelte";

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
        | "password";

    let {
        id,
        label,
        type,
        placeholder,
        value,
        classes,
        options = [],
    }: {
        id: string;
        label?: string;
        type: inputType;
        placeholder?: string | DropdownItemProps;
        value?: string | number;
        classes?: string;
        options?: Array<string> | Array<{ value: string; text?: string; image?: string }>;
    } = $props();

    const stringPlaceholder: string | undefined =
        typeof placeholder === "string" ? placeholder : undefined;
    const inputClasses: string = twMerge(
        `${type !== "dropdown" ? "primary" : ""} w-full text-lg`,
        classes
    );
</script>

<div
    class="formInput space-y-1 {type === 'dropdown' ? 'w-fit' : 'w-full'}"
    data-type={type}
    data-id={id}
>
    {#if label}
        <label class="text-light cursor-text select-none pl-3" for={id}>{label}</label>
    {/if}

    {#if type === "dropdown"}
        <Dropdown placeholder={options[0]} classes={inputClasses} {id}>
            {#each options as option}
                {#if typeof option === "string"}
                    <DropdownItem value={option} text={option} />
                {:else}
                    <DropdownItem value={option.value} text={option.text} image={option.image} />
                {/if}
            {/each}
        </Dropdown>
    {:else if type === "textarea"}
        <textarea
            class="resize-none {inputClasses}"
            name={id}
            {id}
            placeholder={stringPlaceholder}
            {value}
        ></textarea>
    {:else}
        <input class={inputClasses} name={id} {id} {type} placeholder={stringPlaceholder} {value} />
    {/if}
</div>
