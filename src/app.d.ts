import type { Session } from "$lib/database/documents/Session";
import type { SimpleUserWithEmail } from "$lib/database/documents/User";

declare global {
    namespace App {
        interface Locals {
            session: Session | null;
            user: SimpleUserWithEmail;
        }
    }
}

export {};
