import type { Component } from "svelte";

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

export interface EditableListItemField {
    id: string;
    Input: Component<any>;
    value?: unknown;
    properties?: Record<string, unknown>;
    position: {
        group: number;
        index: number;
    };
}

export interface EditableListItemButton {
    image: string | { Component: Component<any>; properties?: Record<string, unknown> };
    text: string;
    onClick: (item: EditableListItemProperties) => void;
}

export interface EditableListItemProperties {
    index: number;
    id?: string;
    fields: EditableListItemField[];
    isDraggable?: boolean;
}

export interface EditableListContext {
    dragging: {
        isDraggable: boolean;
        current: number | null;
        over: number | null;
    };
    items: EditableListItemProperties[];
    buttons: EditableListItemButton[];
    addItem: () => void;
    deleteItem: (index: number) => void;
    moveItem: (from: number, to: number) => void;
    setValue: (index: number, value: Record<string, unknown>) => void;
}

export let editableListContextKey: Symbol = Symbol("editableListContextKey");
