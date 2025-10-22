import deleteExpiredSessions from "$lib/server/jobs/deleteExpiredSessions";

deleteExpiredSessions();

export { handle } from "$lib/server/auth/handle";
