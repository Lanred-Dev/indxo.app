<script lang="ts">
    import { setContext, type Snippet } from "svelte";
    import {
        DefaultEditableListItemButton,
        editableListContextKey,
        type EditableListContext,
        type EditableListItemProperties,
        type EditableListItemButton,
    } from ".";
    import Chevron, { ChevronState } from "../Chevron.svelte";

    let {
        value: values = $bindable([]),
        buttons,
        children,
        addItem,
    }: {
        value?: Record<string, unknown>[];
        buttons?: (EditableListItemButton | DefaultEditableListItemButton)[];
        children: Snippet<[]>;
        addItem: (index: number, value?: Record<string, unknown>) => EditableListItemProperties;
    } = $props();

    let items: EditableListItemProperties[] = $state(
        values.map((value, index) => addItem(index, value))
    );
    let currentDraggingID: number | null = $state.raw(null);
    let draggingOverID: number | null = $state.raw(null);
    let isDraggable: boolean = $state.raw(true);

    const defaultButtons: { [key in DefaultEditableListItemButton]: EditableListItemButton } = {
        [DefaultEditableListItemButton.delete]: {
            image: "/icons/general/Trash.svg",
            text: "Delete",
            onClick: ({ index }) => {
                deleteItem(index);
            },
        },
        [DefaultEditableListItemButton.moveUp]: {
            image: {
                Component: Chevron,
                properties: {
                    state: ChevronState.up,
                },
            },
            text: "Move Up",
            onClick: ({ index }) => {
                moveItem(index, Math.max(index - 1, 0));
            },
        },
        [DefaultEditableListItemButton.moveDown]: {
            image: {
                Component: Chevron,
                properties: {
                    state: ChevronState.down,
                },
            },
            text: "Move Down",
            onClick: ({ index }) => {
                moveItem(index, Math.min(index + 1, items.length - 1));
            },
        },
    };

    /**
     * Moves an item in the list from one position to another.
     *
     * @param from
     * @param to
     */
    function moveItem(from: number, to: number) {
        if (from === to) return;

        [items[from], items[to]] = [items[to], items[from]];
        items[from].index = from;
        items[to].index = to;
    }

    /**
     * Deletes an item from the list by its index.
     *
     * @param index
     */
    function deleteItem(index: number) {
        items.splice(index, 1);
        items.forEach((item, newIndex) => {
            item.index = newIndex;
        });
    }

    setContext(editableListContextKey, {
        dragging: {
            get isDraggable() {
                return isDraggable;
            },
            get current() {
                return currentDraggingID;
            },
            set current(newValue) {
                currentDraggingID = newValue;
            },
            get over() {
                return draggingOverID;
            },
            set over(newValue) {
                draggingOverID = newValue;
            },
        },
        buttons:
            buttons?.map((button) => {
                if (typeof button === "string") {
                    return defaultButtons[button as DefaultEditableListItemButton];
                }

                return button;
            }) ?? [],
        items,
        addItem: () => items.push(addItem(items.length)),
        deleteItem,
        moveItem,
        setValue: (index: number, value: Record<string, unknown>) => {
            values[index] = value;
        },
    } satisfies EditableListContext);

    $effect(() => {
        if (
            currentDraggingID === null ||
            draggingOverID === null ||
            currentDraggingID === draggingOverID
        )
            return;

        moveItem(currentDraggingID, draggingOverID);
        currentDraggingID = draggingOverID;
    });
</script>

<svelte:window onfocusin={() => (isDraggable = false)} onfocusout={() => (isDraggable = true)} />

<div class="relative">
    {@render children()}
</div>
