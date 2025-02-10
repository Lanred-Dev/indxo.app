<script lang="ts">
    let { data } = $props();
</script>

<div class="flex gap-0.5">
    <img src={data.image} alt={data.name} class="aspect-1 h-7 flex-shrink-0" />
    <p>{data.name}</p>
</div>
