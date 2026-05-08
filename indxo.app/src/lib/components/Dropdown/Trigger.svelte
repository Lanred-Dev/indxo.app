<script lang="ts">
    import { getContext } from "svelte";
    import { dropdownContextKey, type DropdownContext } from ".";
    import { PopupTrigger } from "../Popup";
    import Icon from "../Icon.svelte";

    const dropdown: DropdownContext = getContext(dropdownContextKey);
</script>

<PopupTrigger class="input-primary" aria-controls={dropdown.uid} aria-haspopup="listbox">
    <div class="flex gap-0.5" style:width="{dropdown.largestContentWidth}px">
        {@render dropdown.value.children()}
    </div>

    <Icon
        class="size-4"
        icon={dropdown.isVisible ? "general/Chevrons/Up" : "general/Chevrons/Down"}
    />
</PopupTrigger>
