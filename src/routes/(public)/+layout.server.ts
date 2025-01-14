import { redirect } from "@sveltejs/kit";

export async function load({ locals: { auth } }) {
    const session = await auth();

    if (session) {
        throw redirect(307, "/");
    }
}
