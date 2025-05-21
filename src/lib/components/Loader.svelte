<script lang="ts">
    let { size = 3, color = "attention" }: { size?: number; color?: string } = $props();

    const COLORS: { [color: string]: string } = {
        attention: "var(--color-attention)",
        black: "#000000",
    };
</script>

<svg
    class="aspect-1 fill-none stroke-2"
    viewBox="25 25 50 50"
    style:width="{size}rem"
    style:stroke={COLORS[color]}
>
    <circle cx="50" cy="50" r="20" />
</svg>

<style>
    svg {
        animation: rotate 2s linear infinite;
    }

    svg circle {
        stroke-dasharray: 150, 200;
        stroke-dashoffset: -10;
        animation: dash 1.5s ease-in-out infinite;
        stroke-linecap: round;
    }

    @keyframes rotate {
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes dash {
        0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
        }

        50% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -35;
        }

        100% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -124;
        }
    }
</style>
