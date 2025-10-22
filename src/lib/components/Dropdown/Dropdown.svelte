<script lang="ts">
    import { Popup } from "$lib/components/Popup";
    import { setContext, type ComponentProps, type Snippet } from "svelte";
    import { dropdownContextKey, DropdownItem, type DropdownContext } from ".";

    let {
        value = $bindable(null),
        children,
    }: {
        value?: string | number | null;
        children?: Snippet<[]>;
    } = $props();

    const uid: string = $props.id();
    let isVisible: boolean = $state.raw(false);
    let items: ComponentProps<typeof DropdownItem>[] = [];
    let currentItem: ComponentProps<typeof DropdownItem> = $state.raw({
        value: "",
        children: emptyItem,
    });
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
        registerItem: (item) => {
            items.push(item);

            if (value === null || item.value === value) {
                value = item.value;
                currentItem = item;
            }
        },
    } satisfies DropdownContext);
</script>

{#snippet emptyItem()}
    [empty]
{/snippet}

<Popup bind:isVisible>
    {@render children?.()}
</Popup>
