<script lang="ts">
    import PageMessage from "$lib/components/PageMessage.svelte";
    import type { Term } from "$lib/database/documents/Set";
    import { onMount } from "svelte";
    import { formatDistanceToNow } from "date-fns";

    let { data } = $props();

    let terms: Term[] = $state(data.terms || []);
    let showDescription: boolean = $state(false);
    let currentTermIndex: number = $state(0);
    let currentTerm: Term = $derived(terms[currentTermIndex]);

    /**
     * Shuffle the terms in the set. Resets the current term to the first one.
     *
     * @returns never
     */
    function shuffle() {
        currentTermIndex = 0;
        showDescription = false;
        terms = terms.sort(() => Math.random() - 0.5);
    }

    /**
     * Cycle through the terms in the set.
     *
     * @param direction The direction to cycle in. -1 for previous, 1 for next.
     * @returns never
     */
    function cycle(direction: -1 | 1) {
        showDescription = false;
        currentTermIndex += direction;
    }

    onMount(async () => {
        await fetch(`/api/documents/set/${data._id}/open`);
    });
</script>

<svelte:head>
    {#if data.permission !== false}
        <title>{data.name} by {data.owner?.name}</title>
        <meta name="description" content={data.description} />
        <meta property="og:title" content={data.name} />
        <meta property="og:description" content={data.description} />
    {:else}
        <title>Not Found</title>
    {/if}
</svelte:head>

{#if data.permission === false}
    <PageMessage
        title="Sorry, couldn't find that set"
        text="The set you're looking for doesn't exist or you don't have permission to view it."
        button={["Go back", "/"]}
    />
{:else}
    <a class="flex-center gap-2" href="/account/{data.owner?._id}">
        <img
            src={data.owner?.image}
            alt={data.owner?.name}
            class="size-12 rounded-full border border-primary"
        />

        <div class="leading-tight">
            <p class="text-lg font-bold">{data.owner?.name}</p>
            <p class="text-light">
                Created {formatDistanceToNow(data.created || new Date(), {
                    includeSeconds: true,
                    addSuffix: true,
                })}
            </p>
        </div>
    </a>

    <div class="mt-6 space-y-4">
        <div class="leading-tight">
            <h1 class="text-5xl font-bold">{data.name}</h1>
            <p class="text-light text-2xl">{data.subject}</p>
        </div>

        <p class="text-lg">{data.description}</p>
    </div>

    <div class="mt-16 w-3/5 space-y-4">
        <div class="w-full">
            <button
                class="aspect-[1.9] w-full rounded-primary border border-primary bg-primary-200 shadow-2xl"
                onclick={() => (showDescription = !showDescription)}
            >
                {#if showDescription}
                    <p>{currentTerm.description}</p>
                {:else}
                    <p>{currentTerm.name}</p>
                {/if}
            </button>
        </div>

        <div class="flex-center relative w-full gap-4">
            <button class="primary" disabled={currentTermIndex === 0} onclick={() => cycle(-1)}>
                Previous
            </button>

            <p>{currentTermIndex + 1} / {terms.length}</p>

            <button
                class="primary"
                disabled={currentTermIndex === terms.length - 1}
                onclick={() => cycle(1)}
            >
                Next
            </button>

            <button class="y-center absolute right-0" onclick={() => shuffle()}> Shuffle </button>
        </div>
    </div>
{/if}
