<script module lang="ts">
    export function GetFormInputValue(inputContainer: HTMLElement): ({
        [key: string]: any;
        _id?: string;
    } | null)[] {
        const editableList: HTMLElement = inputContainer.querySelector(
            "[data-input]"
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
        type ItemActionButton,
        type ItemProperty,
        type ListItem,
    } from "./EditableListItem.svelte";
    import { onMount, type Component } from "svelte";
    import { twMerge } from "tailwind-merge";

    let {
        labelID,
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
                onClick: onDeleteClicked,
            },
        ],
        items = [],
        isDraggable = false,
        addText = "Add item",
        ItemComponent = EditableListItem,
    }: {
        labelID?: string;
        classes?: string;
        startingItems?: number;
        properties?: ItemProperty[];
        actionButtons?: ItemActionButton[];
        items?: { _id: string; properties: ItemProperty[] }[];
        addText?: string;
        isDraggable?: boolean;
        ItemComponent?: Component<{ index: number } & any, {}, "properties">;
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
    function addItem(_id: string | null = null, itemProperties: ItemProperty[] = properties) {
        let actionButtonsClone: ItemActionButton[] | null = [...actionButtons];

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
    function onDeleteClicked(event: MouseEvent) {
        const editableListItem: HTMLDivElement = (event.target as HTMLElement).closest(
            "[data-editableListItem]"
        ) as HTMLDivElement;

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

<div class={twMerge("space-y-5", classes)} aria-labelledby={labelID} data-input>
    <ol class="relative space-y-5">
        {#each actualItems as { _listID, _id, actionButtons }}
            <!--The `li` element is used for the dragging features.-->
            <li
                class="transition-all {isDraggable ? 'cursor-move' : ''} {draggingID === _listID
                    ? 'rotate-1 opacity-45'
                    : draggingID !== -1
                      ? '[&>[data-editableListItem]]:border-focus! [&>[data-editableListItem]]:border! [&>[data-editableListItem]]:border-dashed!'
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
