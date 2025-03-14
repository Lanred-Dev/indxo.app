<script lang="ts">
    import { type Component } from "svelte";
    import { twMerge } from "tailwind-merge";
    import type { props as DropdownItemProps } from "./DropdownItem.svelte";
    import DropdownItem from "./DropdownItem.svelte";
    import { fly } from "svelte/transition";
    import { goto } from "$app/navigation";

    let {
        classes,
        visible = $bindable(false),
        items = [],
        value = $bindable(),
        ItemComponent = DropdownItem,
    }: {
        classes?: string;
        visible?: boolean;
        items?: DropdownItemProps[];
        value?: string;
        ItemComponent?: Component<DropdownItemProps, {}, "">;
    } = $props();

    let { text, image }: DropdownItemProps = $derived(
        items.find((item, index) => {
            if (typeof value === "string" && value.length > 0) return item.value === value;

            return index === 0;
        }) ?? { value: "" }
    );

    /**
     * Handles when a dropdown item is clicked and updates the current value.
     *
     * @param value The value of the clicked item.
     * @returns never
     */
    function onItemClicked({ isLink, value: newValue }: DropdownItemProps) {
        if (isLink) goto(newValue);

        value = newValue;
        visible = false;
    }
</script>

<div class={twMerge("dropdown relative min-w-fit text-lg", classes)} data-value={value}>
    <button class="input-primary" onclick={() => (visible = !visible)} type="button">
        {#if image}
            <img class="size-7" src={image} alt={text} />
        {/if}

        {#if text}
            <span class="text-nowrap">{text}</span>
        {/if}

        <img
            class="ml-0.5 size-4"
            src="/icons/general/{visible ? 'UpChevron' : 'DownChevron'}.svg"
            alt="Arrow {visible ? 'up' : 'down'}"
        />
    </button>

    {#if visible}
        <div
            class="container-popup top-full mt-1 w-56 !p-1"
            transition:fly={{ y: 10, duration: 100 }}
        >
            <ul>
                {#each items as item}
                    <li class="w-full">
                        <button
                            class="button-navigation !py-1"
                            role="menuitem"
                            onclick={() => onItemClicked(item)}
                            type="button"
                        >
                            <ItemComponent {...item} />
                        </button>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</div>
