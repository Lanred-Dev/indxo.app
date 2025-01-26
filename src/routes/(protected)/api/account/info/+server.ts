import { json } from "@sveltejs/kit";
import getUser from "../../getUser";

export async function GET({ locals }) {
    const user = await getUser(locals.session.email);

    return json({
        ...user,
    });
}
