import {
    DocumentFieldInputType,
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
        input: {
            type: DocumentFieldInputType.textbox,
            properties: {
                placeholder: "Quantum Waffle",
                maxlength: 200,
            },
        },
    },
    {
        id: "definition",
        type: DocumentFieldType.string,
        input: {
            type: DocumentFieldInputType.textbox,
            properties: {
                placeholder: "A subatomic particle that only appears when you're not looking",
                multiline: true,
                maxlength: 200,
            },
        },
    },
    {
        id: "image",
        type: DocumentFieldType.string,
    },
];
