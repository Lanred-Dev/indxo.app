<script lang="ts">
    import { twMerge } from "tailwind-merge";
    import { fly } from "svelte/transition";
    import { goto } from "$app/navigation";

    export type itemProps = {
        value: string;
        text?: string;
        image?: string;
        isLink?: boolean;
    };

    let {
        classes,
        visible = $bindable(false),
        items = [],
        value = $bindable(items[0]?.value),
    }: {
        classes?: string;
        visible?: boolean;
        items?: itemProps[];
        value?: string;
    } = $props();

    let { text: currentText, image: currentImage }: itemProps = $derived(
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
    <button class="input-primary" onclick={() => (visible = !visible)} type="button">
        {#if currentText}
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

    {#if visible}
        <div
            class="container-popup top-full mt-1 w-56 p-1!"
            transition:fly={{ y: 10, duration: 100 }}
        >
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

                            {#if text}
                                <span>{text}</span>
                            {/if}
                        </button>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</div>
