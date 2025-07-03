<script lang="ts">
    import { getContext } from "svelte";
    import { dropdownContextKey, type DropdownContext } from ".";
    import { PopupTrigger } from "../Popup";
    import Chevron, { ChevronState } from "../Chevron.svelte";

    const dropdown: DropdownContext = getContext(dropdownContextKey);
</script>

<PopupTrigger class="input-primary" aria-controls={dropdown.uid} aria-haspopup="listbox">
    <div class="flex" style:width="{dropdown.largestContentWidth}px">
        {@render dropdown.value.children()}
    </div>

    <Chevron class="size-4" state={dropdown.isVisible ? ChevronState.up : ChevronState.down} />
</PopupTrigger>
