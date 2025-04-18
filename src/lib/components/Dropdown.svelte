<script lang="ts">
    import { twMerge } from "tailwind-merge";
    import { goto } from "$app/navigation";
    import Popup from "./Popup.svelte";

    export type ItemProperties = {
        value: string;
        text?: string;
        image?: string;
        isLink?: boolean;
    };

    let {
        classes,
        items = [],
        value = $bindable(items[0]?.value),
    }: {
        classes?: string;
        items?: ItemProperties[];
        value?: string;
    } = $props();

    let id: string = `dropdown-${Date.now().toString()}-${items.length}`;
    let visible: boolean = $state(false);
    let { text: currentText, image: currentImage }: ItemProperties = $derived(
        items.find((item, index) => {
            if (typeof value === "string" && value.length > 0) return item.value === value;

            return index === 0;
        }) ?? { value: "" }
    );

    /**
     * Handles when a dropdown item is clicked and updates the current value.
     *
     * @param newValue The new value
     * @returns never
     */
    function onItemClicked(newValue: string, isLink: boolean) {
        if (isLink) goto(newValue);

        value = newValue;
        visible = false;
    }
</script>

<div class={twMerge("dropdown relative min-w-fit text-lg", classes)} data-value={value}>
    <button class="input-primary" type="button" {id}>
        {#if currentImage}
            <img class="size-7" src={currentImage} alt={currentText} />
        {/if}

        {#if currentText}
            <span class="text-nowrap">{currentText}</span>
        {/if}

        <img
            class="size-4"
            src="/icons/general/{visible ? 'UpChevron' : 'DownChevron'}.svg"
            alt="Arrow {visible ? 'up' : 'down'}"
        />
    </button>

    <Popup bind:visible buttonID={id} classes="w-56 p-1!" alignment="left">
        <ul>
            {#each items as { isLink, value, text, image }}
                <li class="w-full">
                    <button
                        class="button-navigation py-1!"
                        role="menuitem"
                        onclick={() => onItemClicked(value, isLink ?? false)}
                        type="button"
                    >
                        {#if image}
                            <img src={image} alt={text} />
                        {/if}

                        {text}
                    </button>
                </li>
            {/each}
        </ul>
    </Popup>
</div>
