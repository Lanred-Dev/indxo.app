import { json } from "@sveltejs/kit";
import getUser from "../../../getUser";

export async function GET({ locals }) {
    const user = await getUser(locals.session.email);
    const recentSets = user?.recentSets ?? [];

    // Limit to 10 sets and sort by most recent
    recentSets.sort((set1, set2) => set1[1] - set2[1]);
    recentSets.reverse();
    recentSets.splice(10);

    return json({
        sets: recentSets,
    });
}
