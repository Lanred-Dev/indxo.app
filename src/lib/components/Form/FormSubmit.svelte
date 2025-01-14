<script lang="ts">
    let { text }: { text: string } = $props();
</script>

<button type="submit" class="primary w-full">
    {@html text}
</button>
