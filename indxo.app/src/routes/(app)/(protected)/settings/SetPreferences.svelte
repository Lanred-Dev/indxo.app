<script lang="ts">
    import type { SessionContext } from "$lib/utils/global";
    import { getContext } from "svelte";
    import { Section, SectionContent, SectionEntry, SectionInput, SectionTitle } from "./Section";
    import { Wording } from "$lib/utils/wording";
    import { SettingInputType } from "./Section/Input.svelte";

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
                type={SettingInputType.number}
                placeholder="3"
                properties={{
                    min: 1,
                    max: 10,
                }}
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
                type={SettingInputType.boolean}
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

        <SectionEntry
            title="Animated {Wording.term} Cards"
            description="Whether to animate {Wording.term} when flipping or cycling through them."
        >
            <SectionInput
                value={session.user.preferences.animatedTermCards}
                type={SettingInputType.boolean}
                placeholder="true"
                onUpdate={async (value: boolean) => {
                    const response = await fetch(`/api/user/${session.user._id}`, {
                        method: "PUT",
                        body: JSON.stringify({
                            preferences: {
                                ...session.user.preferences,
                                animatedTermCards: value,
                            },
                        }),
                    });

                    return response.ok;
                }}
            />
        </SectionEntry>
    </SectionContent>
</Section>
