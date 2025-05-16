<script lang="ts">
    export type ActionButton = {
        icon: string;
        text: string;
        onClick: (event: MouseEvent) => void;
    };

    export type ItemProperty = {
        _id: string;
        type?: "input" | "textarea";
        placeholder?: string;
        value?: string;
    };

    export type ListItem = {
        _listID: number;
        _id?: string;
        properties?: ItemProperty[];
        actionButtons?: ActionButton[];
    };

    let { _listID, _id, properties = $bindable([]), actionButtons = [] }: ListItem = $props();

    let value: string = $derived.by(() => {
        const actualProperties: { [id: string]: string } = {};

        for (const { _id, value = "" } of properties) {
            actualProperties[_id] = value.trim();
        }

        return JSON.stringify({ ...actualProperties });
    });
    // `hasValue` is mainly used to determine if the list item is valid during form submission.
    let hasValue: boolean = $derived.by(() => {
        let onePropertyHasValue: boolean = false;

        for (const { value = "" } of properties) {
            onePropertyHasValue = onePropertyHasValue || value.length > 0;
        }

        return onePropertyHasValue;
    });
</script>

<div
    class="EditableListItem container-primary flex flex-col gap-3"
    data-listID={_listID}
    data-id={_id}
    data-value={value}
    data-hasValue={hasValue}
>
    <div class="flex items-center justify-between px-3">
        <p class="text-lg font-bold">#{_listID + 1}</p>

        <div class="flex-center gap-3">
            {#each actionButtons as { icon, text, onClick }}
                <button type="button" onclick={onClick} aria-labelledby={text}>
                    <img class="size-6" src={icon} alt={text} />
                </button>
            {/each}
        </div>
    </div>

    <div class="flex-center w-full grow flex-wrap gap-3">
        {#each properties as { type, placeholder }, index}
            {#if type === "input"}
                <input
                    class="input-primary grow"
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
