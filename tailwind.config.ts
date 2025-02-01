import aspectRatio from "@tailwindcss/aspect-ratio";
import containerQueries from "@tailwindcss/container-queries";
import forms from "@tailwindcss/forms";
import type { Config } from "tailwindcss";

export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],

    darkMode: "class",

    theme: {
        fontFamily: {
            EireneSans: ["EireneSans", "sans-serif"],
        },

        extend: {
            backgroundColor: {
                primary: {
                    DEFAULT: "#E5E8EB",
                    50: "#E6E9EC",
                    100: "#E5E8EB",
                    200: "#DFE3E7",
                    300: "#D9DEE2",
                    400: "#D4D9DE",
                    500: "#CED4D9",
                    600: "#C8CFD5",
                    700: "#C2C9D0",
                    800: "#BDC4CC",
                    900: "#B7BFC8",
                    950: "#B4BDC5",
                },

                accent: {
                    primary: "#5E8AB4",
                    light: "#A4C8E1",
                },

                button: {
                    primary: "#5E8AB4",
                    secondary: "#A4C8E1",
                },

                divider: "#E7E7E7",
            },

            textColor: {
                primary: {
                    DEFAULT: "#000000",
                    50: "#737373",
                    100: "#6C6C6C",
                    200: "#606060",
                    300: "#535353",
                    400: "#464646",
                    500: "#393939",
                    600: "#2D2D2D",
                    700: "#202020",
                    800: "#131313",
                    900: "#060606",
                    950: "#000000",
                },
            },

            borderColor: {
                primary: {
                    DEFAULT: "#F9F9F9",
                    50: "#F9F9F9",
                    100: "#F6F6F6",
                    200: "#F1F1F1",
                    300: "#ECECEC",
                    400: "#E7E7E7",
                    500: "#E2E2E2",
                    600: "#DDDDDD",
                    700: "#D8D8D8",
                    800: "#D3D3D3",
                    900: "#CECECE",
                    950: "#CBCBCB",
                },
            },

            ringColor: {
                primary: "#F5DEB3",
            },

            borderWidth: {
                primary: "2px",
            },

            borderRadius: {
                primary: "15px",
                button: "10px",
            },
        },
    },

    plugins: [forms, containerQueries, aspectRatio],
} satisfies Config;
