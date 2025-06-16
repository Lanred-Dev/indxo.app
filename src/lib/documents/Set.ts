import {
    DocumentFieldType,
    ownedDocumentFields,
    type DocumentField,
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

export const setFields: DocumentField[] = [
    ...ownedDocumentFields,
    {
        defaultValue: "",
        updateable: true,
        id: "subject",
        type: DocumentFieldType.string,
    },
    {
        defaultValue: [],
        updateable: true,
        id: "terms",
        type: DocumentFieldType.array,
    },
    {
        defaultValue: [],
        updateable: true,
        id: "folders",
        type: DocumentFieldType.array,
    },
];
