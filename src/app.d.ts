import type { Session } from "$lib/database/documents/Session";
import type { SimpleUser } from "$lib/database/documents/User";

declare global {
    namespace App {
        interface Locals {
            session: Session | null;
            user: SimpleUser;
        }
    }
}

export {};
