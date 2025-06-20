import {
    DocumentFieldType,
    ownedDocumentFields,
    type DocumentField,
    type OwnedDocument,
    type PublicOwnedDocument,
} from "./Document";
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
        id: "icon",
        type: DocumentFieldType.string,
    },
    {
        id: "sets",
        type: DocumentFieldType.array,
    },
];
