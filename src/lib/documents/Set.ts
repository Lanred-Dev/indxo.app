import type { DocumentField } from "$lib/utils/document";
import { ownedDocumentFields, type OwnedDocument, type PublicOwnedDocument } from "./Document";
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
        key: "subject",
        type: "string",
        defaultValue: "",
    },
    {
        key: "terms",
        type: "array",
        defaultValue: [],
    },
    {
        key: "folders",
        type: "array",
        defaultValue: [],
    },
];
