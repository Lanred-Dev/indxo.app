import type { DocumentField } from "$lib/utils/document";
import { ownedDocumentFields, type OwnedDocument, type PublicOwnedDocument } from "./Document";
import type { PublicSet } from "./Set";

export interface Folder extends OwnedDocument {
    icon: string;
    sets: string[];
}

export interface PublicFolder extends PublicOwnedDocument {
    icon: string;
    sets: PublicSet[];
}

export const folderFields: DocumentField[] = [
    ...ownedDocumentFields,
    {
        key: "icon",
        type: "string",
        defaultValue: "",
    },
    {
        key: "sets",
        type: "array",
        defaultValue: [],
    },
];
