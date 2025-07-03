<script lang="ts">
    import { setContext, type ComponentProps, type Snippet } from "svelte";
    import {
        DefaultEditableListItemButton,
        editableListContextKey,
        EditableListItem,
        type EditableListContext,
        type EditableListItemField,
    } from ".";
    import Chevron, { ChevronState } from "../Chevron.svelte";
    import ActionButton from "../ActionButton.svelte";

    let {
        value: values = $bindable([]),
        buttons,
        children,
        addItem,
    }: {
        value?: Record<string, unknown>[];
        buttons?: (ComponentProps<typeof ActionButton> | DefaultEditableListItemButton)[];
        children?: Snippet<[]>;
        addItem: (
            index: number,
            value?: Record<string, unknown>
        ) => ComponentProps<typeof EditableListItem>;
    } = $props();

    let items: ComponentProps<typeof EditableListItem>[] = $state(
        values.map((value, index) => addItem(index, value))
    );
    let currentDraggingID: number | null = $state.raw(null);
    let draggingOverID: number | null = $state.raw(null);
    let isDraggable: boolean = $state.raw(true);

    const defaultButtons: {
        [key in DefaultEditableListItemButton]: ComponentProps<typeof ActionButton>;
    } = {
        [DefaultEditableListItemButton.delete]: {
            image: "/icons/general/Trash.svg",
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
        setFieldValue: (index: number, fields: EditableListItemField[]) => {
            items[index].fields = fields;
            values[index] = fields
                .filter((field) => {
                    return field.value !== undefined && field.value !== null;
                })
                .reduce(
                    (acc, field) => {
                        acc[field.id] = field.value;
                        return acc;
                    },
                    {} as Record<string, unknown>
                );
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
    {@render children?.()}
</div>
