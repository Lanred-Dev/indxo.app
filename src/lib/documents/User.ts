import type { DocumentField } from "$lib/utils/document";
import { documentFields, type BaseDocument } from "./Document";
import type { PublicFolder } from "./Folder";
import type { PublicSet } from "./Set";

type UserPreferences = {
    home: any[];
    strugglingTermThreshold: number;
};

export interface BaseUser extends BaseDocument {
    name: string;
    picture: string;
}

export interface User extends BaseUser {
    googleID: string;
    email: string;
    sets: string[];
    folders: string[];
    favorites: string[];
    preferences: UserPreferences;
    metadata: {
        documentsOpenedAt: {
            [id: string]: number;
        };
        sets: {
            [id: string]: {
                sorting: any;
            };
        };
    };
}

export interface PublicUser extends BaseUser {
    sets: PublicSet[];
    folders: PublicFolder[];
    favorites: string[];
}

export interface SessionUser {
    _id: string;
    name: string;
    picture: string;
    email: string;
    preferences: UserPreferences;
}

export const emptySessionUser: SessionUser = {
    _id: "",
    name: "",
    picture: "",
    email: "",
    preferences: {
        home: [],
        strugglingTermThreshold: 0,
    },
};

export const userFields: DocumentField[] = [
    ...documentFields,
    {
        key: "googleID",
        type: "string",
        defaultValue: "",
    },
    {
        key: "email",
        type: "string",
        defaultValue: "",
    },
    {
        key: "name",
        type: "string",
        defaultValue: "",
    },
    {
        key: "picture",
        type: "string",
        defaultValue: "",
    },
    {
        key: "sets",
        type: "array",
        defaultValue: [],
    },
    {
        key: "folders",
        type: "array",
        defaultValue: [],
    },
    {
        key: "favorites",
        type: "array",
        defaultValue: [],
    },
    {
        key: "preferences",
        type: "dictionary",
        defaultValue: {},
    },
    {
        key: "metadata",
        type: "dictionary",
        defaultValue: {
            documentsOpenedAt: {},
            sets: {},
        },
    },
];
