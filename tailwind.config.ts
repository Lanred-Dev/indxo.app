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
                    DEFAULT: "#F7F9FA",
                    50: "#FAFBFC",
                    100: "#F7F9FA",
                    200: "#F1F4F6",
                    300: "#EAF0F2",
                    400: "#E4EBEE",
                    500: "#DEE6EA",
                    600: "#D8E1E6",
                    700: "#D1DDE2",
                    800: "#CBD8DF",
                    900: "#C5D3DB",
                    950: "#C2D1D9",
                },

                accent: {
                    light: "#adc2d4",
                },

                button: {
                    primary: "#5685d6",
                    secondary: "#D4D9DE",
                    alert: "#f26a63",
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

                focus: "#5E8AB4",
            },

            ringColor: {
                focus: "#5E8AB4",
            },

            borderRadius: {
                primary: "15px",
                button: "12.5px",
            },
        },
    },

    plugins: [forms, containerQueries, aspectRatio],
} satisfies Config;
