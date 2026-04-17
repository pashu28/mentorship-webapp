import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/feature/AppLayout";
import GoalRing from "@/pages/dashboard/GoalRing";
import TaskCompleteEffect from "@/pages/dashboard/TaskCompleteEffect";
import MilestoneBadge from "@/pages/dashboard/MilestoneBadge";
import TaskDetailScreen from "./components/TaskDetailScreen";
import { mainTasks as initialTasks, goalRingsData, type MainTask } from "@/mocks/taskDashboard";
import { BADGE_DEFS, CREDITS_PER_TASK } from "@/mocks/achievements";
import { useTheme } from "@/hooks/useTheme";

function calcCredits(tasksCompleted: number): number {
  const fromTasks = tasksCompleted * CREDITS_PER_TASK;
  const fromBadges = BADGE_DEFS.filter((b) => tasksCompleted >= b.tasksRequired)
    .reduce((sum, b) => sum + b.bonusCredits, 0);
  return fromTasks + fromBadges;
}

function getEarnedBadges(tasksCompleted: number) {
  return BADGE_DEFS.filter((b) => tasksCompleted >= b.tasksRequired);
}

function getNextBadge(tasksCompleted: number) {
  return BADGE_DEFS.find((b) => tasksCompleted < b.tasksRequired) ?? null;
}

function getLatestBadge(tasksCompleted: number) {
  return [...BADGE_DEFS].reverse().find((b) => tasksCompleted >= b.tasksRequired) ?? null;
}

function getBookedMentorInfo() {
  try {
    const raw = localStorage.getItem("mentorAI_bookedMentor");
    if (raw) {
      const m = JSON.parse(raw) as { name?: string; mentorName?: string; role?: string; mentorRole?: string; photo?: string; avatar?: string };
      const resolvedName = m.name ?? m.mentorName ?? "";
      const resolvedRole = m.role ?? m.mentorRole ?? "Mentor";
      if (resolvedName) {
        const nameParts = resolvedName.split(" ");
        const avatar = nameParts.map((p: string) => p[0]).join("").slice(0, 2).toUpperCase();
        const photo = m.photo ?? m.avatar ?? null;
        return { name: resolvedName, avatar, title: resolvedRole, photo };
      }
    }
  } catch (_) { /* ignore */ }
  return { name: "Your Mentor", avatar: "YM", title: "Mentor", photo: null as string | null };
}

const STEP_STYLE = {
  violet: {
    dot: "bg-violet-600",
    bar: "bg-violet-600",
    badge: "bg-violet-50 text-violet-700 border-violet-200",
    badgeDark: "bg-violet-900/40 text-violet-300 border-violet-700",
    text: "text-violet-600",
    iconBg: "bg-violet-50",
    iconBgDark: "bg-violet-900/40",
    iconText: "text-violet-600",
    iconTextDark: "text-violet-400",
    btn: "bg-violet-600 hover:bg-violet-700",
    ring: { color: "stroke-violet-600", bg: "stroke-violet-200" },
  },
  emerald: {
    dot: "bg-violet-400",
    bar: "bg-violet-400",
    badge: "bg-violet-50 text-violet-600 border-violet-200",
    badgeDark: "bg-violet-900/30 text-violet-400 border-violet-700",
    text: "text-violet-500",
    iconBg: "bg-violet-50",
    iconBgDark: "bg-violet-900/30",
    iconText: "text-violet-500",
    iconTextDark: "text-violet-400",
    btn: "bg-violet-500 hover:bg-violet-600",
    ring: { color: "stroke-violet-400", bg: "stroke-violet-100" },
  },
  amber: {
    dot: "bg-violet-300",
    bar: "bg-violet-300",
    badge: "bg-violet-50 text-violet-500 border-violet-100",
    badgeDark: "bg-violet-900/20 text-violet-400 border-violet-800",
    text: "text-violet-400",
    iconBg: "bg-violet-50",
    iconBgDark: "bg-violet-900/20",
    iconText: "text-violet-400",
    iconTextDark: "text-violet-400",
    btn: "bg-violet-400 hover:bg-violet-500",
    ring: { color: "stroke-violet-300", bg: "stroke-violet-100" },
  },
};

type TabId = "overview" | "tasks";

const STORAGE_KEY = "task_total_completed";

function loadTotalCompleted(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return parseInt(raw, 10) || 0;
  } catch (_) { /* ignore */ }
  return 0;
}

function saveTotalCompleted(n: number) {
  localStorage.setItem(STORAGE_KEY, String(n));
}

interface LockTooltip {
  taskId: string;
  prereqTitle: string;
  prereqOrder: number;
}

// Dark-aware badge color map — maps light Tailwind classes to dark inline styles
const BADGE_DARK_STYLES: Record<string, { bg: string; border: string; color: string }> = {
  "text-violet-500": { bg: "rgba(139,92,246,0.18)", border: "rgba(139,92,246,0.45)", color: "#C4B5FD" },
  "text-violet-600": { bg: "rgba(139,92,246,0.18)", border: "rgba(139,92,246,0.45)", color: "#C4B5FD" },
  "text-emerald-600": { bg: "rgba(52,211,153,0.15)", border: "rgba(52,211,153,0.4)", color: "#6EE7B7" },
  "text-emerald-700": { bg: "rgba(52,211,153,0.15)", border: "rgba(52,211,153,0.4)", color: "#6EE7B7" },
};

