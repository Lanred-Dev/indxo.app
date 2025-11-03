<script lang="ts" module>
    export interface SettingsPageContext {
        showSubmitErrorMessage: () => void;
    }
</script>

<script lang="ts">
    import { setContext, type Component } from "svelte";
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

    const pages: {
        [id: string]: {
            id: string;
            text: string;
        };
    } = {
        account: { id: "a", text: "Account" },
        setPreferences: { id: "sp", text: `${Wording.set} Preferences` },
    };

    let currentPageID: string = $state.raw(pages.account.id);
    let PageComponent: Component<any> = $derived.by(() => {
        switch (currentPageID) {
            case pages.setPreferences.id:
                return SetPreferences;
            default:
                return Account;
        }
    });
    let isSubmitMessageVisible: boolean = $state.raw(false);

    setContext("settingsPage", {
        showSubmitErrorMessage() {
            isSubmitMessageVisible = true;
        },
    } satisfies SettingsPageContext);
</script>

<svelte:head>
    <title>Settings</title>
    <meta name="description" content="Manage your account and preferences." />
</svelte:head>

<Tooltip bind:isVisible={isSubmitMessageVisible} duration={5}>
    <PopupContent
        class="bg-alert"
        xAlignment={PopupXAlignment.center}
        yAlignment={PopupYAlignment.bottom}
        positionRelativity={PopupRelativity.page}
        offset={15}
    >
        An error occurred while saving your changes.
    </PopupContent>
</Tooltip>

<div class="page-title">
    <h1 class="title">Settings</h1>
    <p class="description">Manage your account and preferences.</p>
</div>

<SegmentedButtonGroup bind:value={currentPageID} class="mb-12">
    {#each Object.values(pages) as { id, text }}
        <SegmentedButton {id}>
            {text}
        </SegmentedButton>
    {/each}
</SegmentedButtonGroup>

<PageComponent />
