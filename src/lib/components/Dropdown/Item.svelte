<script lang="ts">
    import { getContext, type Snippet } from "svelte";
    import { dropdownContextKey, type DropdownContext } from ".";
    import { goto } from "$app/navigation";

    let {
        value,
        href,
        children,
    }: {
        value: string | number;
        href?: string;
        children: Snippet<[]>;
    } = $props();

    const dropdown: DropdownContext = getContext(dropdownContextKey);
    dropdown.registerItem({ value, href, children });

    let contentWidth: number = $state.raw(0);

    $effect(() => {
        if (contentWidth > dropdown.largestContentWidth)
            dropdown.largestContentWidth = contentWidth;
    });
</script>

<li class="w-full">
    <button
        class="button-navigation px-3! py-1.5!"
        role="option"
        type="button"
        aria-selected={dropdown.value.value === value}
        onclick={() => {
            if (href) return goto(href);

            dropdown.value = { value, href, children };
        }}
    >
        <div class="flex" bind:clientWidth={contentWidth}>
            {@render children()}
        </div>

        {#if href}
            <img class="size-4" src="/icons/general/Link.svg" alt="Link" />
        {/if}
    </button>
</li>
