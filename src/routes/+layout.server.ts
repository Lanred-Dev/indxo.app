export async function load({ locals: { auth } }) {
    return {
        session: await auth(),
    };
}
