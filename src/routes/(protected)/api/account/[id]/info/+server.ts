import { json } from "@sveltejs/kit";
import getUser from "$lib/database/utils/getUser";

export async function GET({ params }) {
    const user = await getUser(params.id);

    return json({
        name: user?.name,
        image: user?.image,
        sets: user?.sets,
    });
}
