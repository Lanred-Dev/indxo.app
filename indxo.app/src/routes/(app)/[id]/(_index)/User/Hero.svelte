<script lang="ts">
    import { getContext } from "svelte";
    import type { DocumentContext } from "../+page.svelte";
    import StarRating from "$lib/components/StarRating.svelte";

    const document: DocumentContext = getContext("document");
</script>

<div class="page-title relative h-1/3 w-full">
    <div class="x-center bottom-1/6">
        <img
            src={document.data.picture}
            class="mx-auto mb-2 size-16 rounded-full"
            alt={document.data.name}
        />

        <div class="flex flex-col items-center">
            <h1 class="title">{document.data.name}</h1>
            <StarRating rating={document.data.rating.average} reviews={document.data.rating.reviews.length} />
        </div>
    </div>
</div>
