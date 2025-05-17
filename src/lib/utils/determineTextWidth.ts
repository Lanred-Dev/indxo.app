/**
 * Determines the width of a given text string when rendered with specific CSS classes.
 *
 * @param text The text to measure
 * @param fontSize The fontSize to apply to the text
 * @returns The width of the text in pixels
 */
export default async function determineTextWidth(text: string, fontSize: string): Promise<number> {
    await document.fonts.ready;

    const span: HTMLSpanElement = document.createElement("span");
    span.style.fontSize = fontSize;
    span.style.position = "absolute";
    span.style.visibility = "hidden";
    span.style.whiteSpace = "nowrap";
    span.textContent = text;
    document.body.appendChild(span);

    const width: number = span.clientWidth;
    document.body.removeChild(span);

    return width;
}
