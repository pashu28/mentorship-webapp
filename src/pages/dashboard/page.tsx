import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { roadmapSteps, goalRings } from "@/mocks/session";
import GoalRing from "./GoalRing";
import AiTutorPanel from "./AiTutorPanel";
import TaskCompleteEffect from "./TaskCompleteEffect";
import MilestoneBadge from "./MilestoneBadge";
import AppLayout from "@/components/feature/AppLayout";

const BADGE_LEVELS = [
  { threshold: 1,   name: "First Step",    icon: "ri-footprint-fill",   accentVar: "var(--accent)",  bgVar: "var(--accent-light)",  borderVar: "var(--accent-light)" },
  { threshold: 5,   name: "Rising Star",   icon: "ri-star-fill",        accentVar: "var(--accent)",  bgVar: "var(--accent-light)",  borderVar: "var(--accent-light)" },
  { threshold: 10,  name: "Task Veteran",  icon: "ri-shield-star-fill", accentVar: "var(--accent)",  bgVar: "var(--accent-light)",  borderVar: "var(--accent-light)" },
  { threshold: 25,  name: "Gold Achiever", icon: "ri-medal-fill",       accentVar: "var(--success)", bgVar: "var(--success-light)", borderVar: "var(--success-light)" },
  { threshold: 50,  name: "Champion",      icon: "ri-trophy-fill",      accentVar: "var(--success)", bgVar: "var(--success-light)", borderVar: "var(--success-light)" },
];

const CREDITS_PER_TASK = 10;

function getCurrentBadge(n: number) {
  return [...BADGE_LEVELS].reverse().find((b) => n >= b.threshold) ?? null;
}
function getNextBadge(n: number) {
  return BADGE_LEVELS.find((b) => n < b.threshold) ?? null;
}

const ringColors = [
  { color: "stroke-violet-600", bg: "stroke-violet-200" },
  { color: "stroke-violet-400", bg: "stroke-violet-100" },
  { color: "stroke-violet-300", bg: "stroke-violet-100" },
];

const BASE_RING_PERCENTAGES = goalRings.map((r) => r.percentage);

function computeRings(tasks: { id: string; done: boolean }[]) {
  return goalRings.map((ring, stepIdx) => {
    const stepTasks = roadmapSteps[stepIdx]?.tasks ?? [];
    const total = stepTasks.length;
    if (total === 0) return { ...ring, percentage: BASE_RING_PERCENTAGES[stepIdx] };
    const completedCount = stepTasks.filter((st) => tasks.find((t) => t.id === st.id)?.done).length;
    const base = BASE_RING_PERCENTAGES[stepIdx];
    return { ...ring, percentage: Math.round(base + (completedCount / total) * (100 - base)) };
  });
}

const recentCompleted = [
  { id: "rc1", text: "Complete 2 Figma tutorials (Auto Layout + Components)", date: "Apr 8" },
  { id: "rc2", text: "Read NNGroup article on UX case study structure",        date: "Apr 7" },
  { id: "rc3", text: "Watch Google UX Certificate Module 1",                   date: "Apr 5" },
];

