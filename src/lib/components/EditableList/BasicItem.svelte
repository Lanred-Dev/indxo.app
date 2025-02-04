<script lang="ts">
    export type item = {
        index: number;
        name: string;
        description: string;
    };

    let { index, name, description }: item = $props();

    let currentNameValue: string = $state(name);
    let currentDescriptionValue: string = $state(description);
</script>

<div
    class="editableListItem space-x-5"
    data-name={name}
    data-description={description}
    data-id={index}
>
    <div class="flex-center gap-1">
        <p>#{index}</p>
        <input bind:value={currentNameValue} />
    </div>

    <input bind:value={currentDescriptionValue} />
</div>
