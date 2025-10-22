import type { Session } from "$lib/documents/Session.js";
import type { SessionUser } from "$lib/documents/User.js";

export function load({ locals }) {
    return {
        session: locals.session as Session,
        user: locals.user as SessionUser,
    };
}
