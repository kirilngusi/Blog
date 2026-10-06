import Giscus from "@giscus/react";

import { siteConfig } from "../lib/siteConfig";
import { useTheme } from "../lib/useTheme";
import { useLocale } from "../lib/i18n";

// `term` pins the thread explicitly so /blog/x and /vi/blog/x share one
// discussion. Use the locale-less path: it equals what the old "pathname"
// mapping produced, so existing threads stay attached.
const Comments = ({ term }: { term: string }) => {
    const { theme, mounted } = useTheme();
    const locale = useLocale();
    const { repo, repoId, category, categoryId } = siteConfig.giscus;

    // Until configured (repoId/categoryId from giscus.app), show a hint instead
    // of a broken widget.
    if (!repoId || !categoryId) {
        return (
            <div className="mt-12 rounded-xl border border-dashed border-light-800 p-5 text-sm text-gray-500 dark:border-dark-600 dark:text-dark-200">
                💬 Comments are powered by{" "}
                <a
                    href="https://giscus.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-accent-600 hover:underline dark:text-accent-400"
                >
                    giscus
                </a>{" "}
                (GitHub login). To enable, set <code>repoId</code> and{" "}
                <code>categoryId</code> in{" "}
                <code>lib/siteConfig.ts</code>.
            </div>
        );
    }

    // Avoid rendering with a mismatched theme before the client knows it.
    if (!mounted) return <div className="mt-12 h-24" />;

    return (
        <section className="mt-12">
            <Giscus
                repo={repo}
                repoId={repoId}
                category={category}
                categoryId={categoryId}
                mapping="specific"
                term={term}
                strict="1"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme={theme === "dark" ? "dark_dimmed" : "light"}
                lang={locale}
                loading="lazy"
            />
        </section>
    );
};

export default Comments;
