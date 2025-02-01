export async function load({ fetch, params }) {
    const set = await (await fetch(`/api/documents/set/${params.id}`)).json();

    return {
        ...set,
    };
}
