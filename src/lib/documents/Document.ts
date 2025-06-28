import type { BaseUser } from "./User";

export enum DocumentType {
    user = "u",
    set = "s",
    folder = "f",
    session = "j",
    term = "t",
}

export enum DocumentPermission {
    view,
    edit,
    owner,
    none,
}

export enum DocumentVisiblity {
    link,
    private,
    public,
}

export enum DocumentFieldType {
    string = "string",
    number = "number",
    boolean = "boolean",
    array = "a",
    dictionary = "d",
}

export interface DocumentField {
    type: DocumentFieldType | Record<string, DocumentFieldType> | (string | number)[];
    properties: {
        isUserUpdateable: boolean;
        defaultValue?: unknown;
        isRequired?: boolean;
        maxlength?: number;
    };
}

export type DocumentFields = Record<string, DocumentField>;

export interface BaseDocument {
    _id: string;
    created: number;
}

export interface OwnedDocument extends BaseDocument {
    name: string;
    description: string;
    owner: string;
    visiblity: DocumentVisiblity;
    permissions: Record<string, DocumentPermission>;
}

export interface PublicOwnedDocument extends BaseDocument {
    name: string;
    description: string;
    owner: BaseUser;
}

export interface SimpleOwnedDocument extends PublicOwnedDocument {
    image?: string;
    metadata: { text: string; image?: string }[];
}

export const documentFields: DocumentFields = {
    _id: {
        type: DocumentFieldType.string,
        properties: {
            isUserUpdateable: false,
        },
    },
    created: {
        type: DocumentFieldType.number,
        properties: {
            isUserUpdateable: false,
        },
    },
};

export const ownedDocumentFields: DocumentFields = {
    ...documentFields,
    name: {
        type: DocumentFieldType.string,
        properties: {
            isUserUpdateable: true,
            isRequired: true,
            maxlength: 100,
        },
    },
    description: {
        type: DocumentFieldType.string,
        properties: {
            isUserUpdateable: true,
            isRequired: false,
            maxlength: 500,
        },
    },
    owner: {
        type: DocumentFieldType.string,
        properties: {
            isUserUpdateable: false,
        },
    },
    visiblity: {
        type: Object.values(DocumentVisiblity),
        properties: {
            defaultValue: DocumentVisiblity.link,
            isUserUpdateable: true,
        },
    },
    permissions: {
        type: DocumentFieldType.dictionary,
        properties: {
            defaultValue: {},
            isUserUpdateable: true,
        },
    },
};
