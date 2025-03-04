<script lang="ts">
    import { onMount, type Snippet } from "svelte";
    import { twMerge } from "tailwind-merge";
    import type { props as DropdownItemProps } from "./DropdownItem.svelte";

    let {
        visible = $bindable(false),
        placeholder = "",
        currentRawValue = $bindable(""),
        classes,
        children,
    }: {
        visible?: boolean;
        placeholder?: string | DropdownItemProps;
        currentRawValue?: string;
        classes?: string;
        children?: Snippet<[]>;
    } = $props();

    let listContainer: HTMLElement;
    let currentValue: DropdownItemProps = $state({
        value: typeof placeholder === "string" ? placeholder : placeholder?.value,
        text: typeof placeholder === "string" ? placeholder : placeholder?.text,
        image: typeof placeholder === "string" ? "" : placeholder?.image,
    });
    let largestValue: DropdownItemProps = $state({
        value: typeof placeholder === "string" ? placeholder : placeholder?.value,
        text: typeof placeholder === "string" ? placeholder : placeholder?.text,
        image: typeof placeholder === "string" ? "" : placeholder?.image,
    });

    /**
     * Handles when a dropdown item is clicked and updates the current value.
     *
     * @param event
     * @returns never
     */
    function dropdownItemClicked(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const dropdownItem = target.closest(".dropdownItem");

        if (dropdownItem) {
            const value: string = dropdownItem.getAttribute("data-value")!;
            const text: string = dropdownItem.getAttribute("data-text")!;
            const image: string = dropdownItem.getAttribute("data-image")!;

            currentRawValue = value;
            currentValue = { value, text, image };
            visible = false;
        }
    }

    /**
     * Sets up event listeners for the dropdown items, removes any existing event listeners, and finds the largest text value (used for correct sizing).
     *
     * @returns never
     */
    function setup() {
        removeEventListeners();

        const dropdownItems: NodeListOf<HTMLElement> =
            listContainer.querySelectorAll(".dropdownItem")!;
        let largestTextValue: string = "";

        dropdownItems.forEach((dropdownItem: HTMLElement) => {
            dropdownItem.addEventListener("click", dropdownItemClicked);

            const text: string = dropdownItem.getAttribute("data-text")!;

            if (text.length > largestTextValue.length) {
                largestTextValue = text;
                largestValue = {
                    value: dropdownItem.getAttribute("data-value")!,
                    text,
                    image: dropdownItem.getAttribute("data-image")!,
                };
            }
        });
    }

    /**
     * Removes event listeners from the dropdown items.
     *
     * @returns never
     */
    function removeEventListeners() {
        const dropdownItems: NodeListOf<HTMLElement> =
            listContainer.querySelectorAll(".dropdownItem")!;

        dropdownItems.forEach((dropdownItem: HTMLElement) => {
            dropdownItem.removeEventListener("click", dropdownItemClicked);
        });
    }

    onMount(() => {
        setup();

        const observer: MutationObserver = new MutationObserver((mutationList) => {
            mutationList.forEach((mutation) => {
                if (mutation.type === "childList") {
                    setup();
                }
            });
        });

        observer.observe(listContainer, { childList: true });

        return () => {
            observer.disconnect();
            removeEventListeners();
        };
    });
</script>

<div class={twMerge("dropdown relative", classes)} data-value={currentValue.value}>
    <button
        class="relative {!currentValue.text && currentValue.image ? '!p-2' : ''}"
        data-input
        onclick={() => (visible = !visible)}
        type="button"
    >
        <div class="y-center flex items-center justify-start gap-1">
            {#if currentValue.image}
                <img class="size-7" src={currentValue.image} alt={currentValue.text} />
            {/if}

            {#if currentValue.text}
                <span class="text-nowrap">{currentValue.text}</span>
            {/if}
        </div>

        <!--Render a hidden non-interable item that is used for setting the size-->
        <div class="invisible flex items-center justify-start gap-1">
            {#if largestValue.image}
                <img class="size-7" src={largestValue.image} alt={largestValue.text} />
            {/if}

            {#if largestValue.text}
                <span class="text-nowrap">{largestValue.text}</span>
            {/if}
        </div>
    </button>

    <div
        class="primary absolute top-full z-20 mt-1 border border-primary shadow-md {!currentValue.text &&
        currentValue.image
            ? 'p-2'
            : 'px-3 py-2'}"
        style:display={visible ? "block" : "none"}
    >
        <ul class="space-y-2" bind:this={listContainer}>
            {@render children?.()}
        </ul>
    </div>
</div>
