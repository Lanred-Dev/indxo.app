<script lang="ts">
    import { getContext } from "svelte";
    import { dropdownContextKey, type DropdownContext } from ".";
    import { PopupTrigger } from "../Popup";

    const dropdownContext: DropdownContext = getContext(dropdownContextKey);
</script>

<PopupTrigger class="input-primary" aria-controls={dropdownContext().uid} aria-haspopup="listbox">
    {#if dropdownContext().currentItem.image}
        <img
            class="size-7"
            src={dropdownContext().currentItem.image}
            alt={dropdownContext().currentItem.text}
        />
    {/if}

    {#if dropdownContext().currentItem.text}
        <span class="text-left text-nowrap" style:width="{dropdownContext().longestTextWidth}px"
            >{dropdownContext().currentItem.text}</span
        >
    {/if}

    <img
        class="size-4"
        src="/icons/general/{dropdownContext().isVisible ? 'UpChevron' : 'DownChevron'}.svg"
        alt="Arrow {dropdownContext().isVisible ? 'up' : 'down'}"
    />
</PopupTrigger>
