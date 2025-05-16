/**
 * Determines the width of a given text string when rendered with specific CSS classes.
 *
 * @param text The text to measure
 * @param classes The classes to apply to the span element
 * @returns The width of the text in pixels
 */
export default function determineTextWidth(text: string, classes: string): number {
    const span: HTMLSpanElement = document.createElement("span");
    span.classList.add(...classes.split(" "));
    span.style.position = "absolute";
    span.style.visibility = "hidden";
    span.style.whiteSpace = "nowrap";
    span.textContent = text;
    document.body.appendChild(span);

    const width: number = span.offsetWidth;
    document.body.removeChild(span);

    return width;
}
