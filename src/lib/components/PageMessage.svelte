<script lang="ts">
    let { title, text, button }: { title: string; text: string; button: [string, string] } =
        $props();
</script>

<div class="page-message">
    <p>{title}</p>
    <p>{text}</p>
</div>

<a class="button-primary block w-fit" href={button[1]}>{button[0]}</a>
