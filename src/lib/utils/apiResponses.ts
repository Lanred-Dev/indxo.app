export enum ResponseCodes {
    BadRequest = 400,
    ServerError = 500,
    Unauthorized = 401,
    UserUnauthorized = 403,
    NotFound = 404,
    SuccessNoResponse = 204,
    Success = 200,
    Redirect = 307,
    InvalidMediaType = 415,
    ContentTooLarge = 413,
}

// NOTE: These are generic responses and dont always have to be used.
export enum ResponseMessages {
    Unauthorized = "Unauthorized.",
    UserUnauthorized = "You do not have authorization for this document.",
    NotFound = "Could not find document.",
    InvalidDocumentType = "Invalid document type.",
}
