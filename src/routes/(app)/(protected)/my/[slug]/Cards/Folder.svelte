<script lang="ts">
    import type { PublicFolder } from "$lib/database/documents/Folder";
    import determineWording from "$lib/utils/determineWording";

    let { name, sets, _id, description, icon }: PublicFolder = $props();
</script>

<a
    class="button-primary !block w-full flex-col !items-start space-y-2 !px-6 !py-4"
    href="/folder/{_id}"
>
    <div class="w-full">
        <div class="flex gap-1">
            <img src={icon} alt="Folder" class="size-8" />
            <p class="w-full overflow-hidden overflow-ellipsis text-2xl font-bold">{name}</p>
        </div>

        <div class="[&>p]:text-dark flex items-center gap-4 [&>p]:leading-none">
            <p class="leading-tight">
                {sets.length}
                {determineWording(sets.length === 1 ? "set" : "sets")}
            </p>
        </div>
    </div>

    <p class="text-light line-clamp-1 overflow-hidden overflow-ellipsis">
        {description}
    </p>
</a>
