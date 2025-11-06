<script lang="ts">
    import type { SessionContext } from "$lib/utils/global";
    import { getContext } from "svelte";
    import { Section, SectionContent, SectionEntry, SectionInput, SectionTitle } from "./Section";

    const session: SessionContext = getContext("session");
</script>

<Section>
    <SectionTitle>Public Profile</SectionTitle>

    <SectionContent>
        <SectionEntry
            title="Account name"
            description="This is your public account name that will be displayed to other users."
        >
            <SectionInput
                value={session.user.name}
                placeholder="abc so cool"
                updateEndpoint={{
                    url: `/api/user/${session.user._id}`,
                    method: "PUT",
                    id: "name",
                }}
            />
        </SectionEntry>
    </SectionContent>
</Section>

<Section>
    <SectionTitle>Danger Zone</SectionTitle>

    <SectionContent>
        <SectionEntry
            title="Delete Account"
            description="Permanently delete your account and all associated data. This action cannot be undone."
        >
            <a class="button-attention clay-alert w-fit" href="/settings/delete-confirmation">
                Delete Account
            </a>
        </SectionEntry>
    </SectionContent>
</Section>
