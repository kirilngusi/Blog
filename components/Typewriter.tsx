import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Smooth type-once effect (no janky delete/retype loop), with a blinking caret.
const Typewriter = ({
    text,
    speed = 95,
    className = "",
}: {
    text: string;
    speed?: number;
    className?: string;
}) => {
    const prefersReduced = useReducedMotion();
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (prefersReduced) {
            setCount(text.length);
            return;
        }
        if (count >= text.length) return;
        const t = setTimeout(() => setCount((c) => c + 1), speed);
        return () => clearTimeout(t);
    }, [count, text, speed, prefersReduced]);

    return (
        <>
            <span className={className}>{text.slice(0, count)}</span>
            <span
                aria-hidden
                className="animate-caret font-normal text-accent-500 dark:text-accent-400"
            >
                |
            </span>
        </>
    );
};

export default Typewriter;
