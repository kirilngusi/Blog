const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./lib/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                link: "#8be9fd",
                secondary: "#353f5c",
                thirdparty: "#D0D0D0",
                accent: {
                    DEFAULT: "#059669",
                    50: "#ecfdf5",
                    100: "#d1fae5",
                    200: "#a7f3d0",
                    300: "#6ee7b7",
                    400: "#34d399",
                    500: "#10b981",
                    600: "#059669",
                    700: "#047857",
                    800: "#065f46",
                    900: "#064e3b",
                },
                light: {
                    50: "#fdfdfd",
                    100: "#fcfcfc",
                    200: "#fafafa",
                    300: "#f8f9fa",
                    400: "#f6f6f6",
                    500: "#f2f2f2",
                    600: "#f1f3f5",
                    700: "#e9ecef",
                    800: "#dee2e6",
                    900: "#dde1e3",
                },
                dark: {
                    50: "#c9d1d9",
                    100: "#b1bac4",
                    200: "#8b949e",
                    300: "#6e7681",
                    400: "#484f58",
                    500: "#30363d",
                    600: "#21262d",
                    700: "#161b22",
                    800: "#0d1117",
                    900: "#010409",
                },
            },
            fontFamily: {
                sans: ["Inter", ...defaultTheme.fontFamily.sans],
                serif: ['"DM Serif Display"', ...defaultTheme.fontFamily.serif],
                mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
            },
            keyframes: {
                "fade-up": {
                    "0%": { opacity: "0", transform: "translateY(12px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-6px)" },
                },
                blink: {
                    "0%, 92%, 100%": { transform: "scaleY(1)" },
                    "96%": { transform: "scaleY(0.1)" },
                },
                heart: {
                    "0%": {
                        transform:
                            "translate(-50%, -50%) translateY(0) scale(0.5)",
                        opacity: "0",
                    },
                    "15%": { opacity: "1" },
                    "100%": {
                        transform:
                            "translate(-50%, -50%) translateY(-90px) translateX(var(--dx, 0)) scale(1.15)",
                        opacity: "0",
                    },
                },
            },
            animation: {
                "fade-up": "fade-up 0.5s ease-out both",
                float: "float 3s ease-in-out infinite",
                blink: "blink 4.5s ease-in-out infinite",
                heart: "heart 1.1s ease-out forwards",
            },
        },
    },
    plugins: [],
};
