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
    Unauthorized = "You are not authorized to perform this action.",
    UserUnauthorized = "Your user does not have permission to perform this action.",
    NotFound = "This document does not exist.",
    InvalidDocumentType = "Invalid document type for this request.",
}
