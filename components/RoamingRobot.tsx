import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const MODEL = "/models/RobotExpressive.glb";

type Dir = { f: boolean; b: boolean; l: boolean; r: boolean };

const RoamRobot = ({ dir }: { dir: React.MutableRefObject<Dir> }) => {
    const group = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF(MODEL);
    const { actions } = useAnimations(animations, group);
    const base = useRef("Idle");

    const setBase = (name: string) => {
        if (base.current === name) return;
        actions[base.current]?.fadeOut(0.2);
        actions[name]?.reset().fadeIn(0.2).play();
        base.current = name;
    };

    useEffect(() => {
        actions["Idle"]?.reset().play();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions]);

    useFrame((state, delta) => {
        if (!group.current) return;
        const d = dir.current;
        let dx = 0;
        let dz = 0;
        if (d.l) dx -= 1;
        if (d.r) dx += 1;
        if (d.f) dz -= 1;
        if (d.b) dz += 1;

        const p = group.current.position;
        const cam = state.camera as THREE.PerspectiveCamera;
        const vFov = (cam.fov * Math.PI) / 180;
        const halfH = Math.tan(vFov / 2) * Math.abs(cam.position.z - p.z);
        const boundX = Math.max(1.5, halfH * cam.aspect - 0.9);

        if (dx !== 0 || dz !== 0) {
            const len = Math.hypot(dx, dz);
            dx /= len;
            dz /= len;
            const speed = 3;
            p.x = THREE.MathUtils.clamp(
                p.x + dx * speed * delta,
                -boundX,
                boundX
            );
            p.z = THREE.MathUtils.clamp(p.z + dz * speed * delta, -1, 1.2);

            const targetRot = Math.atan2(dx, dz);
            let diff = targetRot - group.current.rotation.y;
            diff = Math.atan2(Math.sin(diff), Math.cos(diff));
            group.current.rotation.y += diff * Math.min(1, delta * 12);

            setBase("Walking");
        } else {
            setBase("Idle");
        }
    });

    return <primitive ref={group} object={scene} scale={0.48} position={[0, 0, 0]} />;
};

useGLTF.preload(MODEL);

const pad =
    "pointer-events-auto flex h-10 w-10 select-none items-center justify-center rounded-lg border border-light-800 bg-white/80 text-gray-700 backdrop-blur active:border-accent-500 active:bg-accent-500/20 active:text-accent-600 dark:border-dark-500 dark:bg-dark-700/80 dark:text-dark-50";
const kbd =
    "rounded border border-light-800 px-1.5 py-0.5 font-mono dark:border-dark-500";

const RoamingRobot = ({ onExit }: { onExit: () => void }) => {
    const [isTouch, setIsTouch] = useState(false);
    const dir = useRef<Dir>({ f: false, b: false, l: false, r: false });

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
            if (e.code === "Escape") {
                onExit();
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
        // Failsafe: release a held key if it stops repeating (IME ate its keyup).
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
    }, [onExit]);

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
        <div className="fixed inset-0 z-40" style={{ pointerEvents: "none" }}>
            <Canvas
                className="!pointer-events-none"
                dpr={[1, 1.5]}
                camera={{ position: [0, 2.8, 8], fov: 40 }}
                onCreated={({ camera }) => camera.lookAt(0, 1.1, 0)}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={0.85} />
                <directionalLight position={[3, 6, 4]} intensity={1.3} />
                <directionalLight
                    position={[-4, 3, -2]}
                    intensity={0.4}
                    color="#00add8"
                />
                <Suspense fallback={null}>
                    <RoamRobot dir={dir} />
                </Suspense>
                <ContactShadows
                    position={[0, 0.01, 0]}
                    opacity={0.4}
                    scale={12}
                    blur={2.6}
                    resolution={256}
                    far={4}
                    color="#000000"
                />
            </Canvas>

            {/* Control bar */}
            <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3">
                {isTouch ? (
                    <div className="grid grid-cols-3 gap-1">
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
                ) : (
                    <div className="pointer-events-auto flex items-center gap-1.5 rounded-lg border border-light-800 bg-white/80 px-3 py-2 text-[11px] text-gray-600 backdrop-blur dark:border-dark-500 dark:bg-dark-700/80 dark:text-dark-100">
                        <kbd className={kbd}>WASD</kbd>
                        <span>/</span>
                        <kbd className={kbd}>↑↓←→</kbd>
                        <span>roam</span>
                    </div>
                )}

                <button
                    type="button"
                    onClick={onExit}
                    className="pointer-events-auto rounded-lg border border-accent-500 bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-700"
                >
                    Return
                </button>
            </div>
        </div>
    );
};

export default RoamingRobot;
