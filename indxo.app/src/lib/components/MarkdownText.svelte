<script lang="ts" module>
    interface Token {
        type: TokenType;
        content: string;
    }

    enum TokenType {
        Normal = "",
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

    const TOKEN_TYPE_MAP: { [key in TokenType]: string } = {
        [TokenType.Normal]: "",
        [TokenType.Bold]: "**",
        [TokenType.Italic]: "*",
        [TokenType.Code]: "```",
        [TokenType.Strikethrough]: "--",
    };

    let parsedText: string = $derived.by(() => {
        const tokens: Token[] = [];
        let currentTypes: Set<TokenType> = new Set();
        let buffer: string = "";
        let wasPreviousCharacterEscaped: boolean = false;
        let skipNextCharacters: number = 0;

        for (let index = 0; index < text.length; index++) {
            if (text[index] === "\\" && !wasPreviousCharacterEscaped) {
                wasPreviousCharacterEscaped = true;
                continue;
            } else if (skipNextCharacters > 0) {
                skipNextCharacters--;
                continue;
            }

            let foundType: TokenType = TokenType.Normal;

            if (!wasPreviousCharacterEscaped) {
                for (const type of Object.values(TokenType)) {
                    if (type === TokenType.Normal) continue;

                    const tag = TOKEN_TYPE_MAP[type];

                    if (!text.startsWith(tag, index)) continue;

                    foundType = type as TokenType;

                    if (foundType.length > 1) skipNextCharacters = tag.length - 1;

                    if (currentTypes.has(foundType)) {
                        tokens.push({ type: foundType, content: buffer });
                        currentTypes.delete(foundType);
                        buffer = "";
                    } else {
                        if (buffer.length > 0) {
                            tokens.push({ type: TokenType.Normal, content: buffer });
                            buffer = "";
                        }

                        currentTypes.add(foundType);
                    }
                }
            } else {
                wasPreviousCharacterEscaped = false;
            }

            if (foundType == TokenType.Normal) buffer += text[index];
        }

        if (buffer.length > 0) tokens.push({ type: TokenType.Normal, content: buffer });

        let result: string = "";

        tokens.forEach(({ type, content }: Token) => {
            result += `${type}${escapeHTML(content)}${getClosingTagFromType(type)}`;
        });

        return result;
    });

    function escapeHTML(text: string): string {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function getClosingTagFromType(type: TokenType): string {
        switch (type) {
            case TokenType.Bold:
                return "</b>";
            case TokenType.Italic:
                return "</i>";
            case TokenType.Code:
                return "</code>";
            case TokenType.Strikethrough:
                return "</s>";
            default:
                return "";
        }
    }
</script>

<p {...properties}>
    {@html parsedText}
</p>
