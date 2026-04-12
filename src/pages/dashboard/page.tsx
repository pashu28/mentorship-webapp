import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { roadmapSteps, goalRings } from "@/mocks/session";
import GoalRing from "./GoalRing";
import AiTutorPanel from "./AiTutorPanel";
import TaskCompleteEffect from "./TaskCompleteEffect";
import MilestoneBadge from "./MilestoneBadge";
import AppLayout from "@/components/feature/AppLayout";

// Badge system — badges unlock based on total tasks completed
const BADGE_LEVELS = [
  { threshold: 1,   name: "First Step",    icon: "ri-footprint-fill",   color: "text-violet-500",  bg: "bg-violet-50",  border: "border-violet-200" },
  { threshold: 5,   name: "Rising Star",   icon: "ri-star-fill",        color: "text-violet-600",  bg: "bg-violet-50",  border: "border-violet-200" },
  { threshold: 10,  name: "Task Veteran",  icon: "ri-shield-star-fill", color: "text-violet-600",  bg: "bg-violet-50",  border: "border-violet-200" },
  { threshold: 25,  name: "Gold Achiever", icon: "ri-medal-fill",       color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  { threshold: 50,  name: "Champion",      icon: "ri-trophy-fill",      color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
];

const CREDITS_PER_TASK = 10;

function getCurrentBadge(tasksCompleted: number) {
  return [...BADGE_LEVELS].reverse().find((b) => tasksCompleted >= b.threshold) ?? null;
}

function getNextBadge(tasksCompleted: number) {
  return BADGE_LEVELS.find((b) => tasksCompleted < b.threshold) ?? null;
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
    const completedCount = stepTasks.filter((st) =>
      tasks.find((t) => t.id === st.id)?.done
    ).length;
    const base = BASE_RING_PERCENTAGES[stepIdx];
    const headroom = 100 - base;
    const percentage = Math.round(base + (completedCount / total) * headroom);
    return { ...ring, percentage };
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

  // Tasks completed count (starts at 12 past tasks)
  const [totalTasksDone, setTotalTasksDone] = useState(12);
  const [showBadge, setShowBadge] = useState(false);
  const [badgeStreak, setBadgeStreak] = useState(0);

  const navigate = useNavigate();

  const toggleTask = useCallback((id: string) => {
    const task = tasks.find((t) => t.id === id);
    const completing = task && !task.done;

    const updated = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    setTasks(updated);
    setRings(computeRings(updated));

    if (completing) {
      setJustCompleted((prev) => new Set(prev).add(id));
      setTimeout(() => {
        setJustCompleted((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 700);

      setShowEffect(true);

      setTotalTasksDone((prev) => {
        const next = prev + 1;
        const newBadge = BADGE_LEVELS.find((b) => b.threshold === next);
        if (newBadge) {
          setBadgeStreak(next);
          setShowBadge(true);
        }
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

  return (
    <AppLayout>
      <TaskCompleteEffect visible={showEffect} onDone={() => setShowEffect(false)} />
      <MilestoneBadge streak={badgeStreak} visible={showBadge} onDismiss={() => setShowBadge(false)} />

      <div className="px-6 py-8 max-w-7xl mx-auto w-full">

        {/* Motivation Banner */}
        <div
          className="relative rounded-2xl p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 35%, #e0f2fe 70%, #ecfdf5 100%)" }}
        >
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
              backgroundSize: "128px 128px",
            }}
          />
          <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, #c4b5fd 0%, transparent 70%)" }} />
          <div className="absolute -bottom-12 left-1/3 w-56 h-56 rounded-full opacity-25"
            style={{ background: "radial-gradient(circle, #6ee7b7 0%, transparent 70%)" }} />
          <div className="absolute -top-8 right-1/4 w-40 h-40 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #bae6fd 0%, transparent 70%)" }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4) 30%, rgba(16,185,129,0.3) 70%, transparent)" }} />

          <div className="relative z-10">
            <p className="text-violet-400 text-xs font-medium tracking-widest uppercase mb-1">Good morning</p>
            <h2 className="text-2xl font-bold text-gray-800">Alex Johnson</h2>
            <p className="text-gray-400 text-sm mt-1.5 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Keep going — you&apos;re making great progress!
            </p>
            {earnedBadges.length > 0 && (
              <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                {earnedBadges.map((badge) => (
                  <span
                    key={badge.threshold}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium ${badge.bg} ${badge.color} ${badge.border}`}
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
              <GoalRing
                key={ring.id}
                label={ring.label}
                percentage={ring.percentage}
                color={ringColors[i].color}
                bgColor={ringColors[i].bg}
                size={90}
              />
            ))}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Left col: Streak + Focus Path */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Credits & Progress */}
            {(() => {
              const currentBadge = getCurrentBadge(totalTasksDone);
              const nextBadge = getNextBadge(totalTasksDone);
              const prevThreshold = currentBadge ? currentBadge.threshold : 0;
              const nextThreshold = nextBadge ? nextBadge.threshold : totalTasksDone;
              const pct = nextBadge
                ? Math.round(((totalTasksDone - prevThreshold) / (nextThreshold - prevThreshold)) * 100)
                : 100;
              const totalCredits = totalTasksDone * CREDITS_PER_TASK + 60; // +60 badge bonuses

              return (
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <i className="ri-coin-fill text-violet-500 text-lg" />
                    <h2 className="font-bold text-gray-900">Credits &amp; Badges</h2>
                    <button type="button" onClick={() => navigate("/achievements")}
                      className="ml-auto text-xs text-violet-600 hover:underline cursor-pointer whitespace-nowrap">
                      View all →
                    </button>
                  </div>

                  {/* Credits balance */}
                  <div className="bg-violet-50 rounded-xl px-4 py-3 border border-violet-100 mb-4">
                    <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wide mb-0.5">Total Credits</p>
                    <div className="flex items-end gap-1.5 mb-1">
                      <span className="text-3xl font-black text-gray-900 leading-none">{totalCredits}</span>
                      <span className="text-xs text-gray-400 pb-0.5">credits</span>
                    </div>
                    <p className="text-[10px] text-gray-500">
                      {totalTasksDone} tasks × {CREDITS_PER_TASK} cr = {totalTasksDone * CREDITS_PER_TASK} &nbsp;+&nbsp; badge bonuses = {totalCredits}
                    </p>
                  </div>

                  {currentBadge && (
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border mb-3 ${currentBadge.bg} ${currentBadge.border}`}>
                      <i className={`${currentBadge.icon} ${currentBadge.color} text-sm`} />
                      <span className={`text-xs font-bold ${currentBadge.color}`}>{currentBadge.name}</span>
                      <span className="text-xs text-gray-400 ml-1">badge unlocked</span>
                    </div>
                  )}

                  {nextBadge ? (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-gray-500">
                          Next badge: <span className={`font-semibold ${nextBadge.color}`}>{nextBadge.name}</span>
                        </span>
                        <span className="text-xs text-gray-400">{totalTasksDone}/{nextBadge.threshold} tasks</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700 bg-violet-500"
                          style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5">
                        {nextBadge.threshold - totalTasksDone} more task{nextBadge.threshold - totalTasksDone !== 1 ? "s" : ""} to unlock {nextBadge.name}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-emerald-50 rounded-xl px-4 py-3">
                      <i className="ri-trophy-fill text-emerald-500 text-base" />
                      <p className="text-xs font-semibold text-emerald-700">All badges unlocked — incredible work!</p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Focus Path */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex-1">
              <div className="flex items-center gap-2 mb-5">
                <i className="ri-focus-3-line text-violet-500 text-lg" />
                <h2 className="font-bold text-gray-900">Your Focus Path</h2>
                <span className="ml-auto text-xs text-gray-400">{pending.length} tasks left</span>
              </div>
              <div className="flex flex-col gap-2">
                {pending.map((task) => {
                  const isJustDone = justCompleted.has(task.id);
                  return (
                    <div
                      key={task.id}
                      className="group flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      <button
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        className={`w-5 h-5 flex items-center justify-center rounded border-2 transition-all mt-0.5 shrink-0 cursor-pointer ${
                          isJustDone
                            ? "border-emerald-500 bg-emerald-500 scale-125"
                            : "border-gray-300 hover:border-violet-500"
                        }`}
                        style={{ transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
                      >
                        {isJustDone && <i className="ri-check-line text-white text-xs" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-relaxed transition-all duration-300 ${isJustDone ? "text-emerald-600 line-through" : "text-gray-800"}`}>
                          {task.text}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{task.step}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTutorTask(task.text)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity px-2.5 py-1 rounded-full bg-violet-50 text-violet-600 text-xs font-medium whitespace-nowrap cursor-pointer shrink-0"
                      >
                        Ask AI
                      </button>
                    </div>
                  );
                })}

                {done.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-2 font-medium">Completed ({done.length})</p>
                    {done.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 p-2.5 opacity-50 cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={() => toggleTask(task.id)}
                      >
                        <button type="button" className="w-5 h-5 flex items-center justify-center rounded bg-emerald-500 shrink-0 mt-0.5 cursor-pointer">
                          <i className="ri-check-line text-white text-xs" />
                        </button>
                        <p className="text-sm text-gray-500 line-through">{task.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {pending.length === 0 && done.length > 0 && (
                  <div className="flex flex-col items-center py-6 gap-2">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-100">
                      <i className="ri-check-double-line text-emerald-600 text-xl" />
                    </div>
                    <p className="text-sm font-semibold text-emerald-700">All tasks done!</p>
                    <p className="text-xs text-gray-400">You&apos;re fully prepped for your next session.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center col: Next Session + Last Session Summary */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            {/* Next Session */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <i className="ri-calendar-event-line text-violet-500 text-lg" />
                <h2 className="font-bold text-gray-900">Next Session</h2>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <img
                    src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20asian%20woman%20smiling%20warmly%2C%20soft%20studio%20lighting%2C%20clean%20white%20background%2C%20business%20casual%20attire%2C%20confident%20expression%2C%20high%20quality%20portrait%20photography&width=100&height=100&seq=mentor1-sm&orientation=squarish"
                    alt="Sarah"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Sarah Chen</p>
                  <p className="text-xs text-gray-500">Senior UX Designer · Figma</p>
                </div>
              </div>
              <div className="bg-violet-50 rounded-xl p-3 mb-4">
                <p className="text-xl font-bold text-gray-900">Apr 14</p>
                <p className="text-sm text-gray-500">10:00 AM · 60 min</p>
              </div>

              <div className="rounded-xl border border-violet-100 bg-violet-50/70 p-3 mb-4">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-lightbulb-flash-line text-violet-500 text-sm" />
                  </div>
                  <p className="text-xs font-semibold text-violet-700 uppercase tracking-wide">Prep before session</p>
                </div>
                {pending.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {pending.slice(0, 2).map((task) => (
                      <div key={task.id} className="flex items-start gap-2">
                        <button
                          type="button"
                          onClick={() => toggleTask(task.id)}
                          className={`w-4 h-4 flex items-center justify-center rounded border-2 bg-white transition-all mt-0.5 shrink-0 cursor-pointer ${
                            justCompleted.has(task.id)
                              ? "border-emerald-400 bg-emerald-400"
                              : "border-violet-300 hover:border-violet-500"
                          }`}
                        >
                          {justCompleted.has(task.id) && (
                            <i className="ri-check-line text-white text-xs" />
                          )}
                        </button>
                        <p className="text-xs text-violet-900 leading-snug">{task.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-violet-700 flex items-center gap-1">
                    <i className="ri-check-double-line" /> All prep tasks done — you&apos;re ready!
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => navigate("/session-dashboard")}
                className="w-full py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap"
              >
                View All Sessions
              </button>
            </div>

            {/* Last Session Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex-1">
              <div className="flex items-center gap-2 mb-4">
                <i className="ri-file-list-3-line text-violet-500 text-lg" />
                <h2 className="font-bold text-gray-900">Last Session</h2>
              </div>
              <p className="text-xs text-gray-400 mb-1">Apr 9 · 60 min with Sarah Chen</p>
              <p className="text-sm font-semibold text-gray-800 mb-2">Portfolio Review &amp; Case Study Structure</p>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Reviewed onboarding redesign case study. Identified gaps in problem framing and suggested NNGroup template. Discussed Figma Auto Layout fundamentals.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {["Portfolio", "Figma", "Case Study"].map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{tag}</span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigate("/achievements")}
                className="text-xs text-violet-600 font-medium hover:underline cursor-pointer whitespace-nowrap"
              >
                View badges &amp; rewards →
              </button>
            </div>
          </div>

          {/* Right col: AI Tutor + Recent Progress */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            {/* AI Tutor */}
            <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-5 flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/20 mb-3">
                <i className="ri-sparkling-2-fill text-white text-2xl" />
              </div>
              <p className="text-white font-bold text-base mb-1">Stuck on something?</p>
              <p className="text-white/70 text-xs mb-4 leading-relaxed">
                Ask the AI Tutor for instant explanations and examples.
              </p>
              <button
                type="button"
                onClick={() => navigate("/tutor")}
                className="w-full py-2.5 rounded-xl bg-white text-violet-700 font-semibold text-sm hover:bg-violet-50 transition-all cursor-pointer whitespace-nowrap"
              >
                Open AI Tutor
              </button>
            </div>

            {/* Recent Progress */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex-1">
              <div className="flex items-center gap-2 mb-4">
                <i className="ri-trophy-line text-violet-500 text-lg" />
                <h2 className="font-bold text-gray-900">Recent Progress</h2>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                {recentCompleted.map((item) => (
                  <div key={item.id} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 flex items-center justify-center rounded bg-emerald-100 shrink-0 mt-0.5">
                      <i className="ri-check-line text-emerald-600 text-xs" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 leading-snug">{item.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigate("/achievements")}
                className="w-full py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap"
              >
                View achievements →
              </button>
            </div>
          </div>
        </div>
      </div>

      {tutorTask && (
        <AiTutorPanel
          taskTitle={tutorTask}
          onClose={() => setTutorTask(null)}
          onComplete={completeTutorTask}
        />
      )}
    </AppLayout>
  );
}