export default function DashboardPage() {
  const [tasks, setTasks] = useState(
    roadmapSteps.flatMap((s) => s.tasks.map((t) => ({ ...t, step: s.title })))
  );
  const [rings, setRings] = useState(goalRings);
  const [tutorTask, setTutorTask] = useState<string | null>(null);
  const [showEffect, setShowEffect] = useState(false);
  const [justCompleted, setJustCompleted] = useState<Set<string>>(new Set());
  const [totalTasksDone, setTotalTasksDone] = useState(12);
  const [showBadge, setShowBadge] = useState(false);
  const [badgeStreak, setBadgeStreak] = useState(0);
  const navigate = useNavigate();

  const storedName = localStorage.getItem("mentorAI_userName") || "Alex Johnson";

  const toggleTask = useCallback((id: string) => {
    const task = tasks.find((t) => t.id === id);
    const completing = task && !task.done;
    const updated = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    setTasks(updated);
    setRings(computeRings(updated));
    if (completing) {
      setJustCompleted((prev) => new Set(prev).add(id));
      setTimeout(() => setJustCompleted((prev) => { const n = new Set(prev); n.delete(id); return n; }), 700);
      setShowEffect(true);
      setTotalTasksDone((prev) => {
        const next = prev + 1;
        if (BADGE_LEVELS.find((b) => b.threshold === next)) { setBadgeStreak(next); setShowBadge(true); }
        return next;
      });
    }
  }, [tasks]);

  const completeTutorTask = () => {
    if (!tutorTask) return;
    const updated = tasks.map((t) => (t.text === tutorTask ? { ...t, done: true } : t));
    setTasks(updated);
    setRings(computeRings(updated));
  };

  const pending = tasks.filter((t) => !t.done);
  const done    = tasks.filter((t) => t.done);
  const earnedBadges = BADGE_LEVELS.filter((b) => totalTasksDone >= b.threshold);
  const currentBadge = getCurrentBadge(totalTasksDone);
  const nextBadge    = getNextBadge(totalTasksDone);
  const prevThreshold = currentBadge ? currentBadge.threshold : 0;
  const nextThreshold = nextBadge ? nextBadge.threshold : totalTasksDone;
  const pct = nextBadge ? Math.round(((totalTasksDone - prevThreshold) / (nextThreshold - prevThreshold)) * 100) : 100;
  const totalCredits = totalTasksDone * CREDITS_PER_TASK + 60;

  return (
    <AppLayout>
      <TaskCompleteEffect visible={showEffect} onDone={() => setShowEffect(false)} />
      <MilestoneBadge streak={badgeStreak} visible={showBadge} onDismiss={() => setShowBadge(false)} />

      <div className="px-6 py-8 max-w-7xl mx-auto w-full">

        {/* ── Motivation Banner ── */}
        <div
          className="relative rounded-2xl p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden border"
          style={{
            background: "linear-gradient(135deg, var(--accent-light) 0%, var(--bg-elevated) 60%, var(--success-light) 100%)",
            borderColor: "var(--border)",
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-px opacity-30"
            style={{ background: "linear-gradient(90deg, transparent, var(--accent-text), transparent)" }} />

          <div className="relative z-10">
            <p className="text-xs font-medium tracking-widest uppercase mb-1" style={{ color: "var(--accent-text)" }}>
              Good morning
            </p>
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{storedName}</h2>
            <p className="text-sm mt-1.5 flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--success)" }} />
              Keep going — you&apos;re making great progress!
            </p>
            {earnedBadges.length > 0 && (
              <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                {earnedBadges.map((badge) => (
                  <span
                    key={badge.threshold}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium"
                    style={{ backgroundColor: badge.bgVar, color: badge.accentVar, borderColor: badge.borderVar }}
                  >
                    <i className={badge.icon} />
                    {badge.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="relative z-10 flex items-center gap-8">
            {rings.map((ring, i) => (
              <GoalRing key={ring.id} label={ring.label} percentage={ring.percentage}
                color={ringColors[i].color} bgColor={ringColors[i].bg} size={90} />
            ))}
          </div>
        </div>

        {/* ── Dashboard Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Left col */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Credits & Badges */}
            <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2 mb-4">
                <i className="ri-coin-fill text-lg" style={{ color: "var(--accent)" }} />
                <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Credits &amp; Badges</h2>
                <button type="button" onClick={() => navigate("/achievements")}
                  className="ml-auto text-xs cursor-pointer whitespace-nowrap" style={{ color: "var(--accent)" }}>
                  View all →
                </button>
              </div>

              {/* Credits balance */}
              <div className="rounded-xl px-4 py-3 border mb-4"
                style={{ backgroundColor: "var(--accent-light)", borderColor: "var(--accent-light)" }}>
                <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: "var(--accent-text)" }}>
                  Total Credits
                </p>
                <div className="flex items-end gap-1.5 mb-1">
                  <span className="text-3xl font-black leading-none" style={{ color: "var(--text-primary)" }}>{totalCredits}</span>
                  <span className="text-xs pb-0.5" style={{ color: "var(--text-muted)" }}>credits</span>
                </div>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                  {totalTasksDone} tasks × {CREDITS_PER_TASK} cr = {totalTasksDone * CREDITS_PER_TASK} &nbsp;+&nbsp; badge bonuses = {totalCredits}
                </p>
              </div>

              {currentBadge && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border mb-3"
                  style={{ backgroundColor: currentBadge.bgVar, borderColor: currentBadge.borderVar }}>
                  <i className={currentBadge.icon} style={{ color: currentBadge.accentVar }} />
                  <span className="text-xs font-bold" style={{ color: currentBadge.accentVar }}>{currentBadge.name}</span>
                  <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>badge unlocked</span>
                </div>
              )}

              {nextBadge ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Next badge: <span className="font-semibold" style={{ color: nextBadge.accentVar }}>{nextBadge.name}</span>
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{totalTasksDone}/{nextBadge.threshold} tasks</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-elevated)" }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: "var(--accent)" }} />
                  </div>
                  <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                    {nextBadge.threshold - totalTasksDone} more tasks to unlock {nextBadge.name}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-xl px-4 py-3"
                  style={{ backgroundColor: "var(--success-light)" }}>
                  <i className="ri-trophy-fill text-base" style={{ color: "var(--success)" }} />
                  <p className="text-xs font-semibold" style={{ color: "var(--success)" }}>All badges unlocked — incredible work!</p>
                </div>
              )}
            </div>

            {/* Focus Path */}
            <div className="rounded-2xl border p-5 flex-1" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2 mb-5">
                <i className="ri-focus-3-line text-lg" style={{ color: "var(--accent)" }} />
                <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Your Focus Path</h2>
                <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>{pending.length} tasks left</span>
              </div>
              <div className="flex flex-col gap-2">
                {pending.map((task) => {
                  const isJustDone = justCompleted.has(task.id);
                  return (
                    <div key={task.id} className="group flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer"
                      style={{}} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                      <button type="button" onClick={() => toggleTask(task.id)}
                        className="w-5 h-5 flex items-center justify-center rounded border-2 transition-all mt-0.5 shrink-0 cursor-pointer"
                        style={{
                          borderColor: isJustDone ? "var(--success)" : "var(--border)",
                          backgroundColor: isJustDone ? "var(--success)" : "transparent",
                          transform: isJustDone ? "scale(1.25)" : "scale(1)",
                          transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                        }}>
                        {isJustDone && <i className="ri-check-line text-white text-xs" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-relaxed transition-all duration-300"
                          style={{ color: isJustDone ? "var(--success)" : "var(--text-secondary)", textDecoration: isJustDone ? "line-through" : "none" }}>
                          {task.text}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{task.step}</p>
                      </div>
                      <button type="button" onClick={() => setTutorTask(task.text)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer shrink-0"
                        style={{ backgroundColor: "var(--accent-light)", color: "var(--accent-text)" }}>
                        Ask AI
                      </button>
                    </div>
                  );
                })}

                {done.length > 0 && (
                  <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                    <p className="text-xs mb-2 font-medium" style={{ color: "var(--text-muted)" }}>Completed ({done.length})</p>
                    {done.map((task) => (
                      <div key={task.id} className="flex items-start gap-3 p-2.5 opacity-50 cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={() => toggleTask(task.id)}>
                        <button type="button" className="w-5 h-5 flex items-center justify-center rounded shrink-0 mt-0.5 cursor-pointer"
                          style={{ backgroundColor: "var(--success)" }}>
                          <i className="ri-check-line text-white text-xs" />
                        </button>
                        <p className="text-sm line-through" style={{ color: "var(--text-muted)" }}>{task.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {pending.length === 0 && done.length > 0 && (
                  <div className="flex flex-col items-center py-6 gap-2">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full" style={{ backgroundColor: "var(--success-light)" }}>
                      <i className="ri-check-double-line text-xl" style={{ color: "var(--success)" }} />
                    </div>
                    <p className="text-sm font-semibold" style={{ color: "var(--success)" }}>All tasks done!</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>You&apos;re fully prepped for your next session.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center col */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            {/* Next Session */}
            <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2 mb-4">
                <i className="ri-calendar-event-line text-lg" style={{ color: "var(--accent)" }} />
                <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Next Session</h2>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <img src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20asian%20woman%20smiling%20warmly%2C%20soft%20studio%20lighting%2C%20clean%20white%20background%2C%20business%20casual%20attire%2C%20confident%20expression%2C%20high%20quality%20portrait%20photography&width=100&height=100&seq=mentor1-sm&orientation=squarish"
                    alt="Sarah" className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Sarah Chen</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Senior UX Designer · Figma</p>
                </div>
              </div>
              <div className="rounded-xl p-3 mb-4" style={{ backgroundColor: "var(--accent-light)" }}>
                <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Apr 14</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>10:00 AM · 60 min</p>
              </div>

              <div className="rounded-xl border p-3 mb-4" style={{ backgroundColor: "var(--accent-light)", borderColor: "var(--accent-light)" }}>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <i className="ri-lightbulb-flash-line text-sm" style={{ color: "var(--accent-text)" }} />
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent-text)" }}>Prep before session</p>
                </div>
                {pending.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {pending.slice(0, 2).map((task) => (
                      <div key={task.id} className="flex items-start gap-2">
                        <button type="button" onClick={() => toggleTask(task.id)}
                          className="w-4 h-4 flex items-center justify-center rounded border-2 transition-all mt-0.5 shrink-0 cursor-pointer"
                          style={{ borderColor: justCompleted.has(task.id) ? "var(--success)" : "var(--accent-text)", backgroundColor: justCompleted.has(task.id) ? "var(--success)" : "transparent" }}>
                          {justCompleted.has(task.id) && <i className="ri-check-line text-white text-xs" />}
                        </button>
                        <p className="text-xs leading-snug" style={{ color: "var(--accent-text)" }}>{task.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs flex items-center gap-1" style={{ color: "var(--accent-text)" }}>
                    <i className="ri-check-double-line" /> All prep tasks done — you&apos;re ready!
                  </p>
                )}
              </div>

              <button type="button" onClick={() => navigate("/session-dashboard")}
                className="w-full py-2 rounded-xl border text-sm font-medium transition-all cursor-pointer whitespace-nowrap"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)", backgroundColor: "transparent" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-elevated)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")}>
                View All Sessions
              </button>
            </div>

            {/* Last Session */}
            <div className="rounded-2xl border p-5 flex-1" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2 mb-4">
                <i className="ri-file-list-3-line text-lg" style={{ color: "var(--accent)" }} />
                <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Last Session</h2>
              </div>
              <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Apr 9 · 60 min with Sarah Chen</p>
              <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Portfolio Review &amp; Case Study Structure</p>
              <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
                Reviewed onboarding redesign case study. Identified gaps in problem framing and suggested NNGroup template.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {["Portfolio", "Figma", "Case Study"].map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                    {tag}
                  </span>
                ))}
              </div>
              <button type="button" onClick={() => navigate("/achievements")}
                className="text-xs font-medium cursor-pointer whitespace-nowrap" style={{ color: "var(--accent)" }}>
                View badges &amp; rewards →
              </button>
            </div>
          </div>

          {/* Right col */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            {/* AI Tutor CTA */}
            <div className="rounded-2xl p-5 flex flex-col items-center text-center"
              style={{ background: "linear-gradient(135deg, var(--accent) 0%, #6D28D9 100%)" }}>
              <div className="w-14 h-14 flex items-center justify-center rounded-full mb-3" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                <i className="ri-sparkling-2-fill text-white text-2xl" />
              </div>
              <p className="text-white font-bold text-base mb-1">Stuck on something?</p>
              <p className="text-xs mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                Ask the AI Tutor for instant explanations and examples.
              </p>
              <button type="button" onClick={() => navigate("/tutor")}
                className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer whitespace-nowrap"
                style={{ backgroundColor: "rgba(255,255,255,0.95)", color: "var(--accent)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.85)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.95)")}>
                Open AI Tutor
              </button>
            </div>

            {/* Recent Progress */}
            <div className="rounded-2xl border p-5 flex-1" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2 mb-4">
                <i className="ri-trophy-line text-lg" style={{ color: "var(--accent)" }} />
                <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Recent Progress</h2>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                {recentCompleted.map((item) => (
                  <div key={item.id} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 flex items-center justify-center rounded shrink-0 mt-0.5"
                      style={{ backgroundColor: "var(--success-light)" }}>
                      <i className="ri-check-line text-xs" style={{ color: "var(--success)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-snug" style={{ color: "var(--text-secondary)" }}>{item.text}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => navigate("/achievements")}
                className="w-full py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)", backgroundColor: "transparent" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-elevated)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")}>
                View achievements →
              </button>
            </div>
          </div>
        </div>
      </div>

      {tutorTask && (
        <AiTutorPanel taskTitle={tutorTask} onClose={() => setTutorTask(null)} onComplete={completeTutorTask} />
      )}
    </AppLayout>
  );
}
