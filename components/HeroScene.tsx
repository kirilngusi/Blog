import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const MODEL = "/models/RobotExpressive.glb";

type OneShot = { name: string; n: number } | null;
type Dir = { f: boolean; b: boolean; l: boolean; r: boolean };

const Robot = ({
    action,
    dir,
}: {
    action: OneShot;
    dir: React.MutableRefObject<Dir>;
}) => {
    const group = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF(MODEL);
    const { actions, mixer } = useAnimations(animations, group);
    const base = useRef<string>("Idle");
    const busy = useRef(false);

    const setBase = (name: string) => {
        if (busy.current || base.current === name) return;
        actions[base.current]?.fadeOut(0.2);
        actions[name]?.reset().fadeIn(0.2).play();
        base.current = name;
    };

    useEffect(() => {
        actions["Idle"]?.reset().play();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions]);

    // One-shot animations (Wave / Dance / Jump) triggered from the parent.
    useEffect(() => {
        if (!action) return;
        const clip = actions[action.name];
        if (!clip) return;

        busy.current = true;
        actions[base.current]?.fadeOut(0.12);
        clip.reset();
        clip.setLoop(THREE.LoopOnce, 1);
        clip.clampWhenFinished = true;
        clip.fadeIn(0.12).play();

        const onFinished = (e: { action: THREE.AnimationAction }) => {
            if (e.action !== clip) return;
            mixer.removeEventListener("finished", onFinished as any);
            clip.fadeOut(0.2);
            busy.current = false;
            actions[base.current]?.reset().fadeIn(0.2).play();
        };
        mixer.addEventListener("finished", onFinished as any);
        return () => mixer.removeEventListener("finished", onFinished as any);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action]);

    useFrame((state, delta) => {
        if (!group.current) return;
        const d = dir.current;
        let dx = 0;
        let dz = 0;
        if (d.f) dz -= 1;
        if (d.b) dz += 1;
        if (d.l) dx -= 1;
        if (d.r) dx += 1;

        const moving = dx !== 0 || dz !== 0;
        const p = group.current.position;

        if (moving) {
            const len = Math.hypot(dx, dz);
            dx /= len;
            dz /= len;
            const speed = 2.4;
            p.x = THREE.MathUtils.clamp(p.x + dx * speed * delta, -2.2, 2.2);
            p.z = THREE.MathUtils.clamp(p.z + dz * speed * delta, -0.8, 0.8);

            const targetRot = Math.atan2(dx, dz);
            let diff = targetRot - group.current.rotation.y;
            diff = Math.atan2(Math.sin(diff), Math.cos(diff));
            group.current.rotation.y += diff * Math.min(1, delta * 12);

            setBase("Walking");
        } else {
            setBase("Idle");
        }

        const followX = p.x * 0.7;
        state.camera.position.x +=
            (followX - state.camera.position.x) * Math.min(1, delta * 3);
        state.camera.lookAt(p.x * 0.6, 0.9, 0);
    });

    return <primitive ref={group} object={scene} scale={0.5} position={[0, 0, 0]} />;
};

useGLTF.preload(MODEL);

const btn =
    "pointer-events-auto flex h-8 w-8 items-center justify-center rounded-lg border border-light-800 bg-white/70 text-sm backdrop-blur transition-colors hover:border-accent-500 hover:text-accent-600 dark:border-dark-500 dark:bg-dark-700/70 dark:hover:border-accent-400 dark:hover:text-accent-300";
const pad =
    "pointer-events-auto flex h-9 w-9 select-none items-center justify-center rounded-lg border border-light-800 bg-white/70 text-gray-600 backdrop-blur active:border-accent-500 active:bg-accent-500/20 active:text-accent-600 dark:border-dark-500 dark:bg-dark-700/70 dark:text-dark-100";
const kbd =
    "rounded border border-light-800 px-1.5 py-0.5 font-mono dark:border-dark-500";

