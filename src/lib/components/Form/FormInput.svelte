<script lang="ts">
    import { twMerge } from "tailwind-merge";

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
        type:
            | "text"
            | "file"
            | "email"
            | "radio"
            | "checkbox"
            | "select"
            | "number"
            | "checkbox"
            | "textarea"
            | "password";
        placeholder?: string;
        value?: string | number;
        classes?: string;
        options?: Array<string>;
    } = $props();

    const inputClasses: string = twMerge("primary peer w-full text-lg", classes);
</script>

<div class="w-full space-y-1">
    {#if label}
        <label class="text-light cursor-text select-none pl-3" for={id}>{label}</label>
    {/if}

    {#if type === "select"}
        <select class={inputClasses} name={id} {id}>
            {#each options as option}
                <option value={option}>{option}</option>
            {/each}
        </select>
    {:else if type === "textarea"}
        <textarea class="resize-none {inputClasses}" name={id} {id} {placeholder} {value}
        ></textarea>
    {:else}
        <input class={inputClasses} name={id} {id} {type} {placeholder} {value} />
    {/if}
</div>
