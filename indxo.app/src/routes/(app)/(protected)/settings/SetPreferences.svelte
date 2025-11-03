<script lang="ts">
    import type { SessionContext } from "$lib/utils/global";
    import { getContext } from "svelte";
    import { Section, SectionContent, SectionEntry, SectionInput, SectionTitle } from "./Section";
    import { Wording } from "$lib/utils/wording";

    const session: SessionContext = getContext("session");
</script>

<Section>
    <SectionTitle>Study</SectionTitle>

    <SectionContent>
        <SectionEntry
            title="Struggling {Wording.term} Threshold"
            description="How many times you must get a {Wording.term} wrong that you find difficult before its considered struggling."
        >
            <SectionInput
                value={session.user.preferences.strugglingTermThreshold}
                placeholder="5"
                onUpdate={async (newValue: string) => {
                    const response = await fetch(`/api/user/${session.user._id}`, {
                        method: "PUT",
                        body: JSON.stringify({
                            preferences: {
                                ...session.user.preferences,
                                strugglingTermThreshold: Number(newValue),
                            },
                        }),
                    });

                    return response.ok;
                }}
            />
        </SectionEntry>
    </SectionContent>
</Section>
