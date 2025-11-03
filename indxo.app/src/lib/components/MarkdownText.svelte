<script lang="ts" module>
    interface Token {
        type: TokenType;
        children: (Token | string)[];
    }

    enum TokenType {
        Text = "",
        Bold = "<b>",
        Italic = "<i>",
        Code = "<code>",
        Strikethrough = "<s>",
    }
</script>

<script lang="ts">
    let {
        text,
        ...properties
    }: {
        text: string;
        [key: string]: unknown;
    } = $props();

    const TOKEN_TYPE_MAP: { type: TokenType; tag: string; order: number }[] = [
        { type: TokenType.Bold, tag: "**", order: 1 },
        { type: TokenType.Code, tag: "```", order: 2 },
        { type: TokenType.Strikethrough, tag: "--", order: 3 },
        { type: TokenType.Italic, tag: "*", order: 4 },
        { type: TokenType.Text, tag: "", order: 0 },
    ].sort((a, b) => a.order - b.order);

    let parsedText: string = $derived.by(() => {
        const root: Token = { type: TokenType.Text, children: [] };
        const stack: Token[] = [root];
        let buffer: string = "";
        let wasPreviousCharacterEscaped: boolean = false;
        let skipCharacters: number = 0;

        function flushBuffer() {
            if (buffer.length == 0) return;

            stack[stack.length - 1].children.push(buffer);
            buffer = "";
        }

        for (let index = 0; index < text.length; index++) {
            if (text[index] === "\\" && !wasPreviousCharacterEscaped) {
                wasPreviousCharacterEscaped = true;
                continue;
            } else if (skipCharacters > 0) {
                skipCharacters--;
                continue;
            }

            let matchedType: TokenType = TokenType.Text;

            if (!wasPreviousCharacterEscaped) {
                for (const { tag, type } of TOKEN_TYPE_MAP) {
                    if (!text.startsWith(tag, index) || type === TokenType.Text) continue;

                    matchedType = type;
                    skipCharacters = tag.length - 1;
                    break;
                }
            } else {
                wasPreviousCharacterEscaped = false;
            }

            if (matchedType === TokenType.Text) {
                buffer += text[index];
            } else {
                flushBuffer();

                if (stack.findIndex(({ type }) => type === matchedType) !== -1) {
                    let node: Token;

                    do {
                        node = stack.pop()!;
                        stack[stack.length - 1].children.push(node);
                    } while (node.type !== matchedType && stack.length > 1);
                } else {
                    const newNode: Token = { type: matchedType, children: [] };
                    stack.push(newNode);
                }
            }
        }

        flushBuffer();

        while (stack.length > 1) {
            const node: Token = stack.pop()!;
            let tag: string = TOKEN_TYPE_MAP.find(({ type }) => type === node.type)!.tag;

            for (const child of node.children) {
                if (typeof child === "string") {
                    tag += child;
                } else {
                    tag += buildToken(child);
                }
            }

            stack[stack.length - 1].children.push(tag);
        }

        return buildToken(root);
    });

    function escapeHTML(text: string): string {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function buildToken({ type, children }: Token): string {
        if (typeof children === "string") {
            return `${type}${escapeHTML(children)}${getClosingTagFromType(type)}`;
        } else {
            let result: string = "";

            children.forEach((child) => {
                result += typeof child === "string" ? escapeHTML(child) : buildToken(child);
            });

            return `${type}${result}${getClosingTagFromType(type)}`;
        }
    }

    function getClosingTagFromType(type: TokenType): string {
        if (type === TokenType.Text) return "";

        return type.replace("<", "</");
    }
</script>

<p {...properties}>
    {@html parsedText}
</p>
