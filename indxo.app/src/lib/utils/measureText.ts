/**
 * Measures the size of a text element at a certain font size.
 *
 * @param text
 * @param fontSize The font size to use for the measurement, e.g. "16px" or "1em"
 * @returns The width and height of the text element in pixels
 */
export default async function measureText(
    text: string,
    fontSize: string
): Promise<{ width: number; height: number }> {
    // Wait until the fonts are loaded so that the sizing is correct
    await document.fonts.ready;

    const span: HTMLSpanElement = document.createElement("span");
    span.style.fontSize = fontSize;
    span.style.position = "absolute";
    span.style.visibility = "hidden";
    span.style.whiteSpace = "nowrap";
    span.textContent = text;
    document.body.appendChild(span);

    const size: { width: number; height: number } = {
        width: span.clientWidth,
        height: span.clientHeight,
    };

    document.body.removeChild(span);

    return size;
}
