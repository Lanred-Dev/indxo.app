export async function load({ fetch, params }) {
    const set = await (await fetch(`/api/sets/${params.id}`)).json();

    return {
        ...set,
    };
}
