<script lang="ts">
    let {
        icon,
        class: className,
    }: {
        icon: string;
        class?: string;
    } = $props();
</script>

<div class={[className, "[&>svg]:h-full [&>svg]:w-full"]}>
    {@html icon}
</div>
