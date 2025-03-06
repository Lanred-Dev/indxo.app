<script lang="ts">
    export type props = {
        value: string;
        text?: string;
        image?: string;
    };

    let { text, image }: props = $props();
</script>

{#if image}
    <img src={image} alt={text} />
{/if}

{#if text}
    <span>{text}</span>
{/if}
