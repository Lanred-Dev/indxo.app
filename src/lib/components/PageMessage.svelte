<script lang="ts">
    let { title, text, button }: { title: string; text: string; button: [string, string] } =
        $props();
</script>

<div class="mb-7 block">
    <p class="text-3xl font-bold">{title}</p>
    <p class="text-light text-lg">{text}</p>
</div>

<a class="primary block w-fit" href={button[1]}>{button[0]}</a>
