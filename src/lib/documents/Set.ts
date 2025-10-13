import { Wording } from "$lib/utils/wording";
import {
    DocumentFieldType,
    ownedDocumentFields,
    type DocumentFields,
    type OwnedDocument,
    type PublicOwnedDocument,
} from "./Document";
import type { Term } from "./Term";

export enum StudyMode {
    quiz = "q",
    cards = "c",
    sort = "sort",
}

export const StudyModes: { [mode in StudyMode]: { text: string; url: string; icon: string } } = {
    [StudyMode.quiz]: {
        text: Wording.quizMode,
        url: `/quiz/[id]`,
        icon: "/icons/general/Quiz.svg",
    },
    [StudyMode.cards]: {
        text: Wording.cards,
        url: `/[id]/${StudyMode.cards}`,
        icon: "/icons/general/Cards.svg",
    },
    [StudyMode.sort]: {
        text: Wording.sortMode,
        url: `/[id]/${StudyMode.sort}`,
        icon: "/icons/general/Sort.svg",
    },
};

export interface Set extends OwnedDocument {
    subject: string;
    terms: Term[];
    folders: string[];
}

export interface PublicSet extends PublicOwnedDocument {
    subject: string;
    terms: Term[];
    folders: string[];
}

export const setFields: DocumentFields = {
    ...ownedDocumentFields,
    subject: {
        type: DocumentFieldType.string,
        properties: {
            isRequired: false,
            isUserUpdateable: true,
            maxlength: 100,
        },
    },
    terms: {
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
            isRequired: false,
            defaultValue: [],
        },
    },
    termTags: {
        type: DocumentFieldType.array,
        properties: {
            isUserUpdateable: true,
            isRequired: true,
            defaultValue: [],
        },
    },
};
