import {
    documentFields,
    DocumentFieldType,
    type BaseDocument,
    type DocumentFields,
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

export interface SortedSetMetadata {
    terms: {
        [termID: string]: {
            timesMissed: number;
            struggling: boolean;
            sorted: boolean;
        };
    };
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
                sorting: SortedSetMetadata;
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

export const userFields: DocumentFields = {
    ...documentFields,
    googleID: {
        type: DocumentFieldType.string,
        properties: {
            isUserUpdateable: false,
        },
    },
    email: {
        type: DocumentFieldType.string,
        properties: {
            isUserUpdateable: false,
        },
    },
    name: {
        type: DocumentFieldType.string,
        properties: {
            isUserUpdateable: true,
            isRequired: true,
            maxlength: 100,
        },
    },
    picture: {
        type: DocumentFieldType.string,
        properties: {
            isUserUpdateable: true,
            isRequired: true,
        },
    },
    sets: {
        type: DocumentFieldType.array,
        properties: {
            isUserUpdateable: true,
            isRequired: true,
            defaultValue: [],
        },
    },
    folders: {
        type: DocumentFieldType.array,
        properties: {
            isUserUpdateable: true,
            isRequired: true,
            defaultValue: [],
        },
    },
    favorites: {
        type: DocumentFieldType.array,
        properties: {
            isUserUpdateable: true,
            isRequired: true,
            defaultValue: [],
        },
    },
    preferences: {
        type: {
            home: DocumentFieldType.array,
            strugglingTermThreshold: DocumentFieldType.number,
        },
        properties: {
            isUserUpdateable: true,
            defaultValue: {
                home: [],
                strugglingTermThreshold: 3,
            },
        },
    },
    metadata: {
        type: {
            documentsOpenedAt: DocumentFieldType.dictionary,
            sets: DocumentFieldType.dictionary,
        },
        properties: {
            isUserUpdateable: false,
            defaultValue: {
                documentsOpenedAt: {},
                sets: {},
            },
        },
    },
};
