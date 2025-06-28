<script lang="ts">
    import { getContext, onMount, type Component, type Snippet } from "svelte";
    import { formContextKey, type FormContext } from ".";
    import type { ClassValue } from "svelte/elements";

    let {
        id,
        label,
        value: defaultValue,
        properties,
        isRequired = false,
        stage,
        class: className,
        Component,
        children,
    }: {
        id: string;
        label?: string;
        value: unknown;
        properties?: Record<string, unknown>;
        Component: Component<any>;
        class?: ClassValue;
        stage?: string;
        isRequired?: boolean;
        children?: Snippet<[]>;
    } = $props();

    const form: FormContext = getContext(formContextKey);
    let uid: string = $props.id();
    let value: any = $state.raw(defaultValue);

    onMount(() => form.registerField(id, value, isRequired, label));

    $effect(() => {
        form.fields.set(id, { value, label });
    });
</script>

{#if !stage || stage === form.stage}
    <div class="flex flex-col gap-y-0.5 {className}">
        {#if label}
            <label class="text-light block pl-4 font-light" for={uid} id="{uid}-{id}"
                >{label}{isRequired ? "*" : ""}</label
            >
        {/if}

        <div>
            <Component {id} aria-labeledby="{uid}-{id}" {defaultValue} bind:value {...properties}>
                {@render children?.()}
            </Component>
        </div>
    </div>
{/if}
