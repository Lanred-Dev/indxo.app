<script lang="ts" module>
    export interface DocumentContext {
        [key: string]: any;
        permission: DocumentPermission;
        isFavorite: boolean;
    }
</script>

<script lang="ts">
    import { DocumentPermission, DocumentType, type PublicSet, type Term } from "$lib/documents";
    import { setContext, type Component } from "svelte";
    import Header from "./Header.svelte";
    import FolderDocument from "./Folder/Document.svelte";
    import SetDocument from "./(set)/(_index)/Document.svelte";
    import UserDocument from "./User/Document.svelte";
    import determineDocumentType from "$lib/utils/document/determineType";

    let { data } = $props();
    let { document, permission, isFavorite: initialIsFavorite } = data;

    let isFavorite = $state.raw(initialIsFavorite);
    let terms: Term[] = $state.raw("terms" in document ? document.terms : []);
    setContext("document", {
        ...document,
        get terms() {
            return terms;
        },
        set terms(newValue) {
            terms = newValue;
        },
        permission: permission ?? DocumentPermission.none,
        get isFavorite() {
            return isFavorite;
        },
        set isFavorite(newValue) {
            isFavorite = newValue;
        },
    } satisfies DocumentContext);

    const DocumentComponent: Component<any> = $derived.by(() => {
        switch (determineDocumentType(document._id)) {
            case DocumentType.user:
                return UserDocument;
            case DocumentType.set:
                return SetDocument;
            case DocumentType.folder:
                return FolderDocument;
            default:
                // NOTE: This should never happen but this just fixes type warnings.
                return SetDocument;
        }
    });
</script>

<Header />

<DocumentComponent {...document} />
