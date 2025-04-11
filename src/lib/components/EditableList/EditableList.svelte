<script lang="ts">
    import EditableListItem, {
        type actionButton,
        type item,
        type property,
    } from "./EditableListItem.svelte";
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
        items = [],
        isDraggable = false,
        addText = "Add item",
        ItemComponent = EditableListItem,
    }: {
        classes?: string;
        startingItems?: number;
        properties?: property[];
        actionButtons?: actionButton[];
        items?: { _id: string; properties: property[] }[];
        addText?: string;
        isDraggable?: boolean;
        ItemComponent?: Component<{ index: number } & any, {}, "properties">;
    } = $props();

    let actualItems: item[] = $state([]);
    // NOTE: -1 is used to indicate that no item is being dragged
    let draggingID: number = $state.raw(-1);
    let draggingOverID: number = $state.raw(-1);

    /**
     * Adds an item to the list.
     *
     * @returns never
     */
    function addItem(_id: string | null = null, itemProperties: property[] = properties) {
        let actionButtonsClone: actionButton[] | null = [...actionButtons];

        if (isDraggable) {
            if (!Array.isArray(actionButtonsClone)) actionButtonsClone = [];

            // Adding it at the start of the array ensures the order of the buttons stays correct
            actionButtonsClone.unshift({
                isActualButton: false,
                classes: "cursor-move",
                image: ["/icons/general/Drag.svg", "Drag"],
            });
        }

        actualItems.push({
            _listID: actualItems.length,
            _id: _id ?? undefined,
            properties: itemProperties,
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

        const listID: number = parseInt(editableListItem.getAttribute("data-listID")!);
        actualItems.splice(listID, 1);

        actualItems.forEach((item, index) => {
            item._listID = index;
        });
    }

    $effect(() => {
        if (
            !isDraggable ||
            draggingID === -1 ||
            draggingOverID === -1 ||
            draggingID === draggingOverID
        )
            return;

        [actualItems[draggingID], actualItems[draggingOverID]] = [
            actualItems[draggingOverID],
            actualItems[draggingID],
        ];
        actualItems[draggingID]._listID = draggingID;
        actualItems[draggingOverID]._listID = draggingOverID;
        draggingID = draggingOverID;
    });

    onMount(() => {
        if (items.length > 0) {
            items.forEach(({ _id, properties }) => {
                addItem(_id, properties);
            });
        } else {
            // Add the requested number of items to start with
            for (let index: number = 0; index < startingItems; index++) addItem();
        }
    });
</script>

<div class={twMerge("editableList space-y-5", classes)}>
    <ol class="relative space-y-5">
        {#each actualItems as { _listID, _id, actionButtons }}
            <!--The `li` element is used for the dragging features.-->
            <li
                class="transition-all {isDraggable ? 'cursor-move' : ''} {draggingID === _listID
                    ? 'rotate-1 opacity-45'
                    : draggingID !== -1
                      ? '[&>.editableListItem]:border! [&>.editableListItem]:border-dashed! [&>.editableListItem]:border-focus!'
                      : ''}"
                draggable={isDraggable}
                ondragstart={() => {
                    draggingID = _listID;
                }}
                ondragend={() => {
                    draggingID = -1;
                    draggingOverID = -1;
                }}
                ondragover={(event: MouseEvent) => {
                    // Preventing the default hides the not allowed cursor when dragging
                    event.preventDefault();

                    draggingOverID = _listID;
                }}
            >
                <ItemComponent
                    {_listID}
                    {_id}
                    bind:properties={actualItems[_listID].properties}
                    {actionButtons}
                />
            </li>
        {/each}
    </ol>

    <button class="button-attention w-full" onclick={() => addItem()} type="button">
        <img src="/icons/general/Plus.svg" alt="Plus" />
        <span>{addText}</span>
    </button>
</div>
