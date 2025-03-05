<script lang="ts">
    export type props = {
        value: string;
        text?: string;
        image?: string;
    };

    let { value, text, image }: props = $props();
</script>

<li class="dropdownItem w-full" data-value={value} data-text={text} data-image={image}>
    <button class="navigation-primary !py-1" type="button" role="menuitem">
        {#if image}
            <img src={image} alt={text} />
        {/if}

        {#if text}
            <span>{text}</span>
        {/if}
    </button>
</li>
