<script lang="ts">
    import { getContext } from "svelte";
    import {
        editableListContextKey,
        type EditableListContext,
        type EditableListItemField,
    } from ".";
    import { slide } from "svelte/transition";
    import ActionButton from "$lib/components/ActionButton.svelte";

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
    let Content: HTMLDivElement;
    let Container: HTMLLIElement;
    let mousePosition: { x: number; y: number } = { x: 0, y: 0 };
    let isTrackingMovement: boolean = false;

    function handleMouseMove(event: MouseEvent) {
        event.preventDefault();

        if (event.clientX === 0 && event.clientY === 0) return;

        mousePosition.x = event.clientX;
        mousePosition.y = event.clientY;
    }

    function updateContentPosition() {
        if (!isTrackingMovement) return;

        Content.style.left = `${mousePosition.x}px`;
        Content.style.top = `${mousePosition.y}px`;

        requestAnimationFrame(updateContentPosition);
    }

    // There is most definitely a better way to do this but honestly it works and doesnt hurt anything so who cares
    $effect(() => {
        const isCurrentlyDragging = draggable && editableList.dragging.current === index;

        if (isCurrentlyDragging && !isTrackingMovement) {
            isTrackingMovement = true;

            Container.style.width = `${Container.offsetWidth}px`;
            Container.style.height = `${Container.offsetHeight}px`;

            Content.style.position = "fixed";
            Content.style.pointerEvents = "none";
            Content.style.zIndex = "9999";
            Content.style.transform = "translate(-50%, -50%)";
            Content.style.width = `${Container.offsetWidth}px`;
            Content.style.height = `${Container.offsetHeight}px`;

            window.addEventListener("dragover", handleMouseMove);
            requestAnimationFrame(updateContentPosition);
        } else if (!isCurrentlyDragging && isTrackingMovement) {
            isTrackingMovement = false;
            window.removeEventListener("dragover", handleMouseMove);

            Container.style.width = "";
            Container.style.height = "";
            Content.style.position = "";
            Content.style.pointerEvents = "";
            Content.style.zIndex = "";
            Content.style.transform = "";
            Content.style.width = "";
            Content.style.height = "";
        }

        return () => {
            if (isTrackingMovement) window.removeEventListener("dragover", handleMouseMove);
        };
    });
</script>

<li
    class="w-full"
    style:cursor={draggable ? "move" : undefined}
    {draggable}
    ondragstart={(event) => {
        editableList.dragging.current = index;
        event.dataTransfer?.setDragImage(new Image(), 0, 0); // Hide the default drag image
    }}
    ondragend={() => {
        editableList.dragging.current = null;
        editableList.dragging.over = null;
    }}
    ondragover={(event) => {
        event.preventDefault();
        editableList.dragging.over = index;
    }}
    in:slide={{ axis: "y" }}
    bind:this={Container}
>
    <div
        class={[
            "container-primary flex flex-col gap-3 transition-colors",
            editableList.dragging.current !== null && "border-attention border border-dashed",
            editableList.dragging.current === index && "shadow-2xl",
        ]}
        bind:this={Content}
    >
        <div class="flex items-center justify-between px-3">
            <p class="text-lg font-semibold">#{index + 1}</p>

            <div class="flex-center gap-3">
                {#each editableList.buttons as { text, image, onclick }}
                    <ActionButton
                        {text}
                        {image}
                        onclick={() => onclick({ index, _id, fields, isDraggable })}
                    />
                {/each}
            </div>
        </div>

        <div class="flex-center w-full grow flex-wrap gap-3">
            {#each fieldGroups as group}
                <div class="row items-start md:flex-nowrap">
                    {#each group as field}
                        <field.Component
                            bind:value={fields[fields.findIndex((f) => f._id === field._id)].value}
                            {...field.properties}
                        />
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</li>
