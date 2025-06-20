import type { DropdownItemProperties } from "$lib/components/Dropdown";
import type { ClassValue } from "svelte/elements";
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

export enum DocumentFieldInputType {
    textbox,
    number,
    checkbox,
    dropdown,
}

export enum DocumentCreationStage {
    info,
    terms,
    permissions,
}

export type DocumentField = {
    defaultValue?: unknown;
    id: string;
    type: DocumentFieldType | Record<string, DocumentFieldType> | (string | number)[];
    input?: {
        position?: {
            stage?: DocumentCreationStage;
            group?: number;
            groupIndex?: number;
        };
        label?: string;
        type: DocumentFieldInputType;
        optional?: boolean;
        class?: ClassValue;
        properties?: {
            placeholder?: unknown;
            maxlength?: number;
            [key: string]: unknown;
        };
        dropdownItems?: DropdownItemProperties[];
    };
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
        id: "_id",
        type: DocumentFieldType.string,
    },
    {
        id: "created",
        type: DocumentFieldType.number,
    },
];

export const ownedDocumentFields: DocumentField[] = [
    ...documentFields,
    {
        id: "name",
        type: DocumentFieldType.string,
        input: {
            position: {
                stage: DocumentCreationStage.info,
                group: 0,
                groupIndex: 1,
            },
            label: "Name",
            type: DocumentFieldInputType.textbox,
            class: "grow",
            properties: { placeholder: "Things My Brain Keeps Forgetting", maxlength: 100 },
        },
    },
    {
        id: "desciption",
        type: DocumentFieldType.string,
        input: {
            position: {
                stage: DocumentCreationStage.info,
                group: 1,
            },
            label: "Desciption",
            type: DocumentFieldInputType.textbox,
            class: "w-full",
            optional: true,
            properties: {
                placeholder: "A wild collection of terms I *swear* I studied",
                multiline: true,
                maxlength: 500,
            },
        },
    },
    {
        id: "owner",
        type: DocumentFieldType.string,
    },
    {
        defaultValue: DocumentVisiblity.link,
        id: "visibility",
        type: Object.values(DocumentVisiblity),
        input: {
            position: {
                stage: DocumentCreationStage.info,
                group: 0,
                groupIndex: 0,
            },
            label: "Visibility",
            type: DocumentFieldInputType.dropdown,
            dropdownItems: [
                {
                    value: DocumentVisiblity.link,
                    text: "Link",
                    image: "/icons/general/Link.svg",
                },
                {
                    value: DocumentVisiblity.private,
                    text: "Private",
                    image: "/icons/general/Lock.svg",
                },
                {
                    value: DocumentVisiblity.public,
                    text: "Public",
                    image: "/icons/general/Web.svg",
                },
            ],
        },
    },
    {
        defaultValue: {},
        id: "permissions",
        type: DocumentFieldType.dictionary,
    },
];
