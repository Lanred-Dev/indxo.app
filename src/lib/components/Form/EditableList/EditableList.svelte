<script module lang="ts">
    export function getEditableListFormInputValue(inputContainer: HTMLElement): ({
        [key: string]: any;
        _id?: string;
    } | null)[] {
        const editableList: HTMLElement = inputContainer.querySelector(
            ".EditableList"
        ) as HTMLElement;
        const listItems: NodeListOf<HTMLElement> =
            editableList.querySelectorAll(".EditableListItem")!;
        const listData: ({
            [key: string]: any;
            _id?: string;
        } | null)[] = [];

        for (const item of listItems) {
            const listID: number = parseInt(item.getAttribute("data-listID")!);
            let value: {
                [key: string]: any;
                _id?: string;
            } | null = null;

            // Only parse the value if it has data
            if (item.getAttribute("data-hasValue") === "true") {
                value = JSON.parse(item.getAttribute("data-value") ?? "{}");
                value!._id = item.getAttribute("data-id") ?? undefined;
            }

            listData[listID] = value;
        }

        // Remove any null or undefined items from the list
        return listData.filter((item) => item);
    }
</script>

<script lang="ts">
    import EditableListItem, {
        type ActionButton,
        type ItemProperty,
        type ListItem,
    } from "./EditableListItem.svelte";
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";

    let {
        labelID,
        startingItems = 1,
        properties = [],
        actionButtons = [
            {
                icon: "/icons/general/Trash.svg",
                text: "Delete",
                onClick: deleteItem,
            },
        ],
        items = [],
        isDraggable = false,
        addText = "Add item",
    }: {
        labelID?: string;
        startingItems?: number;
        properties?: ItemProperty[];
        actionButtons?: ActionButton[];
        items?: { _id: string; properties: { [id: string]: string } }[];
        addText?: string;
        isDraggable?: boolean;
    } = $props();

    let actualItems: ListItem[] = $state([]);
    // NOTE: -1 is used to indicate that no item is being dragged
    let draggingID: number = $state.raw(-1);
    let draggingOverID: number = $state.raw(-1);

    /**
     * Adds an item to the list.
     *
     * @returns never
     */
    function addItem(id?: string, itemProperties: ItemProperty[] = properties) {
        actualItems.push({
            _listID: actualItems.length,
            _id: id,
            properties: itemProperties,
            actionButtons,
        });
    }

    /**
     * Handles when a list item's delete button is clicked and removes the item from the list.
     *
     * @param event The click event.
     * @returns never
     */
    function deleteItem(event: MouseEvent) {
        const editableListItem: HTMLDivElement = (event.target as HTMLElement).closest(
            ".EditableListItem"
        ) as HTMLDivElement;
        const listID: number = parseInt(editableListItem.getAttribute("data-listID")!);
        actualItems.splice(listID, 1);
        actualItems.forEach((item, index) => {
            item._listID = index;
        });
    }

    /**
     * Moves an item in the list from one position to another.
     *
     * @param from The index of the item to move.
     * @param to The index to move the item to.
     * @returns never
     */
    function moveItem(from: number, to: number) {
        if (from === to) return;

        [actualItems[from], actualItems[to]] = [actualItems[to], actualItems[from]];
        actualItems[from]._listID = from;
        actualItems[to]._listID = to;
    }

    $effect(() => {
        if (
            !isDraggable ||
            draggingID === -1 ||
            draggingOverID === -1 ||
            draggingID === draggingOverID
        )
            return;

        moveItem(draggingID, draggingOverID);
        draggingID = draggingOverID;
    });

    onMount(() => {
        if (isDraggable) {
            actionButtons.unshift({
                icon: "/icons/general/UpChevron.svg",
                text: "Move up",
                onClick: (event: MouseEvent) => {
                    const editableListItem: HTMLDivElement = (event.target as HTMLElement).closest(
                        ".EditableListItem"
                    ) as HTMLDivElement;
                    const listID: number = parseInt(editableListItem.getAttribute("data-listID")!);
                    moveItem(listID, Math.max(listID - 1, 0));
                },
            });

            actionButtons.unshift({
                icon: "/icons/general/DownChevron.svg",
                text: "Move down",
                onClick: (event: MouseEvent) => {
                    const editableListItem: HTMLDivElement = (event.target as HTMLElement).closest(
                        ".EditableListItem"
                    ) as HTMLDivElement;
                    const listID: number = parseInt(editableListItem.getAttribute("data-listID")!);
                    moveItem(listID, Math.min(listID + 1, actualItems.length - 1));
                },
            });
        }

        if (items.length > 0) {
            items.forEach(({ _id, properties: itemProperties }) => {
                addItem(
                    _id,
                    Object.entries(itemProperties).map(([_id, value]) => {
                        const { placeholder, type }: ItemProperty = properties.find(
                            (property) => property._id === _id
                        )!;

                        return {
                            _id,
                            value,
                            placeholder,
                            type,
                        };
                    })
                );
            });
        } else {
            // Add the requested number of items to start with
            for (let index: number = 0; index < startingItems; index++) addItem();
        }
    });
</script>

<div class="EditableList space-y-5" aria-labelledby={labelID}>
    <ol class="relative space-y-5">
        {#each actualItems as { _listID, _id, actionButtons }}
            <li
                class="transition-all {isDraggable ? 'cursor-move' : ''} {draggingID === _listID
                    ? 'rotate-1 opacity-45'
                    : draggingID !== -1
                      ? '[&>.EditableListItem]:border-focus! [&>.EditableListItem]:border! [&>.EditableListItem]:border-dashed!'
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
                    // Calling `preventDefault` hides the not allowed cursor when dragging
                    event.preventDefault();

                    draggingOverID = _listID;
                }}
                in:slide={{ axis: "y" }}
            >
                <EditableListItem
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
        {addText}
    </button>
</div>
