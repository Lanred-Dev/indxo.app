import deleteExpiredSessions from "$lib/server/jobs/deleteExpiredSessions";

deleteExpiredSessions();

export { authHandle as handle } from "$lib/server/auth/handle";
