<script lang="ts">
    import BasicItem from "./BasicItem.svelte";
    import { onMount, type Component } from "svelte";
    import { twMerge } from "tailwind-merge";

    let {
        classes,
        startingItems = 1,
        properties = { name: "", description: "" },
        ListComponent = BasicItem,
        addText = "Add item",
    }: {
        classes?: string;
        startingItems?: number;
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

    onMount(() => {
        for (let index: number = 0; index < startingItems; index++) {
            addItem();
        }
    });
</script>

<div class={twMerge("editableList space-y-10", classes)}>
    {#each items as item, index (item.id)}
        <div class="editableListItem">
            <ListComponent {index} {...properties} />
        </div>
    {/each}

    <button onclick={addItem} type="button">{addText}</button>
</div>
