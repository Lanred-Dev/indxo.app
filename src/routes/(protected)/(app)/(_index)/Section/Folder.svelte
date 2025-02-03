<script lang="ts">
    import type { card } from "./Section.svelte";

    let { linkTo, name, subject, isPublic }: card = $props();
</script>

<a class="relative inline-block w-full overflow-hidden text-left" href={linkTo}>
    <p>{name}</p>
    <p>{subject}</p>
</a>
