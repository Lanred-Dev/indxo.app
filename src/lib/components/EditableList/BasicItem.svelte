<script lang="ts">
    export type item = {
        index: number;
        name: string;
        description: string;
        namePlaceholder?: string;
        descriptionPlaceholder?: string;
        actionButtons?: { text: string; onClick: (event: MouseEvent) => void }[];
        data?: string[];
    };

    let {
        index,
        name,
        description,
        namePlaceholder = "Cool name",
        descriptionPlaceholder = "A very cool description...",
        actionButtons = [],
        data = [],
    }: item = $props();

    let currentNameValue: string = $state(name);
    let currentDescriptionValue: string = $state(description);
    let currentValue: string = $derived.by(() => {
        const name: string = currentNameValue.trim();
        const description: string = currentDescriptionValue.trim();

        return JSON.stringify({ name, description });
    });
    let hasValue: boolean = $derived.by(() => {
        const name: string = currentNameValue.trim();
        const description: string = currentDescriptionValue.trim();

        return name.length > 0 || description.length > 0;
    });
</script>

<div
    class="editableListItem primary flex h-44 flex-col gap-3 px-8 py-6"
    data-id={index}
    data-value={currentValue}
    data-hasValue={hasValue}
>
    <div class="flex items-center justify-between">
        <div class="flex-center gap-2">
            <p class="text-lg font-bold">#{index + 1}</p>

            <input
                class="primary w-fit !bg-primary-300"
                placeholder={namePlaceholder}
                bind:value={currentNameValue}
            />
        </div>

        <div class="flex-center gap-6">
            {#each actionButtons as { text, onClick }}
                <button type="button" onclick={onClick}>
                    {text}
                </button>
            {/each}

            <button class="deleteButton" type="button">
                <img class="aspect-1 h-7" src="/icons/general/Trash.svg" alt="Trash" />
            </button>
        </div>
    </div>

    <div class="flex-center w-full flex-grow gap-6">
        {#each data as item}
            {@html item}
        {/each}

        <textarea
            class="primary h-full w-full resize-none !bg-primary-300"
            placeholder={descriptionPlaceholder}
            bind:value={currentDescriptionValue}
        ></textarea>
    </div>
</div>
