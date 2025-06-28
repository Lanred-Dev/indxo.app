<script lang="ts">
    import { Popup } from "$lib/components/Popup";
    import { setContext, type Snippet } from "svelte";
    import { dropdownContextKey, type DropdownContext, type DropdownItemProperties } from ".";
    import measureText from "$lib/utils/measureText";

    let {
        value = $bindable(null),
        children,
    }: {
        value?: string | number | null;
        children: Snippet<[]>;
    } = $props();

    const uid: string = $props.id();
    let isVisible: boolean = $state.raw(false);
    let items: DropdownItemProperties[] = [];
    let currentItem: DropdownItemProperties = $state.raw({ value: "", Content: emptyItemContent });
    let largestContentWidth: number = $state.raw(0);

    setContext(dropdownContextKey, {
        uid,
        get isVisible() {
            return isVisible;
        },
        set isVisible(newValue: boolean) {
            isVisible = newValue;
        },
        get value() {
            return currentItem;
        },
        set value(newValue) {
            const item = items.find((item) => item.value === newValue.value);

            if (item) {
                value = item.value;
                currentItem = item;
                isVisible = false;
            }
        },
        get largestContentWidth() {
            return largestContentWidth;
        },
        set largestContentWidth(newValue) {
            // Adding 1 ensures that rounding wont cause issues with the width
            largestContentWidth = newValue + 1;
        },
        registerItem: async (item: DropdownItemProperties) => {
            items.push(item);

            if (value === null || item.value === value) {
                value = item.value;
                currentItem = item;
            }
        },
    } satisfies DropdownContext);
</script>

{#snippet emptyItemContent()}
    [empty]
{/snippet}

<Popup bind:isVisible>
    {@render children()}
</Popup>
