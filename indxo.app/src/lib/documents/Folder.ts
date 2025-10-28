import {
    DocumentFieldType,
    ownedDocumentFields,
    type DocumentFields,
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

export const folderFields: DocumentFields = {
    ...ownedDocumentFields,
    icon: {
        type: DocumentFieldType.string,
        properties: {
            isRequired: true,
            isUserUpdateable: true,
            defaultValue: "/icons/folder/Folder.svg",
        },
    },
    sets: {
        type: DocumentFieldType.array,
        properties: {
            isRequired: true,
            isUserUpdateable: true,
            defaultValue: [],
        },
    },
};
