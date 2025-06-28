<script lang="ts">
    import { getContext } from "svelte";
    import {
        editableListContextKey,
        type EditableListContext,
        type EditableListItemProperties,
        type EditableListItemField,
    } from ".";
    import { slide } from "svelte/transition";

    let {
        index,
        id,
        fields = [],
        isDraggable = false,
    }: {
        index: number;
        id?: string;
        fields: EditableListItemProperties["fields"];
        isDraggable?: boolean;
    } = $props();

    const editableList: EditableListContext = getContext(editableListContextKey);
    let value: Record<string, unknown> = $state(
        fields
            .filter((field) => {
                return field.value !== undefined && field.value !== null;
            })
            .reduce(
                (acc, field) => {
                    acc[field.id] = field.value;
                    return acc;
                },
                {} as Record<string, unknown>
            )
    );
    let fieldGroups: EditableListItemField[][] = $derived.by(() => {
        const groups: EditableListItemField[][] = [];

        fields.forEach((field) => {
            if (!groups[field.position.group]) groups[field.position.group] = [];

            groups[field.position.group].splice(field.position.index, 0, field);
        });

        return groups;
    });
    let draggable: boolean = $derived(isDraggable && editableList.dragging.isDraggable);

    $effect(() => {
        editableList.setValue(index, value);
    });
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
                {#each editableList.buttons as { image, text, onClick }}
                    <button
                        type="button"
                        onclick={() => {
                            onClick({
                                index,
                                id,
                                fields,
                                isDraggable,
                            });
                        }}
                        aria-labelledby={text}
                    >
                        {#if typeof image === "string"}
                            <img class="size-6" src={image} alt={text} />
                        {:else}
                            <image.Component class="size-6" {...image.properties} />
                        {/if}
                    </button>
                {/each}
            </div>
        </div>

        <div class="flex-center w-full grow flex-wrap gap-3">
            {#each fieldGroups as group}
                <div class="row">
                    {#each group as { Input, id: fieldID, properties }}
                        <Input {id} bind:value={value[fieldID]} {...properties} />
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</li>
