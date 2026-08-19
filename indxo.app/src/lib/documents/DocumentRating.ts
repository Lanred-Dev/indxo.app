import { DocumentFieldType, type DocumentFields } from "./Document";

export interface UserDocumentRating {
    rating: number;
    user: string;
}

export interface DocumentRating {
    _id: string;
    average: number;
    reviews: UserDocumentRating[];
}

export const documentRatingFields: DocumentFields = {
    _id: {
        type: DocumentFieldType.string,
        properties: {
            isUserUpdateable: false,
        },
    },
    average: {
        type: DocumentFieldType.number,
        properties: {
            isUserUpdateable: false,
        },
    },
    reviews: {
        type: DocumentFieldType.array,
        properties: {
            isUserUpdateable: false,
        },
    },
};
