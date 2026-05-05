<script lang="ts">
    import { getContext, onMount } from "svelte";
    import { fade } from "svelte/transition";
    import type { DocumentContext } from "../../+page.svelte";
    import type { SvelteSet } from "svelte/reactivity";
    import { Wording } from "$lib/utils/wording";
    import type { Term } from "$lib/documents";

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

<div in:fade class="container-primary">
    <div class="grid w-full grid-cols-1 grid-rows-2 items-center md:grid-cols-2 md:grid-rows-1">
        <div class="relative m-5 aspect-square w-4/5 md:w-2/3 lg:w-1/2">
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

        <div class="text-lg font-medium [&>p]:flex [&>p]:items-center [&>p]:gap-2 [&>p>svg]:size-6">
            <p>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fill-success">
                    <path
                        fill-rule="evenodd"
                        d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                        clip-rule="evenodd"
                    />
                </svg>

                You know {#if knowTerms.size > 0}
                    {knowTerms.size}
                    {knowTerms.size === 1
                        ? Wording.term.toLowerCase()
                        : Wording.terms.toLowerCase()}
                {:else if knowTerms.size === document.data.terms.length}
                    every {Wording.term.toLowerCase()}
                {:else}
                    no {Wording.terms.toLowerCase()}
                {/if},
            </p>

            <p>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fill-warning">
                    <path
                        d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z"
                    />
                </svg>

                You are still learning {#if stillLearningTerms.size > 0}
                    {stillLearningTerms.size}
                    {stillLearningTerms.size === 1
                        ? Wording.term.toLowerCase()
                        : Wording.terms.toLowerCase()}
                {:else if stillLearningTerms.size === document.data.terms.length}
                    every {Wording.term.toLowerCase()}
                {:else}
                    no {Wording.terms.toLowerCase()}
                {/if},
            </p>

            <p>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fill-alert">
                    <path
                        d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z"
                    />
                    <path
                        fill-rule="evenodd"
                        d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z"
                        clip-rule="evenodd"
                    />
                </svg>

                And you're struggling with {#if strugglingTerms.size > 0}
                    {strugglingTerms.size}
                    {strugglingTerms.size === 1
                        ? Wording.term.toLowerCase()
                        : Wording.terms.toLowerCase()}
                {:else if strugglingTerms.size === document.data.terms.length}
                    every {Wording.term.toLowerCase()}
                {:else}
                    no {Wording.terms.toLowerCase()}
                {/if}
            </p>
        </div>
    </div>

    <div class="mt-2 flex flex-wrap justify-end gap-4 lg:mt-0">
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
