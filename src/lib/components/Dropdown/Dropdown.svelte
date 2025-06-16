<script lang="ts">
    import { Popup } from "$lib/components/Popup";
    import { setContext, type Snippet } from "svelte";
    import { dropdownContextKey, type DropdownContext, type DropdownItemProperties } from ".";
    import measureText from "$lib/utils/measureText";

    let {
        value = $bindable(""),
        children,
    }: {
        value?: string;
        children: Snippet<[]>;
    } = $props();

    const uid: string = $props.id();
    let visible: boolean = $state.raw(false);
    let items: DropdownItemProperties[] = [];
    let currentItem: DropdownItemProperties = $state.raw({ value: "" });
    let longestTextWidth: number = $state.raw(0);

    setContext(dropdownContextKey, (() => {
        return {
            uid,
            isVisible: visible,
            value,
            currentItem,
            longestTextWidth,
            setValue: (item: DropdownItemProperties) => {
                value = item.value;
                currentItem = item;
                visible = false;
            },
            registerItem: async (item: DropdownItemProperties) => {
                items.push(item);

                if (items.length === 1) {
                    value = item.value;
                    currentItem = item;
                }

                const { width } = await measureText(
                    items.reduce(
                        (longest, { text = "" }) => (text.length > longest.length ? text : longest),
                        ""
                    ),
                    "var(--text-lg)"
                );
                longestTextWidth = Math.max(longestTextWidth, width);
            },
        };
    }) satisfies DropdownContext);
</script>

<Popup bind:visible>
    {@render children()}
</Popup>