export default function TaskDashboardPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const tabBarRef = useRef<HTMLDivElement>(null);
  const [isTabSticky, setIsTabSticky] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [mentor, setMentor] = useState(getBookedMentorInfo);
  const [lockTooltip, setLockTooltip] = useState<LockTooltip | null>(null);

  useEffect(() => {
    setMentor(getBookedMentorInfo());
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = parseInt(raw, 10) || 0;
        if (stored > initialTasks.length) {
          localStorage.removeItem(STORAGE_KEY);
          setTotalCompleted(0);
        }
      }
    } catch (_) { /* ignore */ }
  }, []);

  const [tasks, setTasks] = useState<MainTask[]>(
    initialTasks.map((t) => ({ ...t, subTasks: t.subTasks.map((s) => ({ ...s })) }))
  );
  const [selectedTask, setSelectedTask] = useState<MainTask | null>(null);
  const [showEffect, setShowEffect] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [newBadgeName, setNewBadgeName] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState<number>(loadTotalCompleted);

  const totalCredits = calcCredits(totalCompleted);
  const earnedBadges = getEarnedBadges(totalCompleted);
  const nextBadge = getNextBadge(totalCompleted);
  const latestBadge = getLatestBadge(totalCompleted);

  const prevBadgeThreshold = latestBadge ? latestBadge.tasksRequired : 0;
  const nextBadgeThreshold = nextBadge ? nextBadge.tasksRequired : (latestBadge?.tasksRequired ?? 1);
  const badgeProgressPct = nextBadge
    ? Math.min(Math.round(((totalCompleted - prevBadgeThreshold) / (nextBadgeThreshold - prevBadgeThreshold)) * 100), 100)
    : 100;

  const isTaskLocked = useCallback((taskId: string): boolean => {
    const idx = tasks.findIndex((t) => t.id === taskId);
    if (idx <= 0) return false;
    return !tasks[idx - 1].done;
  }, [tasks]);

  const getPrerequisiteTask = useCallback((taskId: string): MainTask | null => {
    const idx = tasks.findIndex((t) => t.id === taskId);
    if (idx <= 0) return null;
    return tasks[idx - 1];
  }, [tasks]);

  const handleLockedClick = useCallback((e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    const prereq = getPrerequisiteTask(taskId);
    if (!prereq) return;
    const prereqIdx = tasks.findIndex((t) => t.id === prereq.id);
    setLockTooltip({ taskId, prereqTitle: prereq.title, prereqOrder: prereqIdx + 1 });
  }, [getPrerequisiteTask, tasks]);

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

  useEffect(() => {
    if (!lockTooltip) return;
    const handle = () => setLockTooltip(null);
    window.addEventListener("click", handle);
    return () => window.removeEventListener("click", handle);
  }, [lockTooltip]);

  const handleTaskComplete = useCallback((taskId: string) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, done: true } : t)));
    setShowEffect(true);
    setTotalCompleted((prev) => {
      const next = prev + 1;
      saveTotalCompleted(next);
      const newBadge = BADGE_DEFS.find((b) => b.tasksRequired === next);
      if (newBadge) {
        setNewBadgeName(next);
        setShowBadge(true);
      }
      return next;
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

  const inProgressTask = tasks.find((t) => !t.done && t.subTasks.some((s) => s.done)) ?? null;
  const isNewUser = doneTasks === 0 && !inProgressTask;
  const firstTask = tasks[0] ?? null;

  const nextTask = tasks.find((t) => !t.done);
  const priorityTasks = tasks.filter((t) => !t.done);
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

  const LockPopup = () => {
    if (!lockTooltip) return null;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        onClick={() => setLockTooltip(null)}
      >
        <div
          className="rounded-2xl border p-6 max-w-sm w-full mx-4"
          style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--warning-light)" }}>
              <i className="ri-lock-2-line text-lg" style={{ color: "var(--warning)" }} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Task Locked</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Complete the previous task first</p>
            </div>
          </div>
          <div className="rounded-xl p-3 mb-4" style={{ backgroundColor: "var(--warning-light)", border: "1px solid var(--warning)" }}>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--warning)" }}>
              <i className="ri-arrow-right-s-line mr-0.5" />
              First complete Task {lockTooltip.prereqOrder}:
            </p>
            <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{lockTooltip.prereqTitle}</p>
          </div>
          <p className="text-xs mb-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Tasks must be completed in order to ensure you build the right foundation before moving forward.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                const prereqTask = tasks.find((t) => t.title === lockTooltip.prereqTitle);
                if (prereqTask) { setLockTooltip(null); setSelectedTask(prereqTask); }
              }}
              className="flex-1 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-all cursor-pointer whitespace-nowrap"
            >
              Go to Task {lockTooltip.prereqOrder}
            </button>
            <button
              type="button"
              onClick={() => setLockTooltip(null)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap"
              style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      <TaskCompleteEffect visible={showEffect} onDone={() => setShowEffect(false)} />
      <MilestoneBadge streak={newBadgeName} visible={showBadge} onDismiss={() => setShowBadge(false)} />
      <LockPopup />

      {selectedTask && (
        <TaskDetailScreen
          task={getUpdatedTask(selectedTask.id) ?? selectedTask}
          onSubTaskToggle={(subId) => handleSubTaskToggle(selectedTask.id, subId)}
          onTaskComplete={() => handleTaskComplete(selectedTask.id)}
          onClose={() => setSelectedTask(null)}
        />
      )}

      <div className="w-full min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
        {/* Header */}
        <div className="px-6 pt-8 pb-6" style={{ backgroundColor: "var(--bg-base)" }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7">
              <div>
                <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>My Assigned Tasks</h1>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>All tasks assigned by your mentor, organized by learning path.</p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>
                    <i className="ri-focus-3-line text-xs" />
                    Action Mode
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border" style={{ backgroundColor: "var(--accent-light)", color: "var(--accent-text)", borderColor: "var(--accent-light)" }}>
                    {mentor.photo ? (
                      <img src={mentor.photo} alt={mentor.name} className="w-4 h-4 rounded-full object-cover object-top shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-violet-200 text-violet-700 text-[9px] font-bold flex items-center justify-center shrink-0">{mentor.avatar}</span>
                    )}
                    {mentor.name} · {mentor.title}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                    <i className="ri-calendar-event-line text-xs" />
                    Session: Apr 14, 2026
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                    <i className="ri-task-line text-xs" />
                    {totalTasks} tasks assigned
                  </span>
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
                  <div key={ring.id} className="flex items-center gap-4 rounded-2xl p-4 border" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
                    <GoalRing label="" percentage={pct} color={ring.color} bgColor={ring.bg} size={68} darkColor={ring.darkColor} darkBgColor={ring.darkBg} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium mb-0.5" style={{ color: "var(--text-muted)" }}>{stepGroups[i].label}</p>
                      <p className="text-sm font-bold leading-snug" style={{ color: "var(--text-primary)" }}>{ring.label}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-elevated)" }}>
                          <div className={`h-full ${style.bar} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>{stepDone}/{stepTasks.length}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Overall Progress */}
              <div className="rounded-xl border p-4 flex flex-col gap-2" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 flex items-center justify-center rounded-lg" style={{ backgroundColor: "var(--accent-light)" }}>
                      <i className="ri-pie-chart-2-line text-xs" style={{ color: "var(--accent)" }} />
                    </div>
                    <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Overall Progress</p>
                  </div>
                  <span className="text-xs font-bold" style={{ color: "var(--accent)" }}>{overallPct}%</span>
                </div>
                <p className="text-2xl font-extrabold leading-none tracking-tight" style={{ color: "var(--text-primary)" }}>
                  {doneTasks}<span className="text-sm font-medium ml-1" style={{ color: "var(--text-muted)" }}>/ {totalTasks}</span>
                </p>
                <div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-elevated)" }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${overallPct}%`, backgroundColor: "var(--accent)" }} />
                  </div>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{totalTasks - doneTasks} tasks remaining</p>
                </div>
              </div>

              {/* Total Credits */}
              <div className="rounded-xl border p-4 flex flex-col gap-2" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 flex items-center justify-center rounded-lg" style={{ backgroundColor: "var(--success-light)" }}>
                      <i className="ri-copper-coin-line text-xs" style={{ color: "var(--success)" }} />
                    </div>
                    <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Total Credits</p>
                  </div>
                  <span className="text-xs font-bold" style={{ color: "var(--success)" }}>+{CREDITS_PER_TASK}/task</span>
                </div>
                <p className="text-2xl font-extrabold leading-none tracking-tight" style={{ color: "var(--text-primary)" }}>
                  {totalCredits}<span className="text-sm font-medium ml-1" style={{ color: "var(--text-muted)" }}>cr</span>
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {totalCompleted} tasks × {CREDITS_PER_TASK} = {totalCompleted * CREDITS_PER_TASK}
                  {earnedBadges.length > 0 && (
                    <span className="font-medium" style={{ color: "var(--success)" }}> + {totalCredits - totalCompleted * CREDITS_PER_TASK} bonus</span>
                  )}
                </p>
              </div>

              {/* Next Badge */}
              <div className="rounded-xl border p-4 flex flex-col gap-2" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 flex items-center justify-center rounded-lg" style={{ backgroundColor: "var(--accent-light)" }}>
                      <i className="ri-medal-line text-xs" style={{ color: "var(--accent)" }} />
                    </div>
                    <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Next Badge</p>
                  </div>
                  {nextBadge && <span className="text-xs font-bold" style={{ color: "var(--accent)" }}>{badgeProgressPct}%</span>}
                </div>
                {nextBadge ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <i className={`${nextBadge.icon} text-lg ${nextBadge.color}`} />
                      <p className="text-sm font-bold leading-none tracking-tight" style={{ color: "var(--text-primary)" }}>{nextBadge.name}</p>
                    </div>
                    <div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-elevated)" }}>
                        <div className="h-full bg-violet-500 rounded-full transition-all duration-700" style={{ width: `${badgeProgressPct}%` }} />
                      </div>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                        {nextBadge.tasksRequired - totalCompleted} more tasks · +{nextBadge.bonusCredits} bonus cr
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-extrabold leading-none tracking-tight" style={{ color: "var(--text-primary)" }}>All done!</p>
                    <p className="text-xs font-medium" style={{ color: "var(--success)" }}>All badges unlocked</p>
                  </>
                )}
              </div>

              {/* Current Badge */}
              <div className="rounded-xl border p-4 flex flex-col gap-2" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 flex items-center justify-center rounded-lg" style={{ backgroundColor: "var(--success-light)" }}>
                      <i className="ri-award-line text-xs" style={{ color: "var(--success)" }} />
                    </div>
                    <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Current Badge</p>
                  </div>
                </div>
                {latestBadge ? (() => {
                  const darkStyle = isDark ? (BADGE_DARK_STYLES[latestBadge.color] ?? { bg: "rgba(139,92,246,0.18)", border: "rgba(139,92,246,0.45)", color: "#C4B5FD" }) : null;
                  return (
                    <>
                      <div
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border w-fit ${!isDark ? `${latestBadge.bg} ${latestBadge.border}` : ""}`}
                        style={isDark && darkStyle ? { backgroundColor: darkStyle.bg, borderColor: darkStyle.border } : {}}
                      >
                        <i
                          className={`${latestBadge.icon} text-sm ${!isDark ? latestBadge.color : ""}`}
                          style={isDark && darkStyle ? { color: darkStyle.color } : {}}
                        />
                        <span
                          className={`text-sm font-bold ${!isDark ? latestBadge.color : ""}`}
                          style={isDark && darkStyle ? { color: darkStyle.color } : {}}
                        >
                          {latestBadge.name}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {earnedBadges.length} of {BADGE_DEFS.length} badges earned
                      </p>
                    </>
                  );
                })() : (
                  <>
                    <p className="text-2xl font-extrabold leading-none tracking-tight" style={{ color: "var(--text-muted)" }}>—</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Complete 1 task to earn your first badge</p>
                  </>
                )}
              </div>
            </div>

            {/* Credits explainer strip */}
            <div className="mt-3 flex items-center gap-3 px-4 py-2.5 rounded-xl border" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
              <i className="ri-information-line text-sm shrink-0" style={{ color: "var(--text-muted)" }} />
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>How credits work:</span> Complete any task → earn{" "}
                <span className="font-semibold" style={{ color: "var(--success)" }}>10 credits</span>. Hit a task milestone → unlock a badge → earn{" "}
                <span className="font-semibold" style={{ color: "var(--warning)" }}>bonus credits</span>. Redeem credits for perks.
              </p>
              <div className="ml-auto flex items-center gap-1.5 shrink-0 flex-wrap">
                {BADGE_DEFS.slice(0, 4).map((b) => {
                  const earned = totalCompleted >= b.tasksRequired;
                  const darkStyle = isDark && earned ? (BADGE_DARK_STYLES[b.color] ?? { bg: "rgba(139,92,246,0.18)", border: "rgba(139,92,246,0.45)", color: "#C4B5FD" }) : null;
                  return (
                    <span
                      key={b.id}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium transition-all ${
                        earned && !isDark ? `${b.bg} ${b.color} ${b.border}` : ""
                      }`}
                      style={
                        earned && isDark && darkStyle
                          ? { backgroundColor: darkStyle.bg, color: darkStyle.color, borderColor: darkStyle.border }
                          : !earned
                          ? { backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)", borderColor: "var(--border)" }
                          : {}
                      }
                    >
                      <i className={`${b.icon} text-xs`} />
                      {b.tasksRequired}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Sequential order info strip */}
            <div className="mt-2 flex items-center gap-3 px-4 py-2.5 rounded-xl border" style={{ backgroundColor: "var(--accent-light)", borderColor: "var(--accent-light)" }}>
              <i className="ri-route-line text-sm shrink-0" style={{ color: "var(--accent-text)" }} />
              <p className="text-xs" style={{ color: "var(--accent-text)" }}>
                <span className="font-semibold">Tasks must be completed in order.</span> Complete each task and mark it as done to unlock the next one.
              </p>
              <span className="ml-auto flex items-center gap-1 text-xs font-medium shrink-0 whitespace-nowrap" style={{ color: "var(--accent-text)" }}>
                <i className="ri-lock-2-line text-xs" />
                Sequential learning path
              </span>
            </div>
          </div>
        </div>

        {/* Sticky Tab Bar */}
        <div
          ref={tabBarRef}
          className={`sticky top-0 z-30 transition-all duration-200 ${isTabSticky ? "shadow-sm" : ""}`}
          style={{ backgroundColor: "var(--bg-base)" }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-0 border-b" style={{ borderColor: "var(--border)" }}>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap -mb-px ${
                    activeTab === tab.id
                      ? "border-violet-600 text-violet-500"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  style={activeTab !== tab.id ? { color: "var(--text-muted)" } : {}}
                >
                  <i className={`${tab.icon} text-sm`} />
                  {tab.label}
                </button>
              ))}
              {nextBadge && (
                <div className="ml-auto hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border my-2" style={{ backgroundColor: "var(--warning-light)", borderColor: "var(--warning)" }}>
                  <i className={`${nextBadge.icon} text-xs`} style={{ color: "var(--warning)" }} />
                  <span className="text-xs font-medium" style={{ color: "var(--warning)" }}>
                    {nextBadge.tasksRequired - totalCompleted} tasks to {nextBadge.name} (+{nextBadge.bonusCredits} cr)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6">

          {/* TAB: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 flex flex-col gap-5">

                {/* Welcome Banner */}
                {isNewUser && firstTask && (
                  <div className="rounded-2xl border p-5 relative overflow-hidden" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--accent-light)" }}>
                    {!isDark && (
                      <>
                        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-20 pointer-events-none"
                          style={{ background: "radial-gradient(circle, #c4b5fd 0%, transparent 70%)" }} />
                        <div className="absolute -bottom-4 -left-2 w-24 h-24 rounded-full opacity-15 pointer-events-none"
                          style={{ background: "radial-gradient(circle, #a5f3fc 0%, transparent 70%)" }} />
                      </>
                    )}
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--accent-light)" }}>
                          <i className="ri-sparkling-2-fill text-lg" style={{ color: "var(--accent)" }} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent-text)" }}>Your learning path is ready</p>
                          <p className="text-base font-semibold leading-snug mt-0.5 tracking-tight" style={{ color: "var(--text-primary)" }}>
                            Welcome! Your tasks are ready to go — start with Task 1 below.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl border mb-4" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--accent-light)" }}>
                          <i className={`${firstTask.resourceIcon} text-base`} style={{ color: "var(--accent)" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>Start here · Task 1 of {totalTasks}</p>
                          <p className="text-sm font-bold leading-snug truncate" style={{ color: "var(--text-primary)" }}>{firstTask.title}</p>
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap shrink-0" style={{ color: "var(--success)", backgroundColor: "var(--success-light)", border: "1px solid var(--success)" }}>
                          <i className="ri-copper-coin-line text-[10px]" />
                          +10 cr
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedTask(firstTask)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-all cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-play-fill text-sm" />
                        Start Task 1 - {firstTask.title}
                        <i className="ri-arrow-right-line text-sm" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Continue card */}
                {!isNewUser && inProgressTask && (
                  <div
                    className="rounded-2xl border p-4 cursor-pointer transition-all group"
                    style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}
                    onClick={() => setSelectedTask(inProgressTask)}
                  >
                    <p className="text-xs font-medium mb-3" style={{ color: "var(--text-muted)" }}>Continue where you left off</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--accent-light)" }}>
                        <i className={`${inProgressTask.resourceIcon} text-lg`} style={{ color: "var(--accent)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold leading-snug truncate" style={{ color: "var(--text-primary)" }}>{inProgressTask.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{inProgressTask.stepLabel} · {inProgressTask.stepTitle}</p>
                        {inProgressTask.subTasks.length > 0 && (() => {
                          const done = inProgressTask.subTasks.filter((s) => s.done).length;
                          const pct = Math.round((done / inProgressTask.subTasks.length) * 100);
                          return (
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex-1 h-1 rounded-full overflow-hidden max-w-[100px]" style={{ backgroundColor: "var(--bg-elevated)" }}>
                                <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{done}/{inProgressTask.subTasks.length} sub-tasks</span>
                            </div>
                          );
                        })()}
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap" style={{ color: "var(--success)", backgroundColor: "var(--success-light)", border: "1px solid var(--success)" }}>
                          <i className="ri-copper-coin-line text-xs" />
                          +{CREDITS_PER_TASK} cr
                        </span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setSelectedTask(inProgressTask); }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-xs font-semibold transition-all cursor-pointer whitespace-nowrap bg-violet-600 hover:bg-violet-700"
                        >
                          <i className="ri-play-fill text-xs" />
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Priority Task Cards */}
                {priorityTasks.length === 0 ? (
                  <div className="flex flex-col items-center py-10 gap-2 rounded-2xl border" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
                    <div className="w-12 h-12 flex items-center justify-center rounded-full" style={{ backgroundColor: "var(--success-light)" }}>
                      <i className="ri-check-double-line text-xl" style={{ color: "var(--success)" }} />
                    </div>
                    <p className="text-sm font-semibold" style={{ color: "var(--success)" }}>All tasks done - amazing work!</p>
                  </div>
                ) : (() => {
                  const stepOrder = Array.from(new Set(priorityTasks.map((t) => t.stepId)));
                  const activeStepId = stepOrder[0];
                  const nextStepId = stepOrder[1] ?? null;

                  return (
                    <div className="flex flex-col gap-6">
                      {stepOrder.map((stepId, stepIdx) => {
                        const stepTasks = priorityTasks.filter((t) => t.stepId === stepId);
                        const isActiveStep = stepId === activeStepId;
                        const isNextStep = stepId === nextStepId;
                        const visibleTasks = isActiveStep ? stepTasks : isNextStep ? stepTasks.slice(0, 1) : [];
                        if (visibleTasks.length === 0) return null;

                        const sampleTask = stepTasks[0];
                        const style = STEP_STYLE[sampleTask.color];
                        const allStepTasks = tasks.filter((t) => t.stepId === stepId);
                        const stepDone = allStepTasks.filter((t) => t.done).length;

                        return (
                          <div key={stepId}>
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`w-2 h-2 rounded-full ${style.dot} shrink-0`} />
                              <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{sampleTask.stepLabel}</span>
                              <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{sampleTask.stepTitle}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full border font-medium" style={{ backgroundColor: "var(--accent-light)", color: "var(--accent-text)", borderColor: "var(--accent-light)" }}>
                                {stepDone}/{allStepTasks.length} done
                              </span>
                              {!isActiveStep && (
                                <span className="ml-auto flex items-center gap-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                                  <i className="ri-lock-2-line text-[10px]" />
                                  Unlocks after Step {stepIdx}
                                </span>
                              )}
                              {isActiveStep && (
                                <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap" style={{ color: "var(--success)", backgroundColor: "var(--success-light)", border: "1px solid var(--success)" }}>
                                  <i className="ri-focus-3-line text-[10px]" />
                                  Active
                                </span>
                              )}
                            </div>

                            <div className="flex flex-col gap-3">
                              {visibleTasks.map((task) => {
                                const s = STEP_STYLE[task.color];
                                const subsDone = task.subTasks.filter((sub) => sub.done).length;
                                const subsPct = task.subTasks.length > 0 ? Math.round((subsDone / task.subTasks.length) * 100) : 0;
                                const locked = isTaskLocked(task.id);
                                const prereq = locked ? getPrerequisiteTask(task.id) : null;
                                const prereqIdx = prereq ? tasks.findIndex((t) => t.id === prereq.id) + 1 : 0;
                                const globalIdx = tasks.findIndex((t) => t.id === task.id) + 1;
                                return (
                                  <div
                                    key={task.id}
                                    className={`rounded-2xl border p-4 transition-all group relative ${
                                      locked || !isActiveStep ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                                    }`}
                                    style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}
                                    onClick={() => { if (!locked && isActiveStep) setSelectedTask(task); }}
                                  >
                                    {locked && (
                                      <div className="absolute inset-0 rounded-2xl z-10 flex items-start justify-end p-3 pointer-events-none" style={{ backgroundColor: "rgba(0,0,0,0.1)" }}>
                                        <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full" style={{ color: "var(--warning)", backgroundColor: "var(--warning-light)", border: "1px solid var(--warning)" }}>
                                          <i className="ri-lock-2-line text-[10px]" />
                                          Complete task {prereqIdx} first
                                        </span>
                                      </div>
                                    )}
                                    {!isActiveStep && !locked && (
                                      <div className="absolute inset-0 rounded-2xl z-10 flex items-center justify-center pointer-events-none" style={{ backgroundColor: "rgba(0,0,0,0.15)" }}>
                                        <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ color: "var(--text-secondary)", backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                                          <i className="ri-lock-2-line text-xs" />
                                          Finish Step {stepIdx} to unlock
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex items-stretch gap-3">
                                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "var(--accent-light)" }}>
                                        <i className={`${task.resourceIcon} text-base`} style={{ color: "var(--accent)" }} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                          <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>Task {globalIdx}</span>
                                        </div>
                                        <p className="text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>{task.title}</p>
                                        <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "var(--text-muted)" }}>{task.description}</p>
                                        {task.subTasks.length > 0 && isActiveStep && (
                                          <div className="flex items-center gap-2 mt-2">
                                            <div className="flex-1 h-1 rounded-full overflow-hidden max-w-[120px]" style={{ backgroundColor: "var(--bg-elevated)" }}>
                                              <div className={`h-full ${s.bar} rounded-full transition-all duration-500`} style={{ width: `${subsPct}%` }} />
                                            </div>
                                            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{subsDone}/{task.subTasks.length} sub-tasks</span>
                                          </div>
                                        )}
                                      </div>
                                      <div className="shrink-0 flex flex-col items-end justify-between self-stretch">
                                        <span className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap shrink-0" style={{ color: "var(--success)", backgroundColor: "var(--success-light)", border: "1px solid var(--success)" }}>
                                          <i className="ri-copper-coin-line text-[10px]" />
                                          +{CREDITS_PER_TASK} cr
                                        </span>
                                        {locked ? (
                                          <button
                                            type="button"
                                            onClick={(e) => handleLockedClick(e, task.id)}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap"
                                            style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}
                                          >
                                            <i className="ri-lock-2-line text-[10px]" />
                                            Locked
                                          </button>
                                        ) : isActiveStep ? (
                                          <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setSelectedTask(task); }}
                                            className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${s.btn}`}
                                          >
                                            {subsDone > 0 ? "Continue" : "Start"}
                                          </button>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                              {!isActiveStep && stepTasks.length > 1 && (
                                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}>
                                  <i className="ri-more-line text-sm" style={{ color: "var(--text-muted)" }} />
                                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                                    +{stepTasks.length - 1} more task{stepTasks.length - 1 !== 1 ? "s" : ""} in this step
                                  </span>
                                  <button type="button" onClick={() => setActiveTab("tasks")} className="ml-auto text-xs text-violet-500 font-semibold hover:text-violet-400 cursor-pointer whitespace-nowrap">
                                    See all →
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-5">
                {/* Recent Progress */}
                <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <i className="ri-history-line text-base" style={{ color: "var(--success)" }} />
                    <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Recent Progress</h2>
                  </div>
                  {recentDone.length === 0 ? (
                    <div className="flex flex-col items-center py-6 gap-2 text-center">
                      <i className="ri-checkbox-blank-circle-line text-3xl" style={{ color: "var(--border)" }} />
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>Complete your first task to see progress here.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {recentDone.map((task) => (
                        <div key={task.id} className="flex items-start gap-2.5">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "var(--success-light)" }}>
                            <i className="ri-check-line text-xs" style={{ color: "var(--success)" }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs leading-snug font-medium" style={{ color: "var(--text-secondary)" }}>{task.title}</p>
                            <p className="text-xs font-medium mt-0.5 text-violet-500">{task.stepLabel}</p>
                          </div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap shrink-0" style={{ color: "var(--success)", backgroundColor: "var(--success-light)", border: "1px solid var(--success)" }}>
                            +{CREDITS_PER_TASK}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {doneTasks > 0 && (
                    <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>Overall completion</span>
                        <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{overallPct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-elevated)" }}>
                        <div className="h-full bg-violet-500 rounded-full transition-all duration-700" style={{ width: `${overallPct}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <i className="ri-flashlight-line text-base" style={{ color: "var(--warning)" }} />
                    <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Quick Actions</h2>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button type="button" onClick={() => navigate("/tutor")} className="flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-left" style={{ backgroundColor: "var(--accent-light)" }}>
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-violet-600 shrink-0">
                        <i className="ri-sparkling-2-fill text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: "var(--accent-text)" }}>Ask AI Tutor</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Get instant help</p>
                      </div>
                      <i className="ri-arrow-right-s-line ml-auto" style={{ color: "var(--accent-text)" }} />
                    </button>
                    <button type="button" onClick={() => navigate("/resources")} className="flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-left" style={{ backgroundColor: "var(--bg-elevated)" }}>
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-violet-600 shrink-0">
                        <i className="ri-archive-drawer-fill text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Resource Vault</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Links &amp; docs</p>
                      </div>
                      <i className="ri-arrow-right-s-line ml-auto" style={{ color: "var(--text-muted)" }} />
                    </button>
                    <button type="button" onClick={() => navigate("/session-dashboard")} className="flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-left" style={{ backgroundColor: "var(--bg-elevated)" }}>
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-violet-600 shrink-0">
                        <i className="ri-calendar-event-fill text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Next Session</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Apr 14 · 10:00 AM</p>
                      </div>
                      <i className="ri-arrow-right-s-line ml-auto" style={{ color: "var(--text-muted)" }} />
                    </button>
                  </div>
                </div>

                {/* Earned Badges */}
                {earnedBadges.length > 0 && (
                  <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <i className="ri-award-line text-base" style={{ color: "var(--warning)" }} />
                      <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Badges Earned</h2>
                      <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>{earnedBadges.length}/{BADGE_DEFS.length}</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {earnedBadges.map((badge) => {
                        const darkStyle = isDark ? (BADGE_DARK_STYLES[badge.color] ?? { bg: "rgba(139,92,246,0.18)", border: "rgba(139,92,246,0.45)", color: "#C4B5FD" }) : null;
                        return (
                          <span
                            key={badge.id}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium ${!isDark ? `${badge.bg} ${badge.color} ${badge.border}` : ""}`}
                            style={isDark && darkStyle ? { backgroundColor: darkStyle.bg, color: darkStyle.color, borderColor: darkStyle.border } : {}}
                          >
                            <i className={`${badge.icon} text-sm`} />
                            {badge.name}
                            <span className="ml-auto text-[10px] opacity-60">{badge.tasksRequired} tasks · +{badge.bonusCredits} cr</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Achievements teaser */}
                <div
                  className="relative rounded-2xl overflow-hidden cursor-pointer group border"
                  style={{ background: "linear-gradient(135deg, var(--accent-light) 0%, var(--bg-elevated) 100%)", borderColor: "var(--accent-light)" }}
                  onClick={() => navigate("/achievements")}
                >
                  <div className="relative z-10 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center rounded-xl" style={{ backgroundColor: "var(--accent-light)" }}>
                          <i className="ri-trophy-fill text-base" style={{ color: "var(--accent)" }} />
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-tight" style={{ color: "var(--accent-text)" }}>Rewards &amp; Badges</p>
                          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Complete tasks → earn credits → unlock badges</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ color: "var(--success)", backgroundColor: "var(--success-light)", border: "1px solid var(--success)" }}>
                        Active
                      </span>
                    </div>

                    <div className="rounded-xl px-3 py-2.5 mb-3" style={{ backgroundColor: "var(--bg-surface)" }}>
                      <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: "var(--accent-text)" }}>Credits Balance</p>
                      <div className="flex items-end gap-1.5 mb-1">
                        <span className="text-3xl font-extrabold leading-none tracking-tight" style={{ color: "var(--text-primary)" }}>{totalCredits}</span>
                        <span className="text-xs pb-0.5" style={{ color: "var(--text-muted)" }}>credits</span>
                      </div>
                    </div>

                    {nextBadge && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Next: {nextBadge.name} ({nextBadge.tasksRequired} tasks)</span>
                          <span className="text-[10px] font-bold" style={{ color: "var(--accent-text)" }}>{badgeProgressPct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-elevated)" }}>
                          <div className="h-full rounded-full" style={{ width: `${badgeProgressPct}%`, background: "linear-gradient(90deg, #7c3aed, #10b981)" }} />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>View badges, history &amp; redeem</span>
                      <div className="flex items-center gap-1 text-xs font-bold group-hover:gap-2 transition-all" style={{ color: "var(--accent-text)" }}>
                        Open
                        <i className="ri-arrow-right-s-line text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ALL TASKS */}
          {activeTab === "tasks" && (
            <div className="flex flex-col gap-8">
              {tasks.length === 0 && (
                <div className="flex flex-col items-center py-20 gap-4 rounded-2xl border" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
                  <div className="w-16 h-16 flex items-center justify-center rounded-full" style={{ backgroundColor: "var(--bg-elevated)" }}>
                    <i className="ri-task-line text-3xl" style={{ color: "var(--text-muted)" }} />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>No tasks assigned yet</p>
                    <p className="text-sm max-w-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      Your mentor <span className="font-medium" style={{ color: "var(--text-secondary)" }}>{mentor.name}</span> hasn&apos;t assigned any tasks yet.
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
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${style.dot} shrink-0`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{group.label}</span>
                          <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{group.title}</h2>
                          <span className="text-xs px-2 py-0.5 rounded-full border font-medium" style={{ backgroundColor: "var(--accent-light)", color: "var(--accent-text)", borderColor: "var(--accent-light)" }}>{groupDone}/{groupTasks.length} done</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-20 h-1.5 rounded-full overflow-hidden hidden sm:block" style={{ backgroundColor: "var(--bg-elevated)" }}>
                          <div className={`h-full ${style.bar} rounded-full transition-all duration-700`} style={{ width: `${groupPct}%` }} />
                        </div>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{groupPct}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupTasks.map((task) => {
                        const s = STEP_STYLE[task.color];
                        const subsDone = task.subTasks.filter((sub) => sub.done).length;
                        const subsPct = task.subTasks.length > 0 ? Math.round((subsDone / task.subTasks.length) * 100) : 0;
                        const locked = isTaskLocked(task.id);
                        const prereq = locked ? getPrerequisiteTask(task.id) : null;
                        const prereqIdx = prereq ? tasks.findIndex((t) => t.id === prereq.id) + 1 : 0;

                        return (
                          <div
                            key={task.id}
                            className={`rounded-2xl border p-5 flex flex-col gap-3 transition-all group relative ${
                              task.done ? "opacity-70 cursor-pointer" : locked ? "opacity-55 cursor-not-allowed" : "cursor-pointer"
                            }`}
                            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}
                            onClick={() => { if (!locked && !task.done) setSelectedTask(task); else if (task.done) setSelectedTask(task); }}
                          >
                            {locked && (
                              <div className="absolute top-3 right-3 z-10">
                                <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap" style={{ color: "var(--warning)", backgroundColor: "var(--warning-light)", border: "1px solid var(--warning)" }}>
                                  <i className="ri-lock-2-line text-[10px]" />
                                  Locked
                                </span>
                              </div>
                            )}

                            <div className="flex items-start justify-between gap-2">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--accent-light)" }}>
                                <i className={`${task.resourceIcon} text-lg`} style={{ color: "var(--accent)" }} />
                              </div>
                              {task.done ? (
                                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                                  <i className="ri-check-line text-white text-xs" />
                                </div>
                              ) : !locked ? (
                                <span className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap shrink-0" style={{ color: "var(--success)", backgroundColor: "var(--success-light)", border: "1px solid var(--success)" }}>
                                  <i className="ri-copper-coin-line text-[10px]" />
                                  +{CREDITS_PER_TASK} cr
                                </span>
                              ) : null}
                            </div>

                            <div className="flex-1">
                              <h3 className={`text-sm font-bold leading-snug mb-1 ${task.done ? "line-through" : ""}`} style={{ color: task.done || locked ? "var(--text-muted)" : "var(--text-primary)" }}>
                                {task.title}
                              </h3>
                              <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>{task.description}</p>
                            </div>

                            {locked && prereq && (
                              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ backgroundColor: "var(--warning-light)", border: "1px solid var(--warning)" }}>
                                <i className="ri-arrow-right-up-line text-xs shrink-0" style={{ color: "var(--warning)" }} />
                                <p className="text-xs" style={{ color: "var(--warning)" }}>
                                  Complete <span className="font-semibold">Task {prereqIdx}: {prereq.title}</span> first
                                </p>
                              </div>
                            )}

                            {!task.done && !locked && task.subTasks.length > 0 && (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Progress</span>
                                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{subsDone}/{task.subTasks.length}</span>
                                </div>
                                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-elevated)" }}>
                                  <div className={`h-full ${s.bar} rounded-full transition-all duration-500`} style={{ width: `${subsPct}%` }} />
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-1" style={{ borderTop: "1px solid var(--border)" }}>
                              <div className="flex items-center gap-1.5">
                                <i className="ri-links-line text-xs" style={{ color: "var(--text-muted)" }} />
                                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{task.resources.length} resource{task.resources.length !== 1 ? "s" : ""}</span>
                              </div>
                              {task.done ? (
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setSelectedTask(task); }}
                                  className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold cursor-pointer whitespace-nowrap"
                                  style={{ backgroundColor: "var(--text-muted)" }}
                                >
                                  Review
                                </button>
                              ) : locked ? (
                                <button
                                  type="button"
                                  onClick={(e) => handleLockedClick(e, task.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap"
                                  style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}
                                >
                                  <i className="ri-lock-2-line text-[10px]" />
                                  Start
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setSelectedTask(task); }}
                                  className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${s.btn}`}
                                >
                                  {subsDone > 0 ? "Continue" : "Start"}
                                </button>
                              )}
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
