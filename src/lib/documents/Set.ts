import {
    DocumentCreationStage,
    DocumentFieldInputType,
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
        id: "subject",
        type: DocumentFieldType.string,
        input: {
            position: {
                stage: DocumentCreationStage.info,
                group: 0,
                groupIndex: 2,
            },
            label: "Subject",
            type: DocumentFieldInputType.textbox,
            optional: true,
            class: "grow",
            properties: {
                placeholder: "Magical Math",
                maxlength: 100,
            },
        },
    },
    {
        id: "terms",
        type: DocumentFieldType.array,
    },
    {
        id: "folders",
        type: DocumentFieldType.array,
    },
];
