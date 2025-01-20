import aspectRatio from "@tailwindcss/aspect-ratio";
import containerQueries from "@tailwindcss/container-queries";
import forms from "@tailwindcss/forms";
import type { Config } from "tailwindcss";

export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],

    darkMode: "class",

    theme: {
        fontFamily: {
            BalooBhaijaan2: ["Baloo Bhaijaan 2", "sans-serif"],
        },

        extend: {
            backgroundColor: {
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

                button: {
                    primary: "#F5DEB3",
                    secondary: "#fff837",
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
