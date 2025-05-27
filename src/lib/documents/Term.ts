import type { BaseDocument } from "./Document";

export interface Term extends BaseDocument {
    term: string;
    definition: string;
    image?: string;
}

export interface SortedTerm {
    _id: string;
    timesMissed: number;
    knows: boolean;
    sorted: boolean;
}
