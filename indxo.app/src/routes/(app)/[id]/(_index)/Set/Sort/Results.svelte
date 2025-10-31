<script lang="ts">
    import { getContext, onMount } from "svelte";
    import { fade } from "svelte/transition";
    import type { DocumentContext } from "../../+page.svelte";
    import type { SvelteMap, SvelteSet } from "svelte/reactivity";
    import { Wording } from "$lib/utils/wording";
    import type { Term } from "$lib/documents";

    let {
        knowTerms,
        stillLearningTerms,
        strugglingTerms,
        terms,
        restart,
    }: {
        knowTerms: SvelteSet<string>;
        stillLearningTerms: SvelteSet<string>;
        strugglingTerms: SvelteMap<string, number>;
        terms: Term[];
        restart: (withTerms: Term[]) => void;
    } = $props();

    const document: DocumentContext = getContext("document");
    let Canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;
    let canvasWidth: number = $state.raw(0);
    let canvasHeight: number = $state.raw(0);

    function drawCircle(radius: number, color: string, startAngle: number, endAngle: number) {
        context.beginPath();
        context.arc(canvasWidth / 2, canvasHeight / 2, radius, startAngle, endAngle);
        context.fillStyle = color;
        context.fill();
    }

    function draw() {
        const bodyStyles = getComputedStyle(window.document.body);
        const pageColor: string = bodyStyles.getPropertyValue("--background-color-page");
        const successColor: string = bodyStyles.getPropertyValue("--color-success");
        const alertColor: string = bodyStyles.getPropertyValue("--color-alert");
        const maxRadius: number = canvasWidth / 2;

        drawCircle(maxRadius, successColor, 0, (Math.PI * 2 * knowTerms.size) / terms.length);
        drawCircle(
            maxRadius,
            alertColor,
            (Math.PI * 2 * knowTerms.size) / terms.length,
            (Math.PI * 2 * (knowTerms.size + stillLearningTerms.size)) / terms.length
        );
        drawCircle(maxRadius - 7, pageColor, 0, Math.PI * 2);
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

<div in:fade class="space-y-10">
    <div class="w-full">
        <p class="mb-6 text-lg">
            You have sorted all the terms in this set. You can restart the sorting or go back to the {Wording.set}.
        </p>

        <div class="flex flex-wrap gap-4">
            <button class="button-attention" onclick={() => restart(terms)}>Restart</button>

            {#if stillLearningTerms.size > 0}
                <button
                    class="button-attention"
                    onclick={() =>
                        restart(terms.filter((term) => stillLearningTerms.has(term._id)))}
                >
                    Study still learning terms
                </button>
            {/if}

            {#if strugglingTerms.size > 0}
                <button
                    class="button-attention"
                    onclick={() => restart(terms.filter((term) => strugglingTerms.has(term._id)))}
                >
                    Study struggling terms
                </button>
            {/if}
        </div>
    </div>

    <div class="flex w-full flex-col gap-10 md:flex-row md:items-center">
        <div class="relative aspect-square w-3/5 md:w-2/5 lg:w-1/3">
            <canvas
                class="h-full w-full"
                bind:this={Canvas}
                bind:clientWidth={canvasWidth}
                bind:clientHeight={canvasHeight}
            ></canvas>

            <div class="x-center y-center absolute z-1 text-center">
                <p class="text-3xl font-bold">
                    {((knowTerms.size / terms.length) * 100).toFixed(0)}%
                </p>
                <p>of the way there</p>
            </div>
        </div>

        <div class="text-lg font-medium">
            <p>
                You know {#if knowTerms.size > 0}
                    {knowTerms.size}
                    {knowTerms.size === 1
                        ? Wording.term.toLowerCase()
                        : Wording.terms.toLowerCase()}
                {:else if knowTerms.size === document.terms.length}
                    every {Wording.term.toLowerCase()}
                {:else}
                    no {Wording.terms.toLowerCase()}
                {/if}
            </p>

            <p>
                you are still learning {#if stillLearningTerms.size > 0}
                    {stillLearningTerms.size}
                    {stillLearningTerms.size === 1
                        ? Wording.term.toLowerCase()
                        : Wording.terms.toLowerCase()}
                {:else if stillLearningTerms.size === document.terms.length}
                    every {Wording.term.toLowerCase()}
                {:else}
                    no {Wording.terms.toLowerCase()}
                {/if}
            </p>

            <p>
                and you're struggling with {#if strugglingTerms.size > 0}
                    {strugglingTerms.size}
                    {strugglingTerms.size === 1
                        ? Wording.term.toLowerCase()
                        : Wording.terms.toLowerCase()}
                {:else if strugglingTerms.size === document.terms.length}
                    every {Wording.term.toLowerCase()}
                {:else}
                    no {Wording.terms.toLowerCase()}
                {/if}
            </p>
        </div>
    </div>
</div>
