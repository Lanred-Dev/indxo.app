<script lang="ts">
    import type { ClassValue } from "svelte/elements";

    let {
        icon,
        class: className,
        svgProperties,
        ...properties
    }: {
        icon: string;
        class?: ClassValue;
        svgProperties?: { [key: string]: unknown };
        [key: string]: unknown;
    } = $props();

    let svgContent: string = $state.raw("");
    const icons = import.meta.glob("../assets/icons/**/*.svg", {
        eager: true,
        query: "?raw",
        import: "default",
    });

    $effect(() => {
        svgContent = icons[`../assets/icons/${icon}.svg`] as string;
    });
</script>

<div class={["[&>svg]:h-full [&>svg]:w-full", className]} {...properties} role="img">
    {@html svgContent}
</div>
