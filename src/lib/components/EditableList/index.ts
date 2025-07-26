import type { Component, ComponentProps } from "svelte";
import type ActionButton from "../ActionButton.svelte";
import type Item from "./Item.svelte";

export { default as EditableListContent } from "./Content.svelte";
export { default as EditableListAddItemButton } from "./Controls/AddItem.svelte";
export { default as EditableListControls } from "./Controls/Controls.svelte";
export { default as EditableList } from "./EditableList.svelte";
export { default as EditableListItem } from "./Item.svelte";

export enum DefaultEditableListItemButton {
    delete = "delete",
    moveUp = "moveUp",
    moveDown = "moveDown",
}

export interface EditableListItemField<C extends Component = Component> {
    _id: string;
    Component: C;
    value?: unknown;
    properties?: ComponentProps<C>;
    position: {
        group: number;
        index: number;
    };
}

export interface EditableListContext {
    dragging: {
        isDraggable: boolean;
        current: number | null;
        over: number | null;
    };
    items: ComponentProps<typeof Item>[];
    buttons: ComponentProps<typeof ActionButton>[];
    addItem: () => void;
    deleteItem: (index: number) => void;
    moveItem: (from: number, to: number) => void;
}

export let editableListContextKey: Symbol = Symbol("editableListContextKey");
