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
    tags: {
        type: DocumentFieldType.array,
        properties: {
            isRequired: false,
            isUserUpdateable: true,
        },
    },
};

export const termPlaceholders: { term: string; definition: string }[] = [
    {
        term: "Procrastination",
        definition:
            "The noble art of doing everything except the thing you're supposed to be doing.",
    },
    {
        term: "Photosynthesis",
        definition: "Plant magic that turns sunlight into leafy snacks. No plug needed.",
    },
    {
        term: "Hypotenuse",
        definition: "That one triangle side that thinks it’s better than everyone else.",
    },
    {
        term: "Cramming",
        definition: "Academic panic yoga. Flex those brain muscles at 2AM!",
    },
    {
        term: "Onomatopoeia",
        definition: "Bam! Boom! Pop! Words that sound like your brain during finals week.",
    },
    {
        term: "Mitochondria",
        definition: "The cell’s power plant—and the only thing you remember from biology.",
    },
    {
        term: "Irony",
        definition: "Like a spelling bee champion misspelling 'spelling.'",
    },
    {
        term: "Pi",
        definition: "A number that goes on forever—just like your teacher's lecture.",
    },
    {
        term: "Gravity",
        definition: "The invisible force that makes toast land butter-side down.",
    },
    {
        term: "Allegory",
        definition: "A story wearing a disguise. It's Shrek, but for English class.",
    },
];
