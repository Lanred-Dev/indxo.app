export async function load({ fetch }) {
    const homeSectionPreferences = await (await fetch("/api/home/section-preferences")).json();

    return {
        sections: homeSectionPreferences.preferences,
    };
}
