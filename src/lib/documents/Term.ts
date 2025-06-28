import {
    documentFields,
    DocumentFieldType,
    type BaseDocument,
    type DocumentFields,
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

export const termFields: DocumentFields = {
    ...documentFields,
    term: {
        type: DocumentFieldType.string,
        properties: {
            isRequired: true,
            isUserUpdateable: true,
            maxlength: 100,
        },
    },
    definition: {
        type: DocumentFieldType.string,
        properties: {
            isRequired: true,
            isUserUpdateable: true,
            maxlength: 200,
        },
    },
    image: {
        type: DocumentFieldType.string,
        properties: {
            isRequired: false,
            isUserUpdateable: true,
        },
    },
};
