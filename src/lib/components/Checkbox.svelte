<script lang="ts">
    import { twMerge } from "tailwind-merge";

    let {
        placeholder,
        classes,
    }: {
        placeholder?: boolean;
        classes?: string;
    } = $props();

    let currentValue: boolean = $state(placeholder || false);
</script>

<div class={twMerge("checkbox relative", classes)} data-value={currentValue}>
    <button onclick={() => (currentValue = !currentValue)} data-input type="button" class="!p-2">
        <img
            class="aspect-1 h-7"
            src={currentValue ? "/icons/general/Check.svg" : "/icons/general/X.svg"}
            alt={currentValue ? "True" : "False"}
        />
    </button>
</div>
