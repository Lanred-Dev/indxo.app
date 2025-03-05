import aspectRatio from "@tailwindcss/aspect-ratio";
import containerQueries from "@tailwindcss/container-queries";
import forms from "@tailwindcss/forms";
import type { Config } from "tailwindcss";

export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],

    theme: {
        fontFamily: {
            EireneSans: ["EireneSans", "sans-serif"],
            Quetine: ["Quetine", "serif"],
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
                    light: "#adc2d4",
                },

                button: {
                    primary: "#5E8AB4",
                    secondary: "#D4D9DE",
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
                    DEFAULT: "#B4B4B4",
                    50: "#CFCFCF",
                    100: "#CBCBCB",
                    200: "#C3C3C3",
                    300: "#BCBCBC",
                    400: "#B4B4B4",
                    500: "#AFAFAF",
                    600: "#AAAAAA",
                    700: "#A5A5A5",
                    800: "#A0A0A0",
                    900: "#9B9B9B",
                    950: "#989898",
                },
            },

            ringColor: {
                primary: "#5E8AB4",
            },

            borderRadius: {
                primary: "15px",
                button: "12.5px",
            },
        },
    },

    plugins: [forms, containerQueries, aspectRatio],
} satisfies Config;
