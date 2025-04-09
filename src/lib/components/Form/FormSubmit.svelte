<script lang="ts">
    let { text }: { text: string } = $props();
</script>

<button type="submit" class="button-attention w-full">
    {@html text}
</button>
