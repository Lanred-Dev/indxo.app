<script lang="ts">
    export type card = {
        title: string;
        description: string;
        image: string;
        link: string;
    };

    export type sectionType = "set" | "folder";

    let { title, cards }: { title: string; type: sectionType; cards: card[] } = $props();
</script>

<div class="space-y-2">
    <p class="text-3xl font-bold">{title}</p>

    <ul class="flex gap-2">
        {#each cards as { title, description, link }}
            <li class="inline-block w-full text-left text-sm">
                <a
                    class="primary relative inline-block w-full overflow-hidden text-left"
                    href={link}
                >
                    <p class="text-base font-semibold leading-tight">{title}</p>
                    <p class="text-sm">{description}</p>
                </a>
            </li>
        {/each}
    </ul>
</div>
