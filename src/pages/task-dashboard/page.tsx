import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/feature/AppLayout";
import GoalRing from "@/pages/dashboard/GoalRing";
import TaskCompleteEffect from "@/pages/dashboard/TaskCompleteEffect";
import MilestoneBadge from "@/pages/dashboard/MilestoneBadge";
import TaskDetailScreen from "./components/TaskDetailScreen";
import { mainTasks as initialTasks, goalRingsData, type MainTask } from "@/mocks/taskDashboard";

// ── Weekly badge thresholds ────────────────────────────────────────────────
const BADGE_LEVELS = [
  { threshold: 3, name: "Rising Star",  icon: "ri-star-fill",     color: "text-amber-500",   bg: "bg-amber-50",   border: "border-amber-200" },
  { threshold: 5, name: "Week Warrior", icon: "ri-rocket-2-fill", color: "text-violet-500",  bg: "bg-violet-50",  border: "border-violet-200" },
  { threshold: 7, name: "Champion",     icon: "ri-trophy-fill",   color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" },
];

// ── Weekly goal config ─────────────────────────────────────────────────────
const WEEKLY_GOAL = 7; // tasks per week to hit Champion

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon...
  const diff = (day === 0 ? -6 : 1 - day); // shift to Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatWeekRange(weekStart: Date): string {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${weekStart.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", opts)}`;
}

function getCurrentBadge(count: number) {
  return [...BADGE_LEVELS].reverse().find((b) => count >= b.threshold) ?? null;
}
function getNextBadge(count: number) {
  return BADGE_LEVELS.find((b) => count < b.threshold) ?? null;
}

// ── Mentor mock data ───────────────────────────────────────────────────────
const MENTOR = { name: "Sarah Chen", avatar: "SC", title: "Senior UX Designer at Google" };

const STEP_STYLE = {
  violet: {
    dot: "bg-violet-500",
    bar: "bg-violet-500",
    badge: "bg-violet-50 text-violet-700 border-violet-200",
    text: "text-violet-600",
    iconBg: "bg-violet-100",
    iconText: "text-violet-600",
    cardBorder: "border-violet-100",
    cardAccent: "bg-violet-50",
    btn: "bg-violet-600 hover:bg-violet-700",
    btnOutline: "border-violet-200 text-violet-600 hover:bg-violet-50",
    ring: { color: "stroke-violet-600", bg: "stroke-violet-200" },
  },
  emerald: {
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    text: "text-emerald-600",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
    cardBorder: "border-emerald-100",
    cardAccent: "bg-emerald-50",
    btn: "bg-emerald-600 hover:bg-emerald-700",
    btnOutline: "border-emerald-200 text-emerald-600 hover:bg-emerald-50",
    ring: { color: "stroke-emerald-600", bg: "stroke-emerald-200" },
  },
  amber: {
    dot: "bg-amber-500",
    bar: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    text: "text-amber-600",
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
    cardBorder: "border-amber-100",
    cardAccent: "bg-amber-50",
    btn: "bg-amber-500 hover:bg-amber-600",
    btnOutline: "border-amber-200 text-amber-600 hover:bg-amber-50",
    ring: { color: "stroke-amber-500", bg: "stroke-amber-200" },
  },
};

type TabId = "overview" | "tasks";

// ── Persist weekly progress in localStorage ────────────────────────────────
const STORAGE_KEY = "task_weekly_progress";

interface WeeklyProgress {
  weekStart: string; // ISO date string
  completedThisWeek: number;
  earnedBadges: number[]; // thresholds already awarded this week
}

function loadWeeklyProgress(): WeeklyProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: WeeklyProgress = JSON.parse(raw);
      const storedWeek = new Date(parsed.weekStart);
      const currentWeek = getWeekStart(new Date());
      // If stored week matches current week, use it; otherwise reset
      if (storedWeek.getTime() === currentWeek.getTime()) return parsed;
    }
  } catch (_) { /* ignore */ }
  return { weekStart: getWeekStart(new Date()).toISOString(), completedThisWeek: 0, earnedBadges: [] };
}

