<script lang="ts">
    import { getContext, onMount, type Component, type Snippet } from "svelte";
    import { formContextKey, type FormContext } from ".";
    import type { ClassValue } from "svelte/elements";

    let {
        id,
        label,
        inputProperties = {},
        Input,
        children,
        optional = false,
        ...properties
    }: {
        id: string;
        label?: string;
        inputProperties?: Record<string, unknown>;
        Input: Component<any>;
        children?: Snippet<[]>;
        class?: ClassValue;
        optional?: boolean;
    } = $props();

    const formContext: FormContext = getContext(formContextKey);
    let uid: string = $props.id();
    const defaultValue: any = inputProperties.value ?? inputProperties.placeholder;
    // NOTE: This prevents an error where value is undefined during component initialization (props_invalid_value).
    let value: any = $state.raw(typeof defaultValue === "string" ? "" : defaultValue);

    onMount(() => formContext().registerValue(id, value, optional, label));

    $effect(() => {
        formContext().fieldValues.set(id, { value, label });
    });
</script>

<div class="flex flex-col gap-y-0.5 {properties.class}">
    {#if label}
        <label class="text-light block pl-4 font-light" for={uid} id="{uid}-{id}"
            >{label}{!optional ? "*" : ""}</label
        >
    {/if}

    <div>
        <Input
            {id}
            aria-labeledby="{uid}-{id}"
            defaultValue={value}
            bind:value
            {...inputProperties}
        >
            {@render children?.()}
        </Input>
    </div>
</div>
