<script lang="ts">
    import { getContext } from "svelte";
    import { dropdownContextKey, type DropdownContext, type DropdownItemProperties } from ".";
    import { goto } from "$app/navigation";

    let item: DropdownItemProperties = $props();

    const dropdownContext: DropdownContext = getContext(dropdownContextKey);
    dropdownContext().registerItem(item);
</script>

<li class="w-full">
    <button
        class="button-navigation px-3! py-1.5!"
        role="option"
        type="button"
        aria-selected={dropdownContext().value === item.value}
        onclick={() => {
            if (item.href) return goto(item.href);

            dropdownContext().setValue(item);
        }}
    >
        {#if item.image}
            <img src={item.image} alt={item.text} />
        {/if}

        {item.text}

        {#if item.href}
            <img class="size-4" src="/icons/general/Link.svg" alt="Link" />
        {/if}
    </button>
</li>
