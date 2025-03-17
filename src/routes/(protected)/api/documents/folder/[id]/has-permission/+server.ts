import permissionCheck from "$lib/utils/permissionCheck";
import { json } from "@sveltejs/kit";
import { type Folder } from "$lib/database/documents/Folder";

export async function GET({ params, locals, fetch }) {
    const folder: Folder = await (await fetch(`/api/documents/folder/${params.id}`)).json();

    return json(permissionCheck(folder, locals.userID, true));
}
