<script lang="ts">
    import { getContext, onMount } from "svelte";
    import { fade } from "svelte/transition";
    import type { DocumentContext } from "../../+page.svelte";
    import type { SvelteSet } from "svelte/reactivity";
    import { Wording } from "$lib/utils/wording";
    import type { Term } from "$lib/documents";
    import Icon from "$lib/components/Icon.svelte";

    let {
        knowTerms,
        stillLearningTerms,
        strugglingTerms,
        restart,
    }: {
        knowTerms: SvelteSet<string>;
        stillLearningTerms: SvelteSet<string>;
        strugglingTerms: SvelteSet<string>;
        restart: (withTerms: Term[]) => void;
    } = $props();

    const LINE_WIDTH: number = 8;

    const document: DocumentContext = getContext("document");
    let Canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;
    let canvasWidth: number = $state.raw(0);
    let canvasHeight: number = $state.raw(0);

    function drawCircle(radius: number, color: string, startAngle: number, endAngle: number) {
        context.beginPath();
        context.arc(canvasWidth / 2, canvasHeight / 2, radius - LINE_WIDTH, startAngle, endAngle);
        context.strokeStyle = color;
        context.lineWidth = LINE_WIDTH;
        context.stroke();
    }

    function draw() {
        context.clearRect(0, 0, canvasWidth, canvasHeight);

        const bodyStyles = getComputedStyle(window.document.documentElement);
        const successColor: string = bodyStyles.getPropertyValue("--color-success");
        const warningColor: string = bodyStyles.getPropertyValue("--color-warning");
        const alertColor: string = bodyStyles.getPropertyValue("--color-alert");
        const maxRadius: number = canvasWidth / 2;

        drawCircle(
            maxRadius,
            successColor,
            0,
            (Math.PI * 2 * knowTerms.size) / document.data.terms.length
        );

        const stillLearningStartAngle: number =
            (Math.PI * 2 * knowTerms.size) / document.data.terms.length;
        drawCircle(
            maxRadius,
            warningColor,
            stillLearningStartAngle,
            (Math.PI * 2 * (knowTerms.size + stillLearningTerms.size)) / document.data.terms.length
        );

        if (strugglingTerms.size > 0) {
            drawCircle(
                maxRadius,
                alertColor,
                stillLearningStartAngle,
                stillLearningStartAngle +
                    (Math.PI * 2 * strugglingTerms.size) / document.data.terms.length
            );
        }
    }

    onMount(() => {
        context = Canvas.getContext("2d")!;
        draw();
    });

    $effect(() => {
        if (!Canvas) return;

        const ratio: number = Math.ceil(window.devicePixelRatio);
        Canvas.width = canvasWidth * ratio;
        Canvas.height = canvasHeight * ratio;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);

        draw();
    });
</script>

<div in:fade class="container-primary space-y-5 md:space-y-2">
    <div class="w-full md:grid md:grid-cols-2 md:grid-rows-1 md:items-center">
        <div class="relative aspect-square w-4/5 md:m-5 md:w-2/3 lg:w-1/2">
            <canvas
                class="h-full w-full"
                bind:this={Canvas}
                bind:clientWidth={canvasWidth}
                bind:clientHeight={canvasHeight}
            ></canvas>

            <div class="x-center y-center absolute z-1 w-full text-center">
                <p class="text-3xl font-bold">
                    {((knowTerms.size / document.data.terms.length) * 100).toFixed(0)}%
                </p>
                <p class="w-full">of the way there</p>
            </div>
        </div>

        <div
            class="mt-5 text-lg font-medium md:mt-0 [&>p]:flex [&>p]:gap-2 [&>p>[role='img']]:mt-0.5 [&>p>[role='img']]:ml-0.5 [&>p>[role='img']]:size-6"
        >
            <p>
                <Icon icon="general/CheckBadge" style="color: var(--color-success);" />
                You know {knowTerms.size},
            </p>

            <p>
                <Icon icon="general/Book" style="color: var(--color-warning);" />
                are still learning {stillLearningTerms.size},
            </p>

            <p>
                <Icon icon="general/Alert" style="color: var(--color-alert);" />
                and are struggling with {strugglingTerms.size}.
            </p>
        </div>
    </div>

    <div class="flex flex-wrap justify-end gap-x-4 gap-y-2 lg:mt-0">
        <button class="button-primary" onclick={() => restart(document.data.terms)}>Restart</button>

        {#if stillLearningTerms.size > 0}
            <button
                class="button-attention"
                onclick={() =>
                    restart(
                        document.data.terms.filter((term: Term) => stillLearningTerms.has(term._id))
                    )}
            >
                Study still learning terms
            </button>
        {/if}

        {#if strugglingTerms.size > 0}
            <button
                class="button-attention"
                onclick={() =>
                    restart(
                        document.data.terms.filter((term: Term) => strugglingTerms.has(term._id))
                    )}
            >
                Study struggling terms
            </button>
        {/if}
    </div>
</div>
