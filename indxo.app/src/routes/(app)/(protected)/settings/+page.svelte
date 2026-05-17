<script lang="ts" module>
    export interface SettingsPageContext {
        showSubmitMessage: (isError: boolean) => void;
    }
</script>

<script lang="ts">
    import { getContext, setContext, type Component } from "svelte";
    import Account from "./Account.svelte";
    import SetPreferences from "./SetPreferences.svelte";
    import { SegmentedButton, SegmentedButtonGroup } from "$lib/components/SegmentedButtonGroup";
    import { Wording } from "$lib/utils/wording";
    import Tooltip from "$lib/components/Tooltip.svelte";
    import {
        PopupContent,
        PopupRelativity,
        PopupXAlignment,
        PopupYAlignment,
    } from "$lib/components/Popup";
    import type { SessionContext } from "$lib/utils/global";
    import Appearance from "./Appearance.svelte";

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
    let isSubmitError: boolean = $state.raw(false);

    setContext("settingsPage", {
        showSubmitMessage(isError: boolean) {
            isSubmitMessageVisible = true;
            isSubmitError = isError;
        },
    } satisfies SettingsPageContext);
</script>

<svelte:head>
    <title>Settings</title>
    <meta name="description" content="Manage your account and preferences." />
</svelte:head>

<Tooltip bind:isVisible={isSubmitMessageVisible} duration={5}>
    <PopupContent
        class={isSubmitError ? "bg-alert" : "bg-success"}
        xAlignment={PopupXAlignment.center}
        yAlignment={PopupYAlignment.bottom}
        positionRelativity={PopupRelativity.page}
        offset={15}
    >
        {#if isSubmitError}
            An error occurred while saving your changes.
        {:else}
            Your changes have been saved successfully.
        {/if}
    </PopupContent>
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

<PageComponent />
