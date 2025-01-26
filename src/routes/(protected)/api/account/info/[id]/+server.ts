import { json } from "@sveltejs/kit";
import getUser from "../../../getUser";

export async function GET({ params }) {
    const user = await getUser(params.id);

    if (!user) {
        return json({ error: "User not found" }, { status: 404 });
    }

    return json({
        name: user.name,
        image: user.image,
        sets: user.sets,
    });
}
