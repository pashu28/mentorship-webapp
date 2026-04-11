import { useEffect, useState } from "react";

interface MilestoneBadgeProps {
  streak: number;
  visible: boolean;
  onDismiss: () => void;
}

const MILESTONES: Record<number, { icon: string; label: string; color: string; bg: string }> = {
  3:  { icon: "ri-seedling-line",      label: "Sprout",      color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  5:  { icon: "ri-fire-fill",          label: "On Fire",     color: "text-orange-500",  bg: "bg-orange-50 border-orange-200" },
  7:  { icon: "ri-star-fill",          label: "Week Warrior",color: "text-amber-500",   bg: "bg-amber-50 border-amber-200" },
  10: { icon: "ri-rocket-2-fill",      label: "Momentum",    color: "text-violet-600",  bg: "bg-violet-50 border-violet-200" },
  14: { icon: "ri-trophy-fill",        label: "Champion",    color: "text-yellow-500",  bg: "bg-yellow-50 border-yellow-200" },
  21: { icon: "ri-medal-fill",         label: "Legend",      color: "text-rose-500",    bg: "bg-rose-50 border-rose-200" },
};

function getMilestone(streak: number) {
  const keys = Object.keys(MILESTONES).map(Number).sort((a, b) => b - a);
  for (const k of keys) {
    if (streak >= k) return { ...MILESTONES[k], threshold: k };
  }
  return null;
}

export default function MilestoneBadge({ streak, visible, onDismiss }: MilestoneBadgeProps) {
  const [show, setShow] = useState(false);
  const milestone = getMilestone(streak);

  useEffect(() => {
    if (!visible || !milestone) return;
    setShow(true);
    const t = setTimeout(() => { setShow(false); onDismiss(); }, 4000);
    return () => clearTimeout(t);
  }, [visible, milestone, onDismiss]);

  if (!show || !milestone) return null;

  return (
    <div
      className="fixed bottom-8 left-1/2 z-50 pointer-events-none"
      style={{
        transform: "translateX(-50%)",
        animation: "badgeSlideUp 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
      }}
    >
      <style>{`
        @keyframes badgeSlideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(24px) scale(0.9); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1);   }
        }
      `}</style>
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-md ${milestone.bg}`}>
        <div className={`w-10 h-10 flex items-center justify-center rounded-full bg-white ${milestone.color}`}>
          <i className={`${milestone.icon} text-xl`} />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Milestone Unlocked</p>
          <p className={`text-base font-bold ${milestone.color}`}>{milestone.label} Badge</p>
          <p className="text-xs text-gray-500">{streak}-day streak — keep it up!</p>
        </div>
        <i className="ri-sparkling-2-fill text-amber-400 text-lg ml-1" />
      </div>
    </div>
  );
}

export { getMilestone };
