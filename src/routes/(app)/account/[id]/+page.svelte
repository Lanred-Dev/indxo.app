<script lang="ts">
    let { data } = $props();
</script>

<div class="flex gap-0.5">
    <img src={data.image} alt={data.name} class="size-7 shrink-0" />
    <p>{data.name}</p>
</div>
