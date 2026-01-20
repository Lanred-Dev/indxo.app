<script lang="ts" module>
    export interface DocumentContext {
        data: BaseDocument & { [key: string]: any };
        permission: DocumentPermission;
        header: {
            showActions: boolean;
        };
    }
</script>

<script lang="ts">
    import {
        DocumentPermission,
        DocumentType,
        type BaseDocument,
        type PublicSet,
        type Term,
    } from "$lib/documents";
    import { setContext, type Component } from "svelte";
    import Header from "./Header.svelte";
    import FolderDocument from "./Folder/Document.svelte";
    import SetDocument from "./Set/Document.svelte";
    import UserDocument from "./User/Document.svelte";
    import determineDocumentType from "$lib/utils/document/determineType";
    import EmptyError from "./EmptyError.svelte";

    let { data } = $props();

    let showActions: boolean = $state.raw(true);
    let permission: DocumentPermission = $derived.by(
        () => data.permission ?? DocumentPermission.none
    );
    setContext("document", {
        get permission() {
            return permission;
        },
        get data() {
            return data.document;
        },
        header: {
            get showActions() {
                return showActions;
            },
            set showActions(newValue) {
                showActions = newValue;
            },
        },
    } satisfies DocumentContext);

    const DocumentComponent: Component<any> = $derived.by(() => {
        switch (determineDocumentType(data.document._id)) {
            case DocumentType.user:
                return UserDocument;
            case DocumentType.folder:
                return FolderDocument;
            default:
                return SetDocument;
        }
    });
</script>

{#if data.isEmpty}
    <EmptyError />
{:else}
    <Header />
    <DocumentComponent {...data.document} />
{/if}
