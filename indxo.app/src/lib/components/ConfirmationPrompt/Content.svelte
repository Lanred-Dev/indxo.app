<script lang="ts">
    import type { Snippet } from "svelte";
    import { DialogContent, DialogContentHeader } from "../Dialog";

    let {
        title,
        message,
        children,
    }: {
        title: string;
        message: string;
        children: Snippet<[]>;
    } = $props();
</script>

<DialogContent>
    <DialogContentHeader {title} includeCloseButton={false} />

    <p>{message}</p>

    <div class="row mt-5">
        {@render children()}
    </div>
</DialogContent>
