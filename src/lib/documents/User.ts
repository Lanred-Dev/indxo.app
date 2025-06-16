import {
    documentFields,
    DocumentFieldType,
    type BaseDocument,
    type DocumentField,
} from "./Document";
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
        documentsOpenedAt: Record<string, number>;
        sets: Record<
            string,
            {
                sorting: any;
            }
        >;
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
    favorites: string[];
}

export const emptySessionUser: SessionUser = {
    _id: "",
    name: "",
    picture: "",
    email: "",
    preferences: {
        home: [],
        strugglingTermThreshold: 3,
    },
    favorites: [],
};

export const userFields: DocumentField[] = [
    ...documentFields,
    {
        id: "googleID",
        type: DocumentFieldType.string,
    },
    {
        id: "email",
        type: DocumentFieldType.string,
    },
    {
        id: "name",
        type: DocumentFieldType.string,
    },
    {
        id: "picture",
        type: DocumentFieldType.string,
    },
    {
        defaultValue: [],
        id: "sets",
        type: DocumentFieldType.array,
    },
    {
        defaultValue: [],
        id: "folders",
        type: DocumentFieldType.array,
    },
    {
        defaultValue: [],
        id: "favorites",
        type: DocumentFieldType.array,
    },
    {
        defaultValue: {
            home: [],
            strugglingTermThreshold: 3,
        },
        id: "preferences",
        type: {
            home: DocumentFieldType.array,
            strugglingTermThreshold: DocumentFieldType.number,
        },
    },
    {
        defaultValue: {
            documentsOpenedAt: {},
            sets: {},
        },
        id: "metadata",
        type: {
            documentsOpenedAt: DocumentFieldType.dictionary,
            sets: DocumentFieldType.dictionary,
        },
    },
];
