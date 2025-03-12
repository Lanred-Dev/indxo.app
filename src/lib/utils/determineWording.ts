const WORDING: { [key: string]: string } = {
    set: "Study Set",
    sets: "Study Sets",
    card: "Flashcard",
    cards: "Flashcards",
    folder: "Folder",
    folders: "Folders",
    user: "User",
    users: "Users",
    favorite: "Favorite",
    favorites: "Favorites",
    mode: "Study Mode",
    modes: "Study Modes",
    test: "Quiz",
    sort: "Sort",
};

/**
 * Determines the wording for a given string.
 *
 * @param string The string to determine the wording for.
 * @returns The wording that corresponds to the given string.
 */
export default function determineWording(string: string): string {
    return WORDING[string.toLowerCase()] || string;
}
