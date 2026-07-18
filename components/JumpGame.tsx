import { useCallback, useEffect, useRef, useState } from "react";

type Status = "idle" | "playing" | "over";

const AREA_H = 150;
const GROUND_PAD = 10;
const CHAR_X = 46;
const CHAR_SIZE = 30;
const OBST_W = 20;
const OBST_H = 28;
const JUMP_V = 560; // px/s initial upward velocity
const GRAVITY = 1900; // px/s^2
const BASE_SPEED = 230; // px/s obstacle speed
const HIGHSCORE_KEY = "kiril-jump-highscore";

interface Obstacle {
    x: number;
    scored: boolean;
}

const JumpGame = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const lastTsRef = useRef(0);
    const pausedRef = useRef(false);
    const statusRef = useRef<Status>("idle");

    const game = useRef({
        y: 0,
        vy: 0,
        grounded: true,
        obstacles: [] as Obstacle[],
        width: 600,
        distance: 0,
        nextGap: 340,
    });

    const [status, setStatus] = useState<Status>("idle");
    const [score, setScore] = useState(0);
    const [high, setHigh] = useState(0);
    const [reduced, setReduced] = useState(false);

    const setStatusBoth = (s: Status) => {
        statusRef.current = s;
        setStatus(s);
    };

    const reset = () => {
        const g = game.current;
        g.y = 0;
        g.vy = 0;
        g.grounded = true;
        g.obstacles = [];
        g.distance = 0;
        g.nextGap = 340;
        setScore(0);
    };

    const jump = useCallback(() => {
        const g = game.current;
        if (statusRef.current === "playing") {
            if (g.grounded) {
                g.vy = JUMP_V;
                g.grounded = false;
            }
        } else {
            // idle or over -> start / restart
            reset();
            setStatusBoth("playing");
        }
    }, []);

    // Load high score + reduced-motion preference.
    useEffect(() => {
        try {
            const saved = Number(localStorage.getItem(HIGHSCORE_KEY) || "0");
            if (!Number.isNaN(saved)) setHigh(saved);
        } catch (e) {}
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduced(mq.matches);
        const onChange = () => setReduced(mq.matches);
        mq.addEventListener?.("change", onChange);
        return () => mq.removeEventListener?.("change", onChange);
    }, []);

    // Pause when the tab is hidden.
    useEffect(() => {
        const onVis = () => {
            pausedRef.current = document.hidden;
            if (!document.hidden) lastTsRef.current = 0;
        };
        document.addEventListener("visibilitychange", onVis);
        return () => document.removeEventListener("visibilitychange", onVis);
    }, []);

    // Pause when scrolled out of view.
    useEffect(() => {
        const el = wrapRef.current;
        if (!el || typeof IntersectionObserver === "undefined") return;
        const io = new IntersectionObserver(
            ([entry]) => {
                pausedRef.current = !entry.isIntersecting;
                if (entry.isIntersecting) lastTsRef.current = 0;
            },
            { threshold: 0.15 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // Keyboard: Space / ArrowUp to jump (only when the game is focused/hovered
    // area is on screen). We attach to window but avoid hijacking typing.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null;
            const typing =
                target &&
                (target.tagName === "INPUT" ||
                    target.tagName === "TEXTAREA" ||
                    target.isContentEditable);
            if (typing) return;
            if (e.code === "Space" || e.code === "ArrowUp") {
                if (!pausedRef.current) {
                    e.preventDefault();
                    jump();
                }
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [jump]);

    // Main render + physics loop.
    useEffect(() => {
        const canvas = canvasRef.current;
        const wrap = wrapRef.current;
        if (!canvas || !wrap) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let dpr = Math.min(window.devicePixelRatio || 1, 2);

        const resize = () => {
            const w = wrap.clientWidth;
            game.current.width = w;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = w * dpr;
            canvas.height = AREA_H * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${AREA_H}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(wrap);

        const accent = "#10b981";
        const groundY = AREA_H - GROUND_PAD;

        const draw = () => {
            const g = game.current;
            const w = g.width;
            ctx.clearRect(0, 0, w, AREA_H);

            // Ground line
            ctx.strokeStyle = "rgba(120,120,120,0.35)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, groundY + 0.5);
            ctx.lineTo(w, groundY + 0.5);
            ctx.stroke();

            // Obstacles (cacti)
            ctx.font = `${OBST_H}px serif`;
            ctx.textBaseline = "bottom";
            ctx.textAlign = "left";
            for (const o of g.obstacles) {
                ctx.fillText("🌵", o.x, groundY + 4);
            }

            // Character
            const charBottom = groundY - g.y + 4;
            ctx.font = `${CHAR_SIZE}px serif`;
            const wobble =
                statusRef.current === "idle" && !reduced
                    ? Math.sin(g.distance / 6) * 2
                    : 0;
            ctx.fillText("🐣", CHAR_X, charBottom + wobble);
        };

        const step = (ts: number) => {
            rafRef.current = requestAnimationFrame(step);
            const g = game.current;

            if (pausedRef.current) {
                lastTsRef.current = ts;
                return;
            }
            if (!lastTsRef.current) lastTsRef.current = ts;
            let dt = (ts - lastTsRef.current) / 1000;
            lastTsRef.current = ts;
            if (dt > 0.05) dt = 0.05; // clamp after long pauses

            if (statusRef.current === "playing") {
                const speed = BASE_SPEED + g.distance * 0.04;
                g.distance += speed * dt;

                // Character physics
                g.vy -= GRAVITY * dt;
                g.y += g.vy * dt;
                if (g.y <= 0) {
                    g.y = 0;
                    g.vy = 0;
                    g.grounded = true;
                }

                // Move + spawn obstacles
                for (const o of g.obstacles) o.x -= speed * dt;
                g.obstacles = g.obstacles.filter((o) => o.x > -OBST_W * 2);

                const rightMost = g.obstacles.length
                    ? g.obstacles[g.obstacles.length - 1].x
                    : -Infinity;
                if (g.width - rightMost >= g.nextGap) {
                    g.obstacles.push({ x: g.width + OBST_W, scored: false });
                    g.nextGap = 260 + Math.random() * 220;
                }

                // Scoring: passing an obstacle
                for (const o of g.obstacles) {
                    if (!o.scored && o.x + OBST_W < CHAR_X) {
                        o.scored = true;
                        setScore((s) => s + 1);
                    }
                }

                // Collision
                const cLeft = CHAR_X + 3;
                const cRight = CHAR_X + CHAR_SIZE - 6;
                for (const o of g.obstacles) {
                    const oLeft = o.x + 2;
                    const oRight = o.x + OBST_W - 2;
                    const overlapX = cRight > oLeft && cLeft < oRight;
                    const lowEnough = g.y < OBST_H - 6;
                    if (overlapX && lowEnough) {
                        setStatusBoth("over");
                        setScore((finalScore) => {
                            setHigh((h) => {
                                const nh = Math.max(h, finalScore);
                                try {
                                    localStorage.setItem(
                                        HIGHSCORE_KEY,
                                        String(nh)
                                    );
                                } catch (e) {}
                                return nh;
                            });
                            return finalScore;
                        });
                        break;
                    }
                }
            }

            draw();
        };

        rafRef.current = requestAnimationFrame(step);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            ro.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reduced]);

    return (
        <div
            ref={wrapRef}
            className="relative mt-6 select-none overflow-hidden rounded-xl border border-light-800 bg-white/40 dark:border-dark-600 dark:bg-dark-700/30"
            role="button"
            tabIndex={0}
            aria-label="Mini jump game. Press space or tap to jump."
            onClick={jump}
            onKeyDown={(e) => {
                if (e.code === "Enter") jump();
            }}
            style={{ height: AREA_H }}
        >
            <canvas ref={canvasRef} className="block h-full w-full" />

            {/* Score HUD */}
            <div className="pointer-events-none absolute right-3 top-2 font-mono text-xs text-gray-500 dark:text-dark-200">
                {String(score).padStart(3, "0")}
                <span className="ml-2 opacity-60">
                    HI {String(high).padStart(3, "0")}
                </span>
            </div>

            {/* Overlays */}
            {status !== "playing" && (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                    {status === "over" && (
                        <div className="mb-1 font-serif text-lg font-bold text-black dark:text-white">
                            Game over · {score}
                        </div>
                    )}
                    <div className="text-sm font-medium text-gray-500 dark:text-dark-100">
                        Press{" "}
                        <kbd className="rounded border border-light-800 px-1.5 py-0.5 font-mono text-xs dark:border-dark-500">
                            Space
                        </kbd>{" "}
                        or tap to {status === "idle" ? "play" : "retry"}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JumpGame;
