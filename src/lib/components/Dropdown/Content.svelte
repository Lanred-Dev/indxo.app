<script lang="ts">
    import { getContext, onMount } from "svelte";
    import { dropdownContextKey, type DropdownContext, type DropdownItemProperties } from ".";
    import { PopupAlignment, PopupContent } from "$lib/components/Popup";
    import Item from "./Item.svelte";

    let {
        items = [],
    }: {
        items: DropdownItemProperties[];
    } = $props();

    const dropdownContext: DropdownContext = getContext(dropdownContextKey);
    onMount(() => items.forEach((item) => dropdownContext().registerItem(item)));
</script>

<PopupContent class="min-w-fit p-1!" alignment={PopupAlignment.left}>
    <ul
        role="listbox"
        id={dropdownContext().uid}
        style:width="{dropdownContext().longestTextWidth * 2.5}px"
    >
        {#each items as item (item.value)}
            <Item {...item} />
        {/each}
    </ul>
</PopupContent>
