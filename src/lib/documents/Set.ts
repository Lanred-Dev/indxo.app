import {
    DocumentFieldType,
    ownedDocumentFields,
    type DocumentFields,
    type OwnedDocument,
    type PublicOwnedDocument,
} from "./Document";
import type { Term } from "./Term";

export interface Set extends OwnedDocument {
    subject: string;
    terms: Term[];
    folders: string[];
}

export interface PublicSet extends PublicOwnedDocument {
    subject: string;
    terms: Term[];
    folders: string[];
}

export const setFields: DocumentFields = {
    ...ownedDocumentFields,
    subject: {
        type: DocumentFieldType.string,
        properties: {
            isRequired: false,
            isUserUpdateable: true,
            maxlength: 100,
        },
    },
    terms: {
        type: DocumentFieldType.array,
        properties: {
            isUserUpdateable: true,
            isRequired: true,
            defaultValue: [],
        },
    },
    folders: {
        type: DocumentFieldType.array,
        properties: {
            isUserUpdateable: true,
            isRequired: false,
            defaultValue: [],
        },
    },
};
