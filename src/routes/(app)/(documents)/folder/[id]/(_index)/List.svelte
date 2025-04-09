<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import type { PublicSet } from "$lib/database/documents/Set";
    import determineWording from "$lib/utils/determineWording";

    let sets: PublicSet[] = $props();
</script>

<div class="list-primary">
    <ul class="list flex-col">
        {#each sets as set}
            <li>
                <Card
                    name={set.name}
                    description={set.description}
                    url={`/set/${set._id}`}
                    meta={[
                        set.subject,
                        `${set.terms.length} ${determineWording(set.terms.length === 1 ? "term" : "terms")}`,
                    ]}
                />
            </li>
        {/each}
    </ul>
</div>
