<script lang="ts">
    import { type Component } from "svelte";
    import { twMerge } from "tailwind-merge";
    import type { props as DropdownItemProps } from "./DropdownItem.svelte";
    import DropdownItem from "./DropdownItem.svelte";
    import { fly } from "svelte/transition";

    let {
        classes,
        visible = $bindable(false),
        items = [],
        currentValue = $bindable(items[0] ?? { value: "" }),
        ItemComponent = DropdownItem,
    }: {
        classes?: string;
        visible?: boolean;
        items?: DropdownItemProps[];
        currentValue?: DropdownItemProps;
        ItemComponent?: Component<DropdownItemProps, {}, "">;
    } = $props();

    /**
     * Handles when a dropdown item is clicked and updates the current value.
     *
     * @param value The value of the clicked item.
     * @returns never
     */
    function onItemClicked(value: DropdownItemProps) {
        currentValue = value;
        visible = false;
    }
</script>

<div class={twMerge("dropdown relative text-lg", classes)} data-value={currentValue.value}>
    <button
        class="input-primary relative flex items-center gap-1 {!currentValue.text &&
        currentValue.image
            ? '!p-2'
            : ''}"
        onclick={() => (visible = !visible)}
        type="button"
    >
        {#if currentValue.image}
            <img class="size-7" src={currentValue.image} alt={currentValue.text} />
        {/if}

        {#if currentValue.text}
            <span class="text-nowrap">{currentValue.text}</span>
        {/if}

        <img
            class="ml-0.5 size-4"
            src="/icons/general/{visible ? 'UpChevron' : 'DownChevron'}.svg"
            alt="Arrow {visible ? 'up' : 'down'}"
        />
    </button>

    {#if visible}
        <div class="popup top-full mt-1 w-56 !p-1" transition:fly={{ y: 10, duration: 100 }}>
            <ul>
                {#each items as item}
                    <li class="w-full">
                        <button
                            class="navigation-primary !py-1"
                            role="menuitem"
                            onclick={() => onItemClicked(item)}
                        >
                            <ItemComponent {...item} />
                        </button>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</div>
