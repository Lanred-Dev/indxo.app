<script lang="ts">
    import { onMount, setContext, untrack, type ComponentProps, type Snippet } from "svelte";
    import {
        DefaultEditableListItemButton,
        editableListContextKey,
        EditableListItem,
        type EditableListContext,
        type EditableListItemField,
    } from ".";
    import Chevron, { ChevronState } from "../Icons/Chevron.svelte";
    import ActionButton from "../ActionButton.svelte";

    let {
        placeholderItems = 0,
        value = $bindable([]),
        buttons,
        children,
        addItem,
    }: {
        placeholderItems?: number;
        value?: (Record<string, unknown> | undefined)[];
        buttons?: (ComponentProps<typeof ActionButton> | DefaultEditableListItemButton)[];
        children?: Snippet<[]>;
        addItem: (
            index: number,
            value?: Record<string, unknown>
        ) => ComponentProps<typeof EditableListItem>;
    } = $props();

    let items: ComponentProps<typeof EditableListItem>[] = $state(
        value.length > 0
            ? value.map((value, index) => addItem(index, value))
            : [...Array(placeholderItems)].map((_value, index) => addItem(index))
    );
    let currentDraggingID: number | null = $state.raw(null);
    let draggingOverID: number | null = $state.raw(null);
    let isDraggable: boolean = $state.raw(true);

    const defaultButtons: {
        [key in DefaultEditableListItemButton]: ComponentProps<typeof ActionButton>;
    } = {
        [DefaultEditableListItemButton.delete]: {
            image: { url: "/icons/general/Trash.svg" },
            text: "Delete",
            onclick: ({ index }) => {
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
            onclick: ({ index }) => {
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
            onclick: ({ index }) => {
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
        get items() {
            return items;
        },
        addItem: () => items.push(addItem(items.length)),
        deleteItem,
        moveItem,
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

    $effect(() => {
        const newValue = items
            .map(({ _id, fields }) => {
                fields = fields.filter(({ value }) => {
                    let isEmpty: boolean = false;

                    if (typeof value === "string" || Array.isArray(value))
                        isEmpty = value.length === 0;

                    return value !== undefined && value !== null && !isEmpty;
                });

                if (fields.length === 0) return;

                return {
                    _id,
                    ...fields.reduce(
                        (object, { _id, value }) => {
                            object[_id] = typeof value === "string" ? value.trim() : value;
                            return object;
                        },
                        {} as Record<string, unknown>
                    ),
                };
            })
            .filter((item) => item);

        if (JSON.stringify(newValue) !== JSON.stringify(value)) value = newValue;
    });
</script>

<svelte:window onfocusin={() => (isDraggable = false)} onfocusout={() => (isDraggable = true)} />

<div class="relative">
    {@render children?.()}
</div>
