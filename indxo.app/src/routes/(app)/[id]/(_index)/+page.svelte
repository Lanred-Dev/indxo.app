<script lang="ts" module>
    export interface DocumentContext {
        [key: string]: any;
        permission: DocumentPermission;
        isFavorite: boolean;
    }

    export interface DocumentHeaderContext {
        showActions: boolean;
    }
</script>

<script lang="ts">
    import { DocumentPermission, DocumentType, type PublicSet, type Term } from "$lib/documents";
    import { setContext, type Component } from "svelte";
    import Header from "./Header.svelte";
    import FolderDocument from "./Folder/Document.svelte";
    import SetDocument from "./Set/Document.svelte";
    import UserDocument from "./User/Document.svelte";
    import determineDocumentType from "$lib/utils/document/determineType";
    import EmptyError from "./EmptyError.svelte";

    let { data } = $props();

    let isFavorite = $state.raw(data.isFavorite);
    let terms: Term[] = $state.raw("terms" in data.document ? data.document.terms : []);
    setContext("document", {
        ...data.document,
        get name() {
            return data.document.name;
        },
        get _id() {
            return data.document._id;
        },
        get terms() {
            return terms;
        },
        set terms(newValue) {
            terms = newValue;
        },
        permission: data.permission ?? DocumentPermission.none,
        get isFavorite() {
            return isFavorite;
        },
        set isFavorite(newValue) {
            isFavorite = newValue;
        },
    } satisfies DocumentContext);

    let showActions: boolean = $state.raw(true);
    setContext("documentHeader", {
        get showActions() {
            return showActions;
        },
        set showActions(newValue) {
            showActions = newValue;
        },
    } satisfies DocumentHeaderContext);

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
