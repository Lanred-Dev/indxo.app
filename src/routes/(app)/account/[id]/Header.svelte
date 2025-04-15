<script lang="ts">
    let { name, image }: { name: string; image: string } = $props();
</script>

<div class="flex-center gap-3">
    <img src={image} alt={name} class="size-14 rounded-full" />
    <h1 class="page-title">{name}</h1>
</div>
