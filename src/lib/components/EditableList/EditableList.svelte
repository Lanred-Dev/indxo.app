<script lang="ts">
    import BasicItem from "./BasicItem.svelte";
    import type { Component } from "svelte";
    import { twMerge } from "tailwind-merge";

    let {
        classes,
        properties = { name: "", description: "" },
        ListComponent = BasicItem,
        addText = "Add item",
    }: {
        classes?: string;
        properties?: { [key: string]: any };
        ListComponent?: Component<{ index: number } & any, {}, "">;
        addText?: string;
    } = $props();

    let items: { id: number; [key: string]: any }[] = $state([]);

    /**
     * Adds an item to the list.
     *
     * @returns never
     */
    function addItem() {
        items.push({
            id: items.length,
            ...properties,
        });
    }
</script>

<div class={twMerge("editableList space-y-10", classes)}>
    {#each items as item, index (item.id)}
        <div class="editableListItem">
            <ListComponent {index} {...properties} />
        </div>
    {/each}

    <button onclick={addItem}>{addText}</button>
</div>
