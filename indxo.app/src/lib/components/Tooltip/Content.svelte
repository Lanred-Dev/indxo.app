<script lang="ts">
    import { PopupContent, PopupXAlignment, PopupYAlignment, PopupRelativity } from "../Popup";
    import { type Snippet } from "svelte";
    import type { ClassValue } from "svelte/elements";

    let {
        children,
        class: className,
    }: {
        children: Snippet<[]>;
        class?: ClassValue;
    } = $props();
</script>

<PopupContent
    class={className}
    xAlignment={PopupXAlignment.center}
    yAlignment={PopupYAlignment.bottom}
    positionRelativity={PopupRelativity.page}
    offset={15}
>
    <p class="text-center">
        {@render children()}
    </p>
</PopupContent>
