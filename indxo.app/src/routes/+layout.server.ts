import type { Session } from "$lib/documents/Session";
import type { SessionUser } from "$lib/documents/User";

export function load({ locals }) {
    return {
        session: locals.session as Session,
        user: locals.user as SessionUser,
    };
}
