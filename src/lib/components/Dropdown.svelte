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
        value: dropdownValue = $bindable(items[0]?.value),
    }: {
        classes?: string;
        items?: ItemProperties[];
        value?: string;
    } = $props();
    const uid: string = $props.id();

    let visible: boolean = $state.raw(false);
    let { text: currentText, image: currentImage }: ItemProperties = $derived(
        items.find(({ value }, index) => {
            if (typeof dropdownValue === "string" && dropdownValue.length > 0)
                return value === dropdownValue;

            return index === 0;
        }) ?? { value: "" }
    );
</script>

<div class={twMerge("dropdown relative min-w-fit text-lg", classes)} data-value={dropdownValue}>
    <button class="input-primary" type="button" id={uid}>
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

    <Popup bind:visible id={uid} classes="w-56 p-1!" alignment="left">
        <ul>
            {#each items as { isLink, value, text, image }}
                <li class="w-full">
                    <button
                        class="button-navigation py-1!"
                        role="menuitem"
                        onclick={() => () => {
                            if (isLink) return goto(value);

                            dropdownValue = value;
                            visible = false;
                        }}
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
