<script lang="ts">
    import { getContext, type Component } from "svelte";
    import Account from "./Account.svelte";
    import SetPreferences from "./SetPreferences.svelte";
    import { SegmentedButton, SegmentedButtonGroup } from "$lib/components/SegmentedButtonGroup";
    import { Wording } from "$lib/utils/wording";
    import { Tooltip, TooltipContent } from "$lib/components/Tooltip";
    import type { SessionContext } from "$lib/utils/global";
    import Appearance from "./Appearance.svelte";
    import FloatingControls from "$lib/components/FloatingControls.svelte";
    import { slide } from "svelte/transition";
    import { ResponseCodes } from "$lib/utils/apiResponses";
    import Loader from "$lib/components/Icons/Loader.svelte";

    const pages: {
        [id: string]: {
            id: string;
            text: string;
        };
    } = {
        account: { id: "a", text: "Account" },
        setPreferences: { id: "sp", text: `${Wording.set} Preferences` },
        appearance: { id: "app", text: "Appearance" },
    };

    const session: SessionContext = getContext("session");
    let currentPageID: string = $state.raw(pages.account.id);
    let PageComponent: Component<any> = $derived.by(() => {
        switch (currentPageID) {
            case pages.setPreferences.id:
                return SetPreferences;
            case pages.appearance.id:
                return Appearance;
            default:
                return Account;
        }
    });
    let isSubmitMessageVisible: boolean = $state.raw(false);
    let submitError: string | null = $state.raw(null);
    let changesMade: boolean = $state.raw(false);
    let lastSavedName: string = session.user.name;
    let lastSavedPreferences = JSON.stringify(session.user.preferences);
    let isSubmitting: boolean = $state.raw(false);

    function discardChanges() {
        isSubmitMessageVisible = false;
        session.user.name = lastSavedName;
        session.user.preferences = JSON.parse(lastSavedPreferences);
    }

    async function saveChanges() {
        isSubmitting = true;

        if (lastSavedName !== session.user.name) {
            const response = await fetch(`/api/user/${session.user._id}`, {
                method: "PUT",
                body: JSON.stringify({ name: session.user.name }),
            });

            if (response.status !== ResponseCodes.SuccessNoResponse) {
                try {
                    submitError = (await response.json()).message;
                } catch {
                    submitError = "An unknown error occured when saving your name.";
                }

                isSubmitMessageVisible = true;
                return;
            }

            lastSavedName = session.user.name;
        }

        if (lastSavedPreferences !== JSON.stringify(session.user.preferences)) {
            const response = await fetch(`/api/user/${session.user._id}`, {
                method: "PUT",
                body: JSON.stringify({
                    preferences: {
                        ...session.user.preferences,
                    },
                }),
            });

            if (response.status !== ResponseCodes.SuccessNoResponse) {
                try {
                    submitError = (await response.json()).message;
                } catch {
                    submitError = "An unknown error occurred when saving your preferences.";
                }

                isSubmitMessageVisible = true;
                return;
            }

            lastSavedPreferences = JSON.stringify(session.user.preferences);
        }

        submitError = null;
        isSubmitMessageVisible = true;
        changesMade = false;
        isSubmitting = false;
    }

    $effect(() => {
        changesMade =
            session.user.name !== lastSavedName ||
            JSON.stringify(session.user.preferences) !== lastSavedPreferences;
    });
</script>

<svelte:head>
    <title>Settings</title>
    <meta name="description" content="Manage your account and preferences." />
</svelte:head>

<Tooltip bind:isVisible={isSubmitMessageVisible} duration={5}>
    <TooltipContent class={submitError ? "bg-alert" : "bg-success"}>
        {#if submitError}
            {submitError}
        {:else}
            Your changes have been saved successfully.
        {/if}
    </TooltipContent>
</Tooltip>

<div class="page-title flex-wrap justify-between">
    <div class="flex items-center gap-4">
        <img class="image" src={session.user.picture} alt={session.user.name} />

        <div>
            <h1 class="title">{session.user.name}</h1>
            <p class="description">{session.user._id}</p>
        </div>
    </div>

    <a class="button-primary" href="/{session.user._id}">View Profile</a>
</div>

<SegmentedButtonGroup bind:value={currentPageID} class="mb-12">
    {#each Object.values(pages) as { id, text }}
        <SegmentedButton {id}>
            {text}
        </SegmentedButton>
    {/each}
</SegmentedButtonGroup>

<div>
    <PageComponent />
</div>

{#if changesMade}
    <FloatingControls>
        <button class="button-primary w-full" onclick={discardChanges} disabled={isSubmitting}>
            Discard Changes
        </button>

        <button class="button-attention w-full" onclick={saveChanges} disabled={isSubmitting}>
            {#if isSubmitting}
                <Loader size={1.75} color="black" />
            {:else}
                Save Changes
            {/if}
        </button>
    </FloatingControls>
{/if}
