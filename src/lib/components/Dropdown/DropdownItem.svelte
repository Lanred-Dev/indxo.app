<script lang="ts">
    export type props = {
        value: string;
        text?: string;
        image?: string;
    };

    let { value, text, image }: props = $props();
</script>

<li class="dropdownItem w-full" data-value={value} data-text={text} data-image={image}>
    <button class="flex items-center justify-start gap-1" type="button">
        {#if image}
            <img class="aspect-1 h-7" src={image} alt={text} />
        {/if}

        {#if text}
            <span class="text-nowrap">{text}</span>
        {/if}
    </button>
</li>
