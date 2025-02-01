<script lang="ts">
    export type card = {
        title: string;
        description: string;
        image: string;
        link: string;
    };

    let { title, cards }: { title: string; cards: card[] } = $props();
</script>

<div class="space-y-2">
    <p class="text-xl">{title}</p>

    <ul class="flex gap-2">
        {#each cards as { title, description, image, link }}
            <li class="w-full text-left text-sm">
                <a class="primary relative w-full overflow-hidden text-left" href={link}>
                    <div class="bt-cover relative aspect-2 w-full overflow-hidden">
                        <img
                            class="x-center y-center w-full object-cover"
                            src={image}
                            alt={title}
                            loading="lazy"
                            decoding="async"
                        />
                    </div>

                    <div
                        class="absolute bottom-0 left-0 flex w-full flex-col rounded-md bg-primary-200 p-8"
                    >
                        <div class="flex items-center space-x-4">
                            <p class="text-base font-semibold leading-tight">{title}</p>
                            <p class="text-sm">{description}</p>
                        </div>
                    </div>
                </a>
            </li>
        {/each}
    </ul>
</div>
