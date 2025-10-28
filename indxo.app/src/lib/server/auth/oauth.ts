import { dev } from "$app/environment";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";
import { Google } from "arctic";

export const google = new Google(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    dev
        ? "http://localhost:3000/api/auth/google/callback"
        : "https://indxo.app/api/auth/google/callback"
);
