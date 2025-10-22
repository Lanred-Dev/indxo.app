import type { Session, SessionUser } from "$lib/documents";

declare global {
    namespace App {
        interface Locals {
            session: Session | null;
            // NOTE: If the user is not logged in, this will be an empty user object.
            user: SessionUser;
        }
    }
}

export {};
