<script lang="ts">
    import { onMount, type Snippet } from "svelte";
    import { writable, type Writable } from "svelte/store";
    import { twMerge } from "tailwind-merge";
    import type { props as DropdownItemProps } from "./DropdownItem.svelte";

    export const visible: Writable<boolean> = writable(false);

    let {
        placeholder,
        classes,
        id,
        children,
    }: {
        placeholder?: DropdownItemProps | string;
        classes?: string;
        id?: string;
        children?: Snippet<[]>;
    } = $props();

    let listContainer: HTMLElement;
    let currentValue: DropdownItemProps = $state({
        value: typeof placeholder === "string" ? placeholder : placeholder?.value || "",
        text: typeof placeholder === "string" ? placeholder : placeholder?.text || "",
        image: typeof placeholder === "string" ? "" : placeholder?.image,
    });

    function dropdownItemClicked(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const dropdownItem = target.closest(".dropdown-item");

        if (dropdownItem) {
            const value: string = dropdownItem.getAttribute("data-value")!;
            const text: string = dropdownItem.getAttribute("data-text")!;
            const image: string = dropdownItem.getAttribute("data-image")!;

            currentValue = { value, text, image };
            visible.set(false);
        }
    }

    function setupEventListeners() {
        removeEventListeners();

        const dropdownItems: NodeListOf<HTMLElement> =
            listContainer.querySelectorAll(".dropdown-item")!;

        dropdownItems.forEach((dropdownItem: HTMLElement) => {
            dropdownItem.addEventListener("click", dropdownItemClicked);
        });
    }

    function removeEventListeners() {
        const dropdownItems: NodeListOf<HTMLElement> =
            listContainer.querySelectorAll(".dropdown-item")!;

        dropdownItems.forEach((dropdownItem: HTMLElement) => {
            dropdownItem.removeEventListener("click", dropdownItemClicked);
        });
    }

    onMount(() => {
        setupEventListeners();

        const observer: MutationObserver = new MutationObserver((mutationList) => {
            mutationList.forEach((mutation) => {
                if (mutation.type === "childList") {
                    setupEventListeners();
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

<div class={twMerge("relative", classes)} {id}>
    <button
        class="flex w-full items-center justify-start gap-0.5"
        data-input
        onclick={() => visible.update((visible: boolean) => !visible)}
        type="button"
    >
        {#if currentValue.image}
            <img class="aspect-1 h-7" src={currentValue.image} alt={currentValue.text} />
        {/if}

        {#if currentValue.text}
            <span class="text-nowrap">{currentValue.text}</span>
        {/if}
    </button>

    <div
        class="primary absolute top-full z-20 mt-1 px-3 py-2"
        style="display: {$visible ? 'block' : 'none'};"
    >
        <ul class="space-y-1" bind:this={listContainer}>
            {@render children?.()}
        </ul>
    </div>
</div>