function saveWeeklyProgress(p: WeeklyProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export default function TaskDashboardPage() {
  const navigate = useNavigate();
  const tabBarRef = useRef<HTMLDivElement>(null);
  const [isTabSticky, setIsTabSticky] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [tasks, setTasks] = useState<MainTask[]>(
    initialTasks.map((t) => ({ ...t, subTasks: t.subTasks.map((s) => ({ ...s })) }))
  );
  const [selectedTask, setSelectedTask] = useState<MainTask | null>(null);
  const [showEffect, setShowEffect] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [badgeStreak, setBadgeStreak] = useState(0);

  // ── Weekly progress state ────────────────────────────────────────────────
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress>(loadWeeklyProgress);

  const weekStart = getWeekStart(new Date());
  const weekRange = formatWeekRange(weekStart);
  const weeklyCount = weeklyProgress.completedThisWeek;
  const weeklyPct = Math.min(Math.round((weeklyCount / WEEKLY_GOAL) * 100), 100);

  const currentBadge = getCurrentBadge(weeklyCount);
  const nextBadge = getNextBadge(weeklyCount);
  const prevThreshold = currentBadge ? currentBadge.threshold : 0;
  const nextThreshold = nextBadge ? nextBadge.threshold : WEEKLY_GOAL;
  const badgePct = nextBadge
    ? Math.round(((weeklyCount - prevThreshold) / (nextThreshold - prevThreshold)) * 100)
    : 100;

  useEffect(() => {
    const handleScroll = () => {
      if (tabBarRef.current) {
        setIsTabSticky(tabBarRef.current.getBoundingClientRect().top <= 0);
      }
    };
    const scrollEl = document.querySelector("main");
    scrollEl?.addEventListener("scroll", handleScroll);
    return () => scrollEl?.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTaskComplete = useCallback((taskId: string) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, done: true } : t)));
    setShowEffect(true);

    setWeeklyProgress((prev) => {
      const next = prev.completedThisWeek + 1;
      const newProgress: WeeklyProgress = { ...prev, completedThisWeek: next };

      // Check if a new badge threshold is crossed this week
      const newBadge = BADGE_LEVELS.find(
        (b) => b.threshold === next && !prev.earnedBadges.includes(b.threshold)
      );
      if (newBadge) {
        newProgress.earnedBadges = [...prev.earnedBadges, newBadge.threshold];
        setBadgeStreak(next);
        setShowBadge(true);
      }

      saveWeeklyProgress(newProgress);
      return newProgress;
    });
  }, []);

  const handleSubTaskToggle = (taskId: string, subId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, subTasks: t.subTasks.map((s) => (s.id === subId ? { ...s, done: !s.done } : s)) }
          : t
      )
    );
  };

  const getUpdatedTask = (taskId: string) => tasks.find((t) => t.id === taskId) ?? null;

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.done).length;
  const overallPct = Math.round((doneTasks / totalTasks) * 100);

  const nextTask = tasks.find((t) => !t.done);
  const priorityTasks = tasks.filter((t) => !t.done).slice(0, 3);
  const recentDone = tasks.filter((t) => t.done).slice(-3).reverse();

  const stepGroups = [
    { stepId: 1, label: "Step 1", title: "Build Your Foundation", color: "violet" as const },
    { stepId: 2, label: "Step 2", title: "Document Your Work", color: "emerald" as const },
    { stepId: 3, label: "Step 3", title: "Expand Your Network", color: "amber" as const },
  ];

  const TABS: { id: TabId; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "ri-home-4-line" },
    { id: "tasks", label: "All Tasks", icon: "ri-list-check-2" },
  ];

  // ── Mentor attribution tag (reusable) ────────────────────────────────────
  const MentorTag = () => (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium whitespace-nowrap">
      <span className="w-4 h-4 rounded-full bg-violet-200 text-violet-700 text-[9px] font-bold flex items-center justify-center shrink-0">
        {MENTOR.avatar}
      </span>
      Assigned by {MENTOR.name}
    </span>
  );

  return (
    <AppLayout>
      <TaskCompleteEffect visible={showEffect} onDone={() => setShowEffect(false)} />
      <MilestoneBadge streak={badgeStreak} visible={showBadge} onDismiss={() => setShowBadge(false)} />

      {selectedTask && (
        <TaskDetailScreen
          task={getUpdatedTask(selectedTask.id) ?? selectedTask}
          onSubTaskToggle={(subId) => handleSubTaskToggle(selectedTask.id, subId)}
          onTaskComplete={() => handleTaskComplete(selectedTask.id)}
          onClose={() => setSelectedTask(null)}
        />
      )}

      <div className="w-full min-h-screen bg-[#F7F8FA]">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="bg-[#F7F8FA] px-6 pt-8 pb-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium mb-2">
                  <i className="ri-focus-3-line text-xs" />
                  Action Mode
                </span>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Assigned Tasks</h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="w-6 h-6 rounded-full bg-violet-200 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-violet-700">{MENTOR.avatar}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Tasks assigned by <span className="font-medium text-gray-700">{MENTOR.name}</span>
                    <span className="text-gray-400 ml-1">· {MENTOR.title}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Goal Rings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {goalRingsData.map((ring, i) => {
                const stepTasks = tasks.filter((t) => t.stepId === ring.stepId);
                const stepDone = stepTasks.filter((t) => t.done).length;
                const pct = stepTasks.length > 0 ? Math.round((stepDone / stepTasks.length) * 100) : 0;
                const col = stepGroups[i].color;
                const style = STEP_STYLE[col];
                return (
                  <div key={ring.id} className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100">
                    <GoalRing label="" percentage={pct} color={ring.color} bgColor={ring.bg} size={68} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 font-medium mb-0.5">{stepGroups[i].label}</p>
                      <p className="text-sm font-bold text-gray-900 leading-snug">{ring.label}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${style.bar} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 shrink-0">{stepDone}/{stepTasks.length}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Overall Progress */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-violet-50">
                      <i className="ri-pie-chart-2-line text-violet-500 text-xs" />
                    </div>
                    <p className="text-xs text-gray-400 font-medium">Overall Progress</p>
                  </div>
                  <span className="text-xs font-bold text-violet-600">{overallPct}%</span>
                </div>
                <p className="text-2xl font-black text-gray-900 leading-none">
                  {doneTasks}<span className="text-sm font-medium text-gray-300 ml-1">/ {totalTasks}</span>
                </p>
                <div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full transition-all duration-700" style={{ width: `${overallPct}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{totalTasks - doneTasks} tasks remaining</p>
                </div>
              </div>

              {/* This Week — weekly goal */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-emerald-50">
                      <i className="ri-calendar-check-line text-emerald-500 text-xs" />
                    </div>
                    <p className="text-xs text-gray-400 font-medium">This Week</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">{weeklyPct}%</span>
                </div>
                <p className="text-2xl font-black text-gray-900 leading-none">
                  {weeklyCount}<span className="text-sm font-medium text-gray-300 ml-1">/ {WEEKLY_GOAL}</span>
                </p>
                <div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full transition-all duration-700" style={{ width: `${weeklyPct}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{weekRange}</p>
                </div>
              </div>

              {/* Weekly Streak — progress to next badge */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-orange-50">
                      <i className="ri-fire-fill text-orange-500 text-xs" />
                    </div>
                    <p className="text-xs text-gray-400 font-medium">Weekly Streak</p>
                  </div>
                  {nextBadge && <span className="text-xs font-bold text-orange-500">{badgePct}%</span>}
                </div>
                <p className="text-2xl font-black text-gray-900 leading-none">
                  {weeklyCount}<span className="text-sm font-medium text-gray-300 ml-1">tasks</span>
                </p>
                <div>
                  {nextBadge ? (
                    <>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400 rounded-full transition-all duration-700" style={{ width: `${badgePct}%` }} />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {nextBadge.threshold - weeklyCount} more to <span className="font-medium">{nextBadge.name}</span>
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-orange-500 font-medium mt-1">All weekly badges earned!</p>
                  )}
                </div>
              </div>

              {/* Current Badge */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-amber-50">
                    <i className="ri-medal-line text-amber-500 text-xs" />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">Weekly Badge</p>
                </div>
                {currentBadge ? (
                  <>
                    <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${currentBadge.bg} ${currentBadge.border} w-fit`}>
                      <i className={`${currentBadge.icon} text-sm ${currentBadge.color}`} />
                      <span className={`text-sm font-bold ${currentBadge.color}`}>{currentBadge.name}</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {nextBadge ? `${nextBadge.threshold - weeklyCount} tasks to next badge` : "Top rank this week!"}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-black text-gray-200 leading-none">—</p>
                    <p className="text-xs text-gray-400">
                      Complete {nextBadge!.threshold} tasks this week to earn{" "}
                      <span className="font-medium text-gray-600">{nextBadge!.name}</span>
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Weekly goal explainer strip */}
            <div className="mt-3 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-gray-100">
              <i className="ri-information-line text-gray-400 text-sm shrink-0" />
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">Weekly Goal:</span> Complete tasks each week to earn badges.
                Badges reset every Monday — keep the streak alive!
              </p>
              <div className="ml-auto flex items-center gap-2 shrink-0">
                {BADGE_LEVELS.map((b) => (
                  <span
                    key={b.threshold}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium transition-all ${
                      weeklyCount >= b.threshold ? `${b.bg} ${b.color} ${b.border}` : "bg-gray-50 text-gray-300 border-gray-100"
                    }`}
                  >
                    <i className={`${b.icon} text-xs`} />
                    {b.threshold}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Sticky Tab Bar ─────────────────────────────────────────────── */}
        <div
          ref={tabBarRef}
          className={`sticky top-0 z-20 bg-[#F7F8FA] transition-all duration-200 ${isTabSticky ? "shadow-sm" : ""}`}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-0 border-b border-gray-200">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap -mb-px ${
                    activeTab === tab.id
                      ? "border-violet-600 text-violet-700"
                      : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <i className={`${tab.icon} text-sm`} />
                  {tab.label}
                </button>
              ))}
              {nextBadge && (
                <div className="ml-auto hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 my-2">
                  <i className="ri-fire-fill text-orange-500 text-xs" />
                  <span className="text-xs font-medium text-orange-700">
                    {nextBadge.threshold - weeklyCount} tasks this week to {nextBadge.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6">

          {/* ══ TAB: OVERVIEW ══════════════════════════════════════════════ */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 flex flex-col gap-5">

                {/* Continue Learning CTA */}
                {nextTask && (
                  <div
                    className="bg-white rounded-2xl border border-gray-100 p-4 cursor-pointer hover:border-gray-200 transition-all group"
                    onClick={() => setSelectedTask(nextTask)}
                  >
                    <p className="text-xs text-gray-400 font-medium mb-3">Continue where you left off</p>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${STEP_STYLE[nextTask.color].iconBg} flex items-center justify-center shrink-0`}>
                        <i className={`${nextTask.resourceIcon} ${STEP_STYLE[nextTask.color].iconText} text-lg`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 leading-snug truncate">{nextTask.title}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <p className="text-xs text-gray-400">{nextTask.stepLabel} · {nextTask.stepTitle}</p>
                          <MentorTag />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setSelectedTask(nextTask); }}
                        className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${STEP_STYLE[nextTask.color].btn}`}
                      >
                        <i className="ri-play-fill text-xs" />
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {/* Priority Task Cards */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <i className="ri-focus-3-line text-violet-500 text-sm" />
                      <h2 className="font-bold text-gray-900 text-sm">Today&apos;s Priority Tasks</h2>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 border border-violet-200 font-medium">This Week</span>
                    </div>
                    <button type="button" onClick={() => setActiveTab("tasks")} className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer whitespace-nowrap">
                      View all →
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    {priorityTasks.length === 0 ? (
                      <div className="flex flex-col items-center py-10 gap-2 bg-white rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-100">
                          <i className="ri-check-double-line text-emerald-600 text-xl" />
                        </div>
                        <p className="text-sm font-semibold text-emerald-700">All priority tasks done!</p>
                      </div>
                    ) : (
                      priorityTasks.map((task) => {
                        const style = STEP_STYLE[task.color];
                        const subsDone = task.subTasks.filter((s) => s.done).length;
                        const subsPct = task.subTasks.length > 0 ? Math.round((subsDone / task.subTasks.length) * 100) : 0;
                        return (
                          <div
                            key={task.id}
                            className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 transition-all cursor-pointer group"
                            onClick={() => setSelectedTask(task)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-9 h-9 rounded-xl ${style.iconBg} flex items-center justify-center shrink-0`}>
                                <i className={`${task.resourceIcon} ${style.iconText} text-base`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${style.badge}`}>{task.stepLabel}</span>
                                  <MentorTag />
                                </div>
                                <p className="text-sm font-semibold text-gray-900 leading-snug">{task.title}</p>
                                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{task.description}</p>
                                {task.subTasks.length > 0 && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden max-w-[120px]">
                                      <div className={`h-full ${style.bar} rounded-full transition-all duration-500`} style={{ width: `${subsPct}%` }} />
                                    </div>
                                    <span className="text-xs text-gray-400">{subsDone}/{task.subTasks.length} sub-tasks</span>
                                  </div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setSelectedTask(task); }}
                                className={`shrink-0 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${style.btn}`}
                              >
                                {subsDone > 0 ? "Continue" : "Start"}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>

              {/* Right column */}
              <div className="flex flex-col gap-5">
                {/* Recent Progress */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <i className="ri-history-line text-emerald-500 text-base" />
                    <h2 className="font-bold text-gray-900 text-sm">Recent Progress</h2>
                  </div>
                  {recentDone.length === 0 ? (
                    <div className="flex flex-col items-center py-6 gap-2 text-center">
                      <i className="ri-checkbox-blank-circle-line text-gray-200 text-3xl" />
                      <p className="text-xs text-gray-400">Complete your first task to see progress here.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {recentDone.map((task) => {
                        const style = STEP_STYLE[task.color];
                        return (
                          <div key={task.id} className="flex items-start gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                              <i className="ri-check-line text-emerald-600 text-xs" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-700 leading-snug font-medium">{task.title}</p>
                              <p className={`text-xs font-medium mt-0.5 ${style.text}`}>{task.stepLabel}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {doneTasks > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-gray-500">Overall completion</span>
                        <span className="text-xs font-bold text-gray-900">{overallPct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full transition-all duration-700" style={{ width: `${overallPct}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <i className="ri-flashlight-line text-amber-500 text-base" />
                    <h2 className="font-bold text-gray-900 text-sm">Quick Actions</h2>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button type="button" onClick={() => navigate("/tutor")} className="flex items-center gap-3 p-3 rounded-xl bg-violet-50 hover:bg-violet-100 transition-all cursor-pointer text-left">
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-violet-600 shrink-0">
                        <i className="ri-sparkling-2-fill text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-violet-800">Ask AI Tutor</p>
                        <p className="text-xs text-violet-500">Get instant help</p>
                      </div>
                      <i className="ri-arrow-right-s-line text-violet-400 ml-auto" />
                    </button>
                    <button type="button" onClick={() => navigate("/resources")} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-all cursor-pointer text-left">
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-600 shrink-0">
                        <i className="ri-archive-drawer-fill text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-emerald-800">Resource Vault</p>
                        <p className="text-xs text-emerald-500">Links &amp; docs</p>
                      </div>
                      <i className="ri-arrow-right-s-line text-emerald-400 ml-auto" />
                    </button>
                    <button type="button" onClick={() => navigate("/session-dashboard")} className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 hover:bg-amber-100 transition-all cursor-pointer text-left">
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-500 shrink-0">
                        <i className="ri-calendar-event-fill text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-amber-800">Next Session</p>
                        <p className="text-xs text-amber-500">Apr 14 · 10:00 AM</p>
                      </div>
                      <i className="ri-arrow-right-s-line text-amber-400 ml-auto" />
                    </button>
                  </div>
                </div>

                {/* Earned Badges this week */}
                {BADGE_LEVELS.filter((b) => weeklyCount >= b.threshold).length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <i className="ri-award-line text-amber-500 text-base" />
                      <h2 className="font-bold text-gray-900 text-sm">This Week&apos;s Badges</h2>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {BADGE_LEVELS.filter((b) => weeklyCount >= b.threshold).map((badge) => (
                        <span key={badge.threshold} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium ${badge.bg} ${badge.color} ${badge.border}`}>
                          <i className={`${badge.icon} text-sm`} />
                          {badge.name}
                          <span className="ml-auto text-[10px] opacity-60">{badge.threshold} tasks</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══ TAB: ALL TASKS ═════════════════════════════════════════════ */}
          {activeTab === "tasks" && (
            <div className="flex flex-col gap-8">
              {/* Empty state — shown when no tasks exist */}
              {tasks.length === 0 && (
                <div className="flex flex-col items-center py-20 gap-4 bg-white rounded-2xl border border-gray-100">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
                    <i className="ri-task-line text-gray-300 text-3xl" />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-semibold text-gray-700 mb-1">No tasks assigned yet</p>
                    <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                      Your mentor <span className="font-medium text-gray-600">{MENTOR.name}</span> hasn&apos;t assigned any tasks yet.
                      Check back after your next session!
                    </p>
                  </div>
                </div>
              )}

              {stepGroups.map((group) => {
                const style = STEP_STYLE[group.color];
                const groupTasks = tasks.filter((t) => t.stepId === group.stepId);
                if (groupTasks.length === 0) return null;
                const groupDone = groupTasks.filter((t) => t.done).length;
                const groupPct = Math.round((groupDone / groupTasks.length) * 100);
                return (
                  <div key={group.stepId}>
                    {/* Step header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${style.dot} shrink-0`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-gray-400 font-medium">{group.label}</span>
                          <h2 className="text-sm font-bold text-gray-900">{group.title}</h2>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${style.badge}`}>{groupDone}/{groupTasks.length} done</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden hidden sm:block">
                          <div className={`h-full ${style.bar} rounded-full transition-all duration-700`} style={{ width: `${groupPct}%` }} />
                        </div>
                        <span className="text-xs text-gray-400">{groupPct}%</span>
                      </div>
                    </div>

                    {/* Task cards grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupTasks.map((task) => {
                        const s = STEP_STYLE[task.color];
                        const subsDone = task.subTasks.filter((sub) => sub.done).length;
                        const subsPct = task.subTasks.length > 0 ? Math.round((subsDone / task.subTasks.length) * 100) : 0;
                        return (
                          <div
                            key={task.id}
                            className={`bg-white rounded-2xl border p-5 flex flex-col gap-3 cursor-pointer hover:border-gray-200 transition-all group ${task.done ? "opacity-70" : "border-gray-100"}`}
                            onClick={() => setSelectedTask(task)}
                          >
                            {/* Card top */}
                            <div className="flex items-start justify-between gap-2">
                              <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center shrink-0`}>
                                <i className={`${task.resourceIcon} ${s.iconText} text-lg`} />
                              </div>
                              {task.done ? (
                                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                                  <i className="ri-check-line text-white text-xs" />
                                </div>
                              ) : (
                                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${s.badge} whitespace-nowrap`}>{task.stepLabel}</span>
                              )}
                            </div>

                            {/* Title + desc */}
                            <div className="flex-1">
                              <h3 className={`text-sm font-bold leading-snug mb-1 ${task.done ? "text-gray-400 line-through" : "text-gray-900"}`}>{task.title}</h3>
                              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{task.description}</p>
                            </div>

                            {/* Mentor attribution */}
                            <MentorTag />

                            {/* Progress */}
                            {!task.done && task.subTasks.length > 0 && (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-gray-400">Progress</span>
                                  <span className="text-xs text-gray-400">{subsDone}/{task.subTasks.length}</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div className={`h-full ${s.bar} rounded-full transition-all duration-500`} style={{ width: `${subsPct}%` }} />
                                </div>
                              </div>
                            )}

                            {/* Resource count */}
                            <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                              <div className="flex items-center gap-1.5">
                                <i className="ri-links-line text-gray-300 text-xs" />
                                <span className="text-xs text-gray-400">{task.resources.length} resource{task.resources.length !== 1 ? "s" : ""}</span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setSelectedTask(task); }}
                                className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${task.done ? "bg-gray-300" : s.btn}`}
                              >
                                {task.done ? "Review" : subsDone > 0 ? "Continue" : "Start"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  );
}
