import type { CardDocumentType, CardGroup } from "$lib/components/Card";
import { millisecondsToMinutes } from "date-fns";
import type { ComponentProps } from "svelte";

export interface SearchableListFilter {
    id: string;
    name: string;
    apply: (query: string, documents: CardDocumentType[]) => ComponentProps<typeof CardGroup>[];
}

const validSearchFields: string[] = ["name", "description", "subject"];
// NOTE: These numbers are in minutes
const createdFilterGroups: [string, number][] = [
    ["Just now", 5],
    ["A few minutes ago", 60],
    ["A few hours ago", 240],
    ["Today", 1440],
    ["Yesterday", 2880],
    ["This week", 10080],
    ["This month", 43800],
    ["This year", 525600],
    ["A long time ago", Infinity],
];

function checkIfDocumentAndQueryMatch(query: string, document: CardDocumentType): boolean {
    let matches: boolean = true;

    if (query.length > 0) {
        matches = validSearchFields.some((field) => {
            if (!(field in document)) return false;

            const value = document[field as keyof CardDocumentType];
            return typeof value === "string" && value.toLowerCase().includes(query.toLowerCase());
        });
    }

    return matches;
}

function sortGroupByCreated(documents: CardDocumentType[]): CardDocumentType[] {
    return documents.sort((document1, document2) => {
        const relative1: number = Date.now() - document1.created;
        const relative2: number = Date.now() - document2.created;
        return relative1 - relative2;
    });
}

const sortFunctions: Record<string, SearchableListFilter> = {
    none: {
        id: "n",
        name: "None",
        apply: (query, documents) => {
            return [
                {
                    documents: documents.filter((document) =>
                        checkIfDocumentAndQueryMatch(query, document)
                    ),
                },
            ];
        },
    },
    alphabetical: {
        id: "a",
        name: "Alphabetical",
        apply: (query, documents) => {
            let groups: ComponentProps<typeof CardGroup>[] = [];

            documents
                .filter((document) => checkIfDocumentAndQueryMatch(query, document))
                .forEach((document) => {
                    let group: string = document.name.charAt(0).toUpperCase();

                    if (!groups.find(({ name }) => name === group))
                        groups.push({ name: group, documents: [] });

                    let groupIndex: number = groups.findIndex(({ name }) => name === group);
                    groups[groupIndex].documents.push(document);
                });

            return groups
                .sort(({ name: name1 }, { name: name2 }) => name1!.localeCompare(name2!))
                .map(({ name, documents }) => {
                    return {
                        name,
                        documents: sortGroupByCreated(documents),
                    };
                });
        },
    },
    created: {
        id: "c",
        name: "Created",
        apply: (query, documents) => {
            documents = documents.filter((document) =>
                checkIfDocumentAndQueryMatch(query, document)
            );

            let groups: ComponentProps<typeof CardGroup>[] = [];

            createdFilterGroups.forEach(([label, minutes], index) => {
                const previousMinutes: number = createdFilterGroups[index - 1]?.[1] || 0;

                let filteredDocuments: CardDocumentType[] = documents.filter(({ created }) => {
                    // Adding 0.01 prevents the number from being 0
                    const minutesSinceCreated: number =
                        millisecondsToMinutes(Date.now() - created) + 0.01;
                    return minutesSinceCreated <= minutes && minutesSinceCreated > previousMinutes;
                });

                if (filteredDocuments.length > 0)
                    groups.push({
                        name: label,
                        documents: sortGroupByCreated(filteredDocuments),
                    });
            });

            return groups;
        },
    },
    subject: {
        id: "s",
        name: "Subject",
        apply: (query, documents) => {
            let groups: ComponentProps<typeof CardGroup>[] = [];

            documents
                .filter((document) => checkIfDocumentAndQueryMatch(query, document))
                .forEach((document) => {
                    let subject: string = "subject" in document ? document.subject : "";

                    if (!groups.find(({ name }) => name?.toLowerCase() === subject.toLowerCase()))
                        groups.push({ name: subject, documents: [] });

                    let groupIndex: number = groups.findIndex(
                        ({ name }) => name?.toLowerCase() === subject.toLowerCase()
                    );
                    groups[groupIndex].documents.push(document);
                });

            return groups
                .sort(({ name: name1 }, { name: name2 }) => name1!.localeCompare(name2!))
                .map(({ name, documents }) => {
                    return {
                        name,
                        documents: sortGroupByCreated(documents),
                    };
                });
        },
    },
};

export default sortFunctions;
