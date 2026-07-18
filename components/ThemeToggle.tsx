import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../lib/useTheme";

const ThemeToggle = () => {
    const { theme, toggle, mounted } = useTheme();

    if (!mounted) {
        return <span className="h-9 w-9" aria-hidden />;
    }

    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-light-700 hover:text-accent-600 dark:text-dark-100 dark:hover:bg-dark-600 dark:hover:text-accent-400"
        >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
    );
};

export default ThemeToggle;