type Heart = {
    id: number;
    x: number;
    y: number;
    dx: number;
    emoji: string;
    delay?: number;
    big?: boolean;
};

const HeroScene = () => {
    const [action, setAction] = useState<OneShot>(null);
    const [isTouch, setIsTouch] = useState(false);
    const [hearts, setHearts] = useState<Heart[]>([]);
    const rootRef = useRef<HTMLDivElement>(null);
    const counter = useRef(0);
    const heartId = useRef(0);
    const dir = useRef<Dir>({ f: false, b: false, l: false, r: false });

    const trigger = (name: string) => {
        counter.current += 1;
        setAction({ name, n: counter.current });
    };

    // Tap / click the robot to release floating hearts.
    const dropHeart = (e: React.PointerEvent) => {
        if ((e.target as HTMLElement).closest("button")) return;
        const rect = e.currentTarget.getBoundingClientRect();
        heartId.current += 1;
        const id = heartId.current;
        setHearts((h) => [
            ...h,
            {
                id,
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                dx: Math.random() * 44 - 22,
                emoji: Math.random() < 0.3 ? "💚" : "❤️",
            },
        ]);
    };
    const removeHeart = (id: number) =>
        setHearts((h) => h.filter((x) => x.id !== id));

    // Heart button: robot raises its hand + a burst of golden hearts.
    const loveBurst = () => {
        trigger("ThumbsUp");
        const el = rootRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cx = r.width / 2;
        const cy = r.height * 0.6;
        const batch: Heart[] = Array.from({ length: 12 }, () => {
            heartId.current += 1;
            return {
                id: heartId.current,
                x: cx + (Math.random() * 130 - 65),
                y: cy + (Math.random() * 30 - 15),
                dx: Math.random() * 80 - 40,
                emoji: Math.random() < 0.25 ? "✨" : "💛",
                delay: Math.random() * 260,
                big: true,
            };
        });
        setHearts((h) => [...h, ...batch]);
    };

    useEffect(() => {
        setIsTouch(window.matchMedia("(pointer: coarse)").matches);

        const isTyping = (t: EventTarget | null) => {
            const el = t as HTMLElement | null;
            return (
                !!el &&
                (el.tagName === "INPUT" ||
                    el.tagName === "TEXTAREA" ||
                    el.isContentEditable)
            );
        };
        // Arrow keys are IME-safe; WASD may be swallowed by a Vietnamese IME.
        const codeMap: Record<string, keyof Dir> = {
            KeyW: "f",
            ArrowUp: "f",
            KeyS: "b",
            ArrowDown: "b",
            KeyA: "l",
            ArrowLeft: "l",
            KeyD: "r",
            ArrowRight: "r",
        };
        const lastDown: Record<string, number> = {};
        const down = (e: KeyboardEvent) => {
            if (isTyping(e.target)) return;
            if (e.code === "Space") {
                e.preventDefault();
                trigger("Jump");
                return;
            }
            const m = codeMap[e.code];
            if (m) {
                e.preventDefault();
                dir.current[m] = true;
                lastDown[m] = performance.now();
            }
        };
        const up = (e: KeyboardEvent) => {
            const m = codeMap[e.code];
            if (m) dir.current[m] = false;
        };
        const clear = () => {
            dir.current = { f: false, b: false, l: false, r: false };
        };
        // Failsafe: if a held key stops repeating (IME ate its keyup), release it.
        const failsafe = window.setInterval(() => {
            const now = performance.now();
            (["f", "b", "l", "r"] as (keyof Dir)[]).forEach((k) => {
                if (dir.current[k] && now - (lastDown[k] || 0) > 600) {
                    dir.current[k] = false;
                }
            });
        }, 80);
        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        window.addEventListener("blur", clear);
        return () => {
            window.clearInterval(failsafe);
            window.removeEventListener("keydown", down);
            window.removeEventListener("keyup", up);
            window.removeEventListener("blur", clear);
        };
    }, []);

    // Touch D-pad button: press-and-hold to move.
    const hold = (k: keyof Dir) => ({
        onPointerDown: (e: React.PointerEvent) => {
            e.preventDefault();
            dir.current[k] = true;
        },
        onPointerUp: () => {
            dir.current[k] = false;
        },
        onPointerLeave: () => {
            dir.current[k] = false;
        },
        onPointerCancel: () => {
            dir.current[k] = false;
        },
    });

    return (
        <div
            ref={rootRef}
            className="relative h-full w-full"
            style={{ touchAction: "none" }}
            onPointerEnter={(e) => {
                if (e.pointerType === "mouse") trigger("Wave");
            }}
            onPointerDown={dropHeart}
        >
            <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 1.35, 5], fov: 40 }}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={0.8} />
                <directionalLight position={[3, 6, 4]} intensity={1.3} />
                <directionalLight
                    position={[-4, 3, -2]}
                    intensity={0.4}
                    color="#00add8"
                />

                <mesh position={[0, 1.25, -2.2]}>
                    <circleGeometry args={[1.8, 64]} />
                    <meshBasicMaterial color="#5eead4" toneMapped={false} />
                </mesh>

                <Suspense fallback={null}>
                    <Robot action={action} dir={dir} />
                </Suspense>

                <ContactShadows
                    position={[0, 0.01, 0]}
                    opacity={0.5}
                    scale={8}
                    blur={2.4}
                    resolution={256}
                    far={4}
                    color="#000000"
                />
            </Canvas>

            {/* Floating hearts */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {hearts.map((h) => (
                    <span
                        key={h.id}
                        onAnimationEnd={() => removeHeart(h.id)}
                        className={`absolute animate-heart ${
                            h.big ? "text-3xl" : "text-2xl"
                        }`}
                        style={{
                            left: h.x,
                            top: h.y,
                            ["--dx" as any]: `${h.dx}px`,
                            animationDelay: h.delay ? `${h.delay}ms` : undefined,
                        }}
                    >
                        {h.emoji}
                    </span>
                ))}
            </div>

            {/* Action buttons */}
            <div className="pointer-events-none absolute right-3 top-3 flex gap-2">
                <button type="button" className={btn} onClick={() => trigger("Wave")} aria-label="Wave">
                    👋
                </button>
                <button type="button" className={btn} onClick={() => trigger("Dance")} aria-label="Dance">
                    🕺
                </button>
                <button type="button" className={btn} onClick={() => trigger("Jump")} aria-label="Jump">
                    ⤴
                </button>
                <button type="button" className={btn} onClick={loveBurst} aria-label="Love">
                    💛
                </button>
            </div>

            {/* Touch D-pad (mobile) */}
            {isTouch && (
                <div className="pointer-events-none absolute bottom-3 left-3 grid grid-cols-3 gap-1">
                    <span />
                    <button type="button" className={pad} aria-label="Up" {...hold("f")}>
                        ▲
                    </button>
                    <span />
                    <button type="button" className={pad} aria-label="Left" {...hold("l")}>
                        ◀
                    </button>
                    <span />
                    <button type="button" className={pad} aria-label="Right" {...hold("r")}>
                        ▶
                    </button>
                    <span />
                    <button type="button" className={pad} aria-label="Down" {...hold("b")}>
                        ▼
                    </button>
                    <span />
                </div>
            )}

            {/* Keyboard hint (desktop) */}
            {!isTouch && (
                <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap text-[11px] text-gray-500 dark:text-dark-200">
                    <kbd className={kbd}>WASD</kbd>
                    <span>/</span>
                    <kbd className={kbd}>↑↓←→</kbd>
                    <span>move</span>
                    <span className="opacity-40">·</span>
                    <kbd className={kbd}>Space</kbd>
                    <span>jump</span>
                </div>
            )}
        </div>
    );
};

export default HeroScene;
