<script lang="ts">
    import type { SessionContext } from "$lib/utils/global";
    import { getContext } from "svelte";
    import { Section, SectionContent, SectionEntry, SectionInput, SectionTitle } from "./Section";
    import { Wording } from "$lib/utils/wording";

    const session: SessionContext = getContext("session");
</script>

<Section>
    <SectionTitle>{Wording.sortMode}</SectionTitle>

    <SectionContent>
        <SectionEntry
            title="Struggling {Wording.term} Threshold"
            description="How many times you must get a {Wording.term} wrong that you find difficult before its considered struggling."
        >
            <SectionInput
                value={session.user.preferences.strugglingTermThreshold}
                placeholder="5"
                onUpdate={async (value: number) => {
                    const response = await fetch(`/api/user/${session.user._id}`, {
                        method: "PUT",
                        body: JSON.stringify({
                            preferences: {
                                ...session.user.preferences,
                                strugglingTermThreshold: value,
                            },
                        }),
                    });

                    return response.ok;
                }}
            />
        </SectionEntry>
    </SectionContent>
</Section>

<Section>
    <SectionTitle>{Wording.cards}</SectionTitle>

    <SectionContent>
        <SectionEntry
            title="Show {Wording.term} on Definition Side"
            description="Whether to show the {Wording.term} on the definition side."
        >
            <SectionInput
                value={session.user.preferences.showTermOnDefinitionSide}
                placeholder="true"
                onUpdate={async (value: boolean) => {
                    const response = await fetch(`/api/user/${session.user._id}`, {
                        method: "PUT",
                        body: JSON.stringify({
                            preferences: {
                                ...session.user.preferences,
                                showTermOnDefinitionSide: value,
                            },
                        }),
                    });

                    return response.ok;
                }}
            />
        </SectionEntry>
    </SectionContent>
</Section>
