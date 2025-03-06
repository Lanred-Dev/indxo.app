<script lang="ts">
    import EditableListItem, { type actionButton, type property } from "./EditableListItem.svelte";
    import { onMount, type Component } from "svelte";
    import { twMerge } from "tailwind-merge";

    let {
        classes,
        startingItems = 1,
        properties = [
            {
                id: "name",
                type: "input",
                placeholder: "Name",
            },
            {
                id: "description",
                type: "textarea",
                placeholder: "Description",
            },
        ],
        actionButtons = [
            {
                image: ["/icons/general/Trash.svg", "Delete"],
                onClick: onItemDeleteClicked,
            },
        ],
        isDraggable = false,
        addText = "Add item",
        ListComponent = EditableListItem,
    }: {
        classes?: string;
        startingItems?: number;
        properties?: property[];
        actionButtons?: actionButton[];
        ListComponent?: Component<{ index: number } & any, {}, "properties">;
        addText?: string;
        isDraggable?: boolean;
    } = $props();

    let listContainer: HTMLElement;
    let items: { id: number; [key: string]: any }[] = $state([]);
    let draggingElementID: number = $state(-1);
    let draggingOverElementID: number = $state(-1);

    /**
     * Adds an item to the list.
     *
     * @returns never
     */
    function addItem() {
        let actionButtonsClone: actionButton[] | null = [...actionButtons];

        if (isDraggable) {
            if (!Array.isArray(actionButtonsClone)) actionButtonsClone = [];

            // Adding it at the start of the array ensures the order of the buttons stays correct
            actionButtonsClone.unshift({
                classes: "cursor-move",
                image: ["/icons/general/Drag.svg", "Drag"],
                onMouseDown: onDragStart,
                onMouseUp: onDragEnd,
            });
        }

        items.push({
            id: items.length,
            properties: properties,
            actionButtons: actionButtonsClone,
        });
    }

    /**
     * Handles when a list item's delete button is clicked and removes the item from the list.
     *
     * @param event The click event.
     * @returns never
     */
    function onItemDeleteClicked(event: MouseEvent) {
        const editableListItem: HTMLElement = (event.target as HTMLElement).closest(
            ".editableListItem"
        )!;

        if (!editableListItem) return;

        const id: number = parseInt(editableListItem.getAttribute("data-id")!);
        items.splice(id, 1);

        items.forEach((item, index) => {
            item.id = index;
        });
    }

    function onDragStart(event: MouseEvent) {}

    function onDragEnd() {}

    onMount(() => {
        // Add the requested number of items to start with
        for (let index: number = 0; index < startingItems; index++) {
            addItem();
        }
    });
</script>

<div class={twMerge("editableList space-y-5", classes)} bind:this={listContainer}>
    <ol class="space-y-5">
        {#each items as { id, actionButtons }}
            <!--The `li` element is used for MOST of the dragging features. However, if using a custom list component, the `ListComponent` must support action buttons in order for dragging to work!-->
            <li
                class="transition-all {draggingElementID === id
                    ? 'opacity-35'
                    : draggingOverElementID === id
                      ? '[&>.editableListItem]:!border-alert [&>.editableListItem]:!border [&>.editableListItem]:!border-dashed'
                      : ''}"
            >
                <ListComponent {id} bind:properties={items[id].properties} {actionButtons} />
            </li>
        {/each}
    </ol>

    <button class="primary" onclick={addItem} type="button">{addText}</button>
</div>
