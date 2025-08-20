<script lang="ts">
    import { getContext } from "svelte";
    import {
        editableListContextKey,
        type EditableListContext,
        type EditableListItemField,
    } from ".";
    import { slide } from "svelte/transition";
    import ActionButton from "../ActionButton.svelte";

    let {
        index,
        _id,
        fields = $bindable(),
        isDraggable = false,
    }: {
        index: number;
        _id?: string;
        fields: EditableListItemField<any>[];
        isDraggable?: boolean;
    } = $props();

    const editableList: EditableListContext = getContext(editableListContextKey);
    let fieldGroups: EditableListItemField<any>[][] = $derived.by(() => {
        const groups: EditableListItemField<any>[][] = [];

        fields.forEach((field) => {
            if (!groups[field.position.group]) groups[field.position.group] = [];

            groups[field.position.group].splice(field.position.index, 0, field);
        });

        return groups;
    });
    let draggable: boolean = $derived(isDraggable && editableList.dragging.isDraggable);
</script>

<li
    style:cursor={draggable ? "move" : undefined}
    {draggable}
    ondragstart={() => {
        editableList.dragging.current = index;
    }}
    ondragend={() => {
        editableList.dragging.current = null;
        editableList.dragging.over = null;
    }}
    ondragover={(event: MouseEvent) => {
        event.preventDefault(); // Hide the not allowed cursor when dragging
        editableList.dragging.over = index;
    }}
    in:slide={{ axis: "y" }}
>
    <div
        class={[
            "container-primary flex flex-col gap-3 transition-all",
            editableList.dragging.current && "border-focus border border-dashed",
        ]}
    >
        <div class="flex items-center justify-between px-3">
            <p class="text-lg font-semibold">#{index + 1}</p>

            <div class="flex-center gap-3">
                {#each editableList.buttons as { text, image, onclick }}
                    <ActionButton
                        {text}
                        {image}
                        onclick={() => {
                            onclick({ index, _id, fields, isDraggable });
                        }}
                    />
                {/each}
            </div>
        </div>

        <div class="flex-center w-full grow flex-wrap gap-3">
            {#each fieldGroups as group}
                <div class="row flex-nowrap items-start">
                    {#each group as { Component, _id: fieldID, properties }}
                        <Component
                            bind:value={
                                fields[fields.findIndex(({ _id }) => _id === fieldID)].value
                            }
                            {...properties}
                        />
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</li>
