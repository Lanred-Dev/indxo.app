import { Google } from "arctic";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";
import { dev } from "$app/environment";

export const google = new Google(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    dev
        ? "http://localhost:3000/api/auth/google/callback"
        : "https://indxo.app/api/auth/google/callback"
);
