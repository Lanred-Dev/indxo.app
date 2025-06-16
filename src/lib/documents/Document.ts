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

export type DocumentField = {
    placeholder?: string;
    optional?: boolean;
    defaultValue?: unknown;
    updateable?: boolean;
    id: string;
    type: DocumentFieldType | Record<string, DocumentFieldType> | (string | number)[];
};

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

export const documentFields: DocumentField[] = [
    {
        updateable: false,
        id: "_id",
        type: DocumentFieldType.string,
    },
    {
        updateable: false,
        id: "created",
        type: DocumentFieldType.number,
    },
];

export const ownedDocumentFields: DocumentField[] = [
    ...documentFields,
    {
        updateable: true,
        id: "name",
        type: DocumentFieldType.string,
    },
    {
        updateable: true,
        id: "desciption",
        type: DocumentFieldType.string,
    },
    {
        id: "owner",
        type: DocumentFieldType.string,
    },
    {
        defaultValue: DocumentVisiblity.private,
        updateable: true,
        id: "visiblity",
        type: Object.values(DocumentVisiblity),
    },
    {
        defaultValue: {},
        updateable: true,
        id: "permissions",
        type: DocumentFieldType.dictionary,
    },
];
