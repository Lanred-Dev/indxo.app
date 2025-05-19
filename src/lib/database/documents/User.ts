// This document is used to represent a user in the database.

import type { Document } from "mongodb";
import type { Folder } from "./Folder";
import type { Set } from "./Set";

type Favorite = [string, "set" | "folder"];

type Preferences = {
    home: HomeSection[];
    strugglingTermThreshold: number;
};

export type SortingTerm = {
    _id: string;
    knows: boolean;
    missed: number;
    sorted: boolean;
};

export type HomeSection = { id: string; endpoint: string };

export interface User extends Document {
    _id: string;
    google: string;
    name: string;
    email: string;
    image: string;
    banned: boolean;
    sets: string[];
    folders: string[];
    favorites: Favorite[];
    openedSets: [string, number][];
    sorting: {
        [id: string]: SortingTerm[];
    };
    preferences: Preferences;
}

export interface PublicUser {
    _id: string;
    name: string;
    image: string;
    sets: Set[];
    folders: Folder[];
    favorites: Favorite[];
}

export interface SimpleUser {
    _id: string;
    name: string;
    image: string;
}

export interface SimplePrivateuser {
    _id: string;
    name: string;
    image: string;
    email: string;
    preferences: Preferences;
}

export const fields: {
    key: string;
    type: "string" | "boolean" | "array" | "dictionary";
    defaultValue: any;
}[] = [
    {
        key: "banned",
        type: "boolean",
        defaultValue: false,
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
        key: "openedSets",
        type: "array",
        defaultValue: [],
    },
    {
        key: "sorting",
        type: "dictionary",
        defaultValue: {},
    },
    {
        key: "preferences",
        type: "dictionary",
        defaultValue: {
            home: [],
            strugglingTermThreshold: 3,
        },
    },
];
