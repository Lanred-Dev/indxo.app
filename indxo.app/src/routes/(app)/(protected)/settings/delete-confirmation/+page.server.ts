import { dev } from "$app/environment";
import type { Session, User } from "$lib/documents";
import { loadCollection } from "$lib/server/mongo";
import { ResponseCodes } from "$lib/utils/apiResponses";
import { error, redirect } from "@sveltejs/kit";
import type { Collection } from "mongodb";

const users: Collection<User> = loadCollection("accounts", "users");
const sessions: Collection<Session> = loadCollection("accounts", "sessions");

export const actions = {
    default: async ({ locals, cookies, fetch }) => {
        const sets = await (await fetch(`/api/user/${locals.user._id}/sets`)).json();
        const folders = await (await fetch(`/api/user/${locals.user._id}/folders`)).json();

        for (const { _id } of [...folders, ...sets]) {
            await fetch(`/api/documents/${_id}`, {
                method: "DELETE",
            });
        }

        cookies.delete("session", {
            httpOnly: true,
            path: "/",
            sameSite: "lax",
            secure: !dev,
        });

        await sessions.deleteMany({ user: locals.user._id });
        const deleteUserResult = await users.deleteOne({ _id: locals.user._id });

        if (deleteUserResult.deletedCount === 0)
            error(ResponseCodes.ServerError, "Failed to delete user.");

        redirect(ResponseCodes.Redirect, "/login");
    },
};
