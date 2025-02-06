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

    let listContainer: HTMLElement;
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

    /**
     * Removes an item from the list.
     *
     * @param id The id of the item to remove.
     * @returns never
     */
    function removeItem(id: number) {
        items = items.filter((item) => item.id !== id);
    }

    /**
     * Handles when a dropdown item is clicked and updates the current value.
     *
     * @param event
     * @returns never
     */
    function itemDeleteClicked(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const editableListItem = target.closest(".editableListItem");

        if (editableListItem) {
            const id: string = editableListItem.getAttribute("data-id")!;
            removeItem(parseInt(id));
        }
    }

    /**
     * Sets up event listeners for the items. Also removes any existing event listeners.
     *
     * @returns never
     */
    function setupEventListeners() {
        removeEventListeners();

        const listItems: NodeListOf<HTMLElement> =
            listContainer.querySelectorAll(".editableListItem")!;

        listItems.forEach((item: HTMLElement) => {
            const deleteButton: HTMLButtonElement = item.querySelector(".deleteButton")!;
            deleteButton.addEventListener("click", itemDeleteClicked);
        });
    }

    /**
     * Removes event listeners from the items.
     *
     * @returns never
     */
    function removeEventListeners() {
        const listItems: NodeListOf<HTMLElement> =
            listContainer.querySelectorAll(".editableListItem")!;

        listItems.forEach((item: HTMLElement) => {
            const deleteButton: HTMLButtonElement = item.querySelector(".deleteButton")!;
            deleteButton.removeEventListener("click", itemDeleteClicked);
        });
    }

    onMount(() => {
        for (let index: number = 0; index < startingItems; index++) {
            addItem();
        }

        setupEventListeners();

        const observer: MutationObserver = new MutationObserver((mutationList) => {
            mutationList.forEach((mutation) => {
                if (mutation.type === "childList") {
                    setupEventListeners();
                }
            });
        });

        observer.observe(listContainer, { childList: true });

        return () => {
            observer.disconnect();
            removeEventListeners();
        };
    });
</script>

<div class={twMerge("editableList space-y-5", classes)} bind:this={listContainer}>
    {#each items as item, index (item.id)}
        <ListComponent {index} {...properties} />
    {/each}

    <button class="primary" onclick={addItem} type="button">{addText}</button>
</div>
