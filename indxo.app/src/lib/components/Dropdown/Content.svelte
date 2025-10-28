<script lang="ts">
    import { getContext, type Snippet } from "svelte";
    import { dropdownContextKey, type DropdownContext, type DropdownItem } from ".";
    import { PopupContent } from "$lib/components/Popup";

    let {
        children,
        ...properties
    }: {
        children: Snippet<[]>;
        [key: string]: any;
    } = $props();

    const dropdown: DropdownContext = getContext(dropdownContextKey);
</script>

<PopupContent class="min-w-fit p-1!" {...properties}>
    <ul role="listbox" id={dropdown.uid} style:width="{dropdown.largestContentWidth * 2.5}px">
        {@render children()}
    </ul>
</PopupContent>
