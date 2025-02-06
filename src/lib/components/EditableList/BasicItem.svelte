<script lang="ts">
    export type item = {
        index: number;
        name: string;
        description: string;
    };

    let { index, name, description }: item = $props();

    let currentNameValue: string = $state(name);
    let currentDescriptionValue: string = $state(description);
    let currentValue: { [key: string]: any } = $derived({ name, description });
</script>

<div class="editableListItem primary space-x-5 px-8 py-6" data-id={index} data-value={currentValue}>
    <div class="flex items-center gap-1">
        <p>#{index + 1}</p>
        <input bind:value={currentNameValue} />
    </div>

    <input bind:value={currentDescriptionValue} />
</div>
