<script lang="ts">
    import PageSection, { type props } from "./PageSection.svelte";

    let sectionProps: props = $props();
</script>

<PageSection
    {...sectionProps}
    classes="min-h-screen"
    style={(sectionProps.style ?? "") + "padding-top: 25vh; justify-content: flex-start;"}
/>
