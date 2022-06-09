const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                link: "#8be9fd",
                secondary: "#353f5c",
                thirdparty: "#D0D0D0",
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
            },
            fontFamily: {
                sans: ["Inter", ...defaultTheme.fontFamily.sans],
                serif: ['"DM Serif Text"', ...defaultTheme.fontFamily.serif],
                mono: ['"iA Writer Mono"', ...defaultTheme.fontFamily.mono],
            },
        },
    },
    plugins: [],
};
