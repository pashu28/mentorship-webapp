import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  speed: number;
  size: number;
}

interface TaskCompleteEffectProps {
  visible: boolean;
  onDone: () => void;
}

const COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#3b82f6", "#f97316"];

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 20,
    y: 50 + (Math.random() - 0.5) * 20,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    angle: Math.random() * 360,
    speed: 40 + Math.random() * 60,
    size: 4 + Math.random() * 5,
  }));
}

export default function TaskCompleteEffect({ visible, onDone }: TaskCompleteEffectProps) {
  const [particles] = useState(() => generateParticles(18));
  const [phase, setPhase] = useState<"idle" | "burst" | "fade">("idle");

  useEffect(() => {
    if (!visible) { setPhase("idle"); return; }
    setPhase("burst");
    const t1 = setTimeout(() => setPhase("fade"), 500);
    const t2 = setTimeout(() => { setPhase("idle"); onDone(); }, 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [visible, onDone]);

  if (phase === "idle") return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {/* Central checkmark burst */}
      <div
        className="relative flex items-center justify-center"
        style={{
          opacity: phase === "fade" ? 0 : 1,
          transform: phase === "burst" ? "scale(1)" : "scale(1.3)",
          transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <div
          className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg"
          style={{
            transform: phase === "burst" ? "scale(1)" : "scale(0.8)",
            transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          <i className="ri-check-line text-white text-3xl" />
        </div>

        {/* Particles */}
        {particles.map((p) => {
          const rad = (p.angle * Math.PI) / 180;
          const tx = Math.cos(rad) * p.speed;
          const ty = Math.sin(rad) * p.speed;
          return (
            <div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: phase === "burst"
                  ? `translate(${tx}px, ${ty}px) scale(1)`
                  : "translate(0,0) scale(0)",
                opacity: phase === "burst" ? 1 : 0,
                transition: `transform 0.5s ease-out, opacity 0.4s ease-out`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
