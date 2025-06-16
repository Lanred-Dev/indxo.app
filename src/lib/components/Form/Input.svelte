<script lang="ts">
    import { getContext, type Component, type Snippet } from "svelte";
    import { formContextKey, type FormContext } from ".";

    let {
        id,
        label,
        properties = {},
        Input,
        children,
    }: {
        id: string;
        label?: string;
        properties?: Record<string, unknown>;
        Input: Component<any>;
        children?: Snippet<[]>;
    } = $props();

    const formContext: FormContext = getContext(formContextKey);
    let uid: string = $props.id();
    let value: any = $state(properties.value);
    let inputWidth: number = $state.raw(0);

    $effect(() => {
        formContext().fields[id] = value;
    });
</script>

<div>
    {#if label}
        <label
            class="text-light mb-0.5 block overflow-x-hidden pl-3 font-light text-nowrap text-ellipsis"
            style:width="{inputWidth}px"
            for={uid}
            id="{uid}-{id}">{label}</label
        >
    {/if}

    <div class="w-fit" bind:clientWidth={inputWidth}>
        <Input {id} aria-labeledby="{uid}-{id}" defaultValue={value} bind:value {...properties}>
            {@render children?.()}
        </Input>
    </div>
</div>
