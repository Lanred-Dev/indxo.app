<script lang="ts">
    export let searchQuery: string = "";
</script>

<div class="flex w-full items-center justify-between pb-16 pt-12">
    <div data-input class="flex-center w-3/5 gap-2">
        <img class="size-5" src="/icons/general/Search.svg" alt="Search" />

        <input
            class="w-full border-0 bg-transparent p-0 outline-none focus:ring-0"
            type="text"
            placeholder="Cant find something?"
            bind:value={searchQuery}
        />
    </div>
</div>
