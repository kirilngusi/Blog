import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// A little robot × Go-gopher mascot whose pupils track the cursor (or touch).
const FollowEyes = () => {
    const prefersReduced = useReducedMotion();
    const leftEye = useRef<SVGCircleElement>(null);
    const rightEye = useRef<SVGCircleElement>(null);
    const leftPupil = useRef<SVGCircleElement>(null);
    const rightPupil = useRef<SVGCircleElement>(null);

    useEffect(() => {
        if (prefersReduced) return;

        const pairs: [
            React.RefObject<SVGCircleElement>,
            React.RefObject<SVGCircleElement>
        ][] = [
            [leftEye, leftPupil],
            [rightEye, rightPupil],
        ];

        const move = (x: number, y: number) => {
            for (const [eye, pupil] of pairs) {
                if (!eye.current || !pupil.current) continue;
                const r = eye.current.getBoundingClientRect();
                const cx = r.left + r.width / 2;
                const cy = r.top + r.height / 2;
                const angle = Math.atan2(y - cy, x - cx);
                const max = 2.6; // pupil travel in SVG units
                pupil.current.style.transform = `translate(${
                    Math.cos(angle) * max
                }px, ${Math.sin(angle) * max}px)`;
            }
        };

        const onMouse = (e: MouseEvent) => move(e.clientX, e.clientY);
        const onTouch = (e: TouchEvent) => {
            const t = e.touches[0];
            if (t) move(t.clientX, t.clientY);
        };

        window.addEventListener("mousemove", onMouse);
        window.addEventListener("touchmove", onTouch, { passive: true });
        return () => {
            window.removeEventListener("mousemove", onMouse);
            window.removeEventListener("touchmove", onTouch);
        };
    }, [prefersReduced]);

    const blink = prefersReduced ? "" : "animate-blink";

    return (
        <svg
            aria-hidden
            viewBox="0 0 72 72"
            className="h-[72px] w-[72px] flex-shrink-0 drop-shadow-sm"
        >
            <defs>
                <linearGradient id="botBody" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#00ADD8" />
                    <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <radialGradient id="botGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#7CF5C4" />
                    <stop offset="100%" stopColor="#00ADD8" />
                </radialGradient>
            </defs>

            {/* antenna */}
            <line x1="36" y1="15" x2="36" y2="6" stroke="#00ADD8" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="36" cy="4.5" r="3.5" fill="url(#botGlow)" className={prefersReduced ? "" : "animate-float"} />

            {/* side bolts / ears */}
            <rect x="2.5" y="30" width="6" height="14" rx="3" fill="#0891b2" />
            <rect x="63.5" y="30" width="6" height="14" rx="3" fill="#0891b2" />

            {/* head */}
            <rect x="9" y="15" width="54" height="46" rx="15" fill="url(#botBody)" />

            {/* subtle top highlight */}
            <rect x="15" y="19" width="42" height="10" rx="6" fill="#ffffff" opacity="0.14" />

            {/* visor / screen where the eyes live */}
            <rect x="15" y="26" width="42" height="22" rx="9" fill="#08313b" />

            {/* eyes */}
            <g className={blink} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <circle ref={leftEye} cx="28" cy="37" r="6.4" fill="#effffe" />
                <circle ref={rightEye} cx="44" cy="37" r="6.4" fill="#effffe" />
            </g>
            <circle
                ref={leftPupil}
                cx="28"
                cy="37"
                r="3"
                fill="#052e2b"
                style={{ transition: "transform 75ms ease-out" }}
            />
            <circle
                ref={rightPupil}
                cx="44"
                cy="37"
                r="3"
                fill="#052e2b"
                style={{ transition: "transform 75ms ease-out" }}
            />

            {/* mouth / smile */}
            <path
                d="M30 53 Q36 57 42 53"
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.85"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
};

export default FollowEyes;
