import {
    documentFields,
    DocumentFieldType,
    type BaseDocument,
    type DocumentField,
} from "./Document";

export interface Term extends BaseDocument {
    term: string;
    definition: string;
    image?: string;
}

export interface SortedTerm {
    _id: string;
    timesMissed: number;
    knows: boolean;
    sorted: boolean;
}

export const termFields: DocumentField[] = [
    ...documentFields,
    {
        id: "term",
        type: DocumentFieldType.string,
    },
    {
        id: "definition",
        type: DocumentFieldType.string,
    },
    {
        optional: true,
        id: "image",
        type: DocumentFieldType.string,
    },
];
