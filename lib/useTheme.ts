import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Syncs theme with the `dark` class on <html> and localStorage.
 * The initial value is applied pre-paint by the script in _document.tsx;
 * this hook reads the real state on mount to avoid hydration mismatch.
 */
export function useTheme() {
    const [theme, setThemeState] = useState<Theme>("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const isDark = document.documentElement.classList.contains("dark");
        setThemeState(isDark ? "dark" : "light");
        setMounted(true);
    }, []);

    const setTheme = useCallback((next: Theme) => {
        document.documentElement.classList.toggle("dark", next === "dark");
        try {
            localStorage.setItem("theme", next);
        } catch (e) {}
        setThemeState(next);
    }, []);

    const toggle = useCallback(() => {
        setTheme(
            document.documentElement.classList.contains("dark")
                ? "light"
                : "dark"
        );
    }, [setTheme]);

    return { theme, setTheme, toggle, mounted };
}
