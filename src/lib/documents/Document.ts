import type { DocumentField } from "$lib/utils/document";
import type { BaseUser } from "./User";

export enum DocumentType {
    user = "u",
    set = "s",
    folder = "f",
    session = "j",
    term = "t",
}

export enum DocumentPermission {
    view = "view",
    edit = "edit",
    owner = "owner",
    none = "none",
}

export enum DocumentVisiblity {
    linkOnly = "linkOnly",
    private = "private",
    public = "public",
}

export interface BaseDocument {
    _id: string;
    created: number;
}

export interface OwnedDocument extends BaseDocument {
    name: string;
    description: string;
    owner: string;
    visiblity: DocumentVisiblity;
    permissions: { [id: string]: DocumentPermission };
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
        key: "_id",
        type: "string",
        defaultValue: "",
    },
    {
        key: "created",
        type: "number",
        defaultValue: "0",
    },
];

export const ownedDocumentFields: DocumentField[] = [
    ...documentFields,
    {
        key: "name",
        type: "string",
        defaultValue: "",
    },
    {
        key: "desciption",
        type: "string",
        defaultValue: "",
    },
    {
        key: "owner",
        type: "string",
        defaultValue: "",
    },
    {
        key: "visiblity",
        type: "string",
        defaultValue: "",
    },
    {
        key: "permissions",
        type: "dictionary",
        defaultValue: {},
    },
];
