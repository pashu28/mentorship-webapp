import { useState, useEffect, useCallback } from "react";
import {
  BADGE_DEFS,
  CREDITS_PER_TASK,
  type BadgeDef,
  type CompletedTaskEntry,
  type EarnedBadge,
  type CreditEntry,
} from "@/mocks/achievements";

const TASKS_STORAGE_KEY = "task_dashboard_tasks";
const COMPLETION_HISTORY_KEY = "task_completion_history";

interface StoredTask {
  id: string;
  title: string;
  stepLabel: string;
  done: boolean;
}

function loadTaskData(): { totalCompleted: number; titles: Record<string, string>; steps: Record<string, string> } {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredTask[];
      const titles: Record<string, string> = {};
      const steps: Record<string, string> = {};
      let count = 0;
      parsed.forEach((t) => {
        titles[t.id] = t.title;
        steps[t.id] = t.stepLabel;
        if (t.done) count++;
      });
      return { totalCompleted: count, titles, steps };
    }
  } catch (_) { /* ignore */ }
  return { totalCompleted: 0, titles: {}, steps: {} };
}

function loadCompletionHistory(): CompletedTaskEntry[] {
  try {
    const raw = localStorage.getItem(COMPLETION_HISTORY_KEY);
    if (raw) return JSON.parse(raw) as CompletedTaskEntry[];
  } catch (_) { /* ignore */ }
  return [];
}

function getCurrentDate(): string {
  const now = new Date();
  return now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export interface LiveAchievementStats {
  totalTasksCompleted: number;
  creditsFromTasks: number;
  creditsFromBadges: number;
  totalCreditsEarned: number;
  totalCreditsRedeemed: number;
  totalBadgesEarned: number;
  nextBadge: string;
  tasksToNextBadge: number;
  balance: number;
  earnedBadgeDefs: BadgeDef[];
  nextBadgeDef: BadgeDef | null;
  latestBadgeDef: BadgeDef | null;
  liveCompletedTasks: CompletedTaskEntry[];
  liveEarnedBadges: EarnedBadge[];
  liveLedger: CreditEntry[];
}

function computeStats(
  totalCompleted: number,
  titles: Record<string, string>,
  steps: Record<string, string>,
  history: CompletedTaskEntry[],
): LiveAchievementStats {
  const earnedBadgeDefs = BADGE_DEFS.filter((b) => totalCompleted >= b.tasksRequired);
  const nextBadgeDef = BADGE_DEFS.find((b) => totalCompleted < b.tasksRequired) ?? null;
  const latestBadgeDef = [...BADGE_DEFS].reverse().find((b) => totalCompleted >= b.tasksRequired) ?? null;

  const creditsFromTasks = totalCompleted * CREDITS_PER_TASK;
  const creditsFromBadges = earnedBadgeDefs.reduce((sum, b) => sum + b.bonusCredits, 0);
  const totalCreditsEarned = creditsFromTasks + creditsFromBadges;
  const totalCreditsRedeemed = 0;
  const balance = totalCreditsEarned - totalCreditsRedeemed;

  // Build live completed task list from history, or generate from current task data
  const liveCompletedTasks: CompletedTaskEntry[] = history.length > 0
    ? history.slice(0, totalCompleted)
    : totalCompleted > 0
    ? Array.from({ length: totalCompleted }, (_, i) => {
        const entry = history[i];
        if (entry) return entry;
        return {
          id: `live-ct${i + 1}`,
          taskId: `t${i + 1}`,
          taskTitle: `Task ${i + 1}`,
          stepLabel: "Step 1",
          creditsEarned: CREDITS_PER_TASK,
          completedAt: getCurrentDate(),
        };
      })
    : [];

  // Build live earned badges
  const liveEarnedBadges: EarnedBadge[] = earnedBadgeDefs.map((badge) => {
    const existing = history.length >= badge.tasksRequired;
    return {
      id: `live-eb-${badge.id}`,
      badgeId: badge.id,
      dateEarned: existing && history[badge.tasksRequired - 1]
        ? history[badge.tasksRequired - 1].completedAt
        : getCurrentDate(),
      tasksAtTime: badge.tasksRequired,
      bonusCreditsAwarded: badge.bonusCredits,
    };
  });

  // Build live ledger — task entries + badge entries
  const liveLedger: CreditEntry[] = [];
  liveCompletedTasks.forEach((task, i) => {
    liveLedger.push({
      id: `live-task-${i}`,
      date: task.completedAt,
      description: `Task completed: ${task.taskTitle}`,
      amount: CREDITS_PER_TASK,
      type: "task",
    });
    // Check if a badge was earned at this task count
    const badgeAtThisTask = BADGE_DEFS.find((b) => b.tasksRequired === i + 1);
    if (badgeAtThisTask && totalCompleted >= badgeAtThisTask.tasksRequired) {
      liveLedger.push({
        id: `live-badge-${badgeAtThisTask.id}`,
        date: task.completedAt,
        description: `Badge unlocked: ${badgeAtThisTask.name} — bonus credits`,
        amount: badgeAtThisTask.bonusCredits,
        type: "badge",
        badgeId: badgeAtThisTask.id,
      });
    }
  });

  return {
    totalTasksCompleted: totalCompleted,
    creditsFromTasks,
    creditsFromBadges,
    totalCreditsEarned,
    totalCreditsRedeemed,
    totalBadgesEarned: earnedBadgeDefs.length,
    nextBadge: nextBadgeDef?.id ?? "",
    tasksToNextBadge: nextBadgeDef ? nextBadgeDef.tasksRequired - totalCompleted : 0,
    balance,
    earnedBadgeDefs,
    nextBadgeDef,
    latestBadgeDef,
    liveCompletedTasks,
    liveEarnedBadges,
    liveLedger: liveLedger.length > 0 ? liveLedger : [],
  };
}

export function useAchievements() {
  const loadData = useCallback(() => {
    const { totalCompleted, titles, steps } = loadTaskData();
    const history = loadCompletionHistory();
    return computeStats(totalCompleted, titles, steps, history);
  }, []);

  const [stats, setStats] = useState<LiveAchievementStats>(loadData);

  // Re-sync whenever tasks change in localStorage (cross-tab + same-tab)
  const sync = useCallback(() => {
    setStats(loadData());
  }, [loadData]);

  useEffect(() => {
    sync();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === TASKS_STORAGE_KEY || e.key === COMPLETION_HISTORY_KEY) {
        sync();
      }
    };
    const handleCustom = () => sync();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("taskCompleted", handleCustom);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("taskCompleted", handleCustom);
      window.removeEventListener("focus", sync);
    };
  }, [sync]);

  return stats;
}