<script lang="ts">
    export type actionButton = {
        isActualButton?: boolean;
        classes?: string;
        image?: [string, string];
        onClick?: (event: MouseEvent) => void;
        onMouseDown?: (event: MouseEvent) => void;
        onMouseUp?: (event: MouseEvent) => void;
    };

    export type property = {
        id: string;
        type?: "input" | "textarea";
        placeholder?: string;
        value?: string;
    };

    export type item = {
        id: number;
        properties?: property[];
        actionButtons?: actionButton[];
    };

    let { id, properties = $bindable([]), actionButtons = [] }: item = $props();

    let value: string = $derived.by(() => {
        const actualProperties: { [id: string]: string } = {};

        for (const { id, value = "" } of properties) {
            actualProperties[id] = value.trim();
        }

        return JSON.stringify({ ...actualProperties });
    });
    // NOTE: `hasValue` is mainly used to determine if the list item is valid during form submission.
    let hasValue: boolean = $derived.by(() => {
        let onePropertyHasValue: boolean = false;

        for (const { value = "" } of properties) {
            onePropertyHasValue = onePropertyHasValue || value.length > 0;
        }

        return onePropertyHasValue;
    });
</script>

<div
    class="editableListItem container-primary flex flex-col gap-3 px-8 py-6"
    data-id={id}
    data-value={value}
    data-hasValue={hasValue}
>
    <div class="flex items-center justify-between px-3">
        <p class="text-lg font-bold">#{id + 1}</p>

        <div class="flex-center gap-3">
            {#each actionButtons as { isActualButton = true, classes, image, onClick, onMouseDown, onMouseUp }}
                {#if isActualButton}
                    <button
                        class={classes}
                        type="button"
                        onclick={onClick}
                        onmousedown={onMouseDown}
                        onmouseup={onMouseUp}
                    >
                        {#if image}
                            <img class="size-6" src={image[0]} alt={image[1]} />
                        {/if}
                    </button>
                {:else if image}
                    <img class="size-6" src={image[0]} alt={image[1]} />
                {/if}
            {/each}
        </div>
    </div>

    <div class="flex-center w-full flex-grow flex-wrap gap-3">
        {#each properties as { type, placeholder }, index}
            {#if type === "input"}
                <input
                    class="input-primary flex-grow"
                    {placeholder}
                    bind:value={properties[index].value}
                />
            {:else if type === "textarea"}
                <textarea
                    class="input-primary min-h-28 w-full resize-none"
                    {placeholder}
                    bind:value={properties[index].value}
                ></textarea>
            {/if}
        {/each}
    </div>
</div>
