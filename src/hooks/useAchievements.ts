import { useState, useEffect, useCallback } from "react";
import {
  BADGE_DEFS,
  CREDITS_PER_TASK,
  completedTaskHistory,
  earnedBadgeHistory,
  creditsLedger,
  type BadgeDef,
  type CompletedTaskEntry,
  type EarnedBadge,
  type CreditEntry,
} from "@/mocks/achievements";

const STORAGE_KEY = "task_total_completed";

function loadTotalCompleted(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return parseInt(raw, 10) || 0;
  } catch (_) { /* ignore */ }
  return 0;
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

function computeStats(totalCompleted: number): LiveAchievementStats {
  const earnedBadgeDefs = BADGE_DEFS.filter((b) => totalCompleted >= b.tasksRequired);
  const nextBadgeDef = BADGE_DEFS.find((b) => totalCompleted < b.tasksRequired) ?? null;
  const latestBadgeDef = [...BADGE_DEFS].reverse().find((b) => totalCompleted >= b.tasksRequired) ?? null;

  const creditsFromTasks = totalCompleted * CREDITS_PER_TASK;
  const creditsFromBadges = earnedBadgeDefs.reduce((sum, b) => sum + b.bonusCredits, 0);
  const totalCreditsEarned = creditsFromTasks + creditsFromBadges;
  const totalCreditsRedeemed = 0;
  const balance = totalCreditsEarned - totalCreditsRedeemed;

  // Build live completed task list — use mock history as base, extend if user completed more
  const baseTasks = completedTaskHistory.slice(0, totalCompleted);
  const liveCompletedTasks: CompletedTaskEntry[] = baseTasks.length > 0
    ? baseTasks
    : totalCompleted > 0
    ? Array.from({ length: totalCompleted }, (_, i) => ({
        id: `live-ct${i + 1}`,
        taskId: `t${i + 1}`,
        taskTitle: `Task ${i + 1}`,
        stepLabel: "Step 1",
        creditsEarned: CREDITS_PER_TASK,
        completedAt: "Apr 17, 2026",
      }))
    : [];

  // Build live earned badges
  const liveEarnedBadges: EarnedBadge[] = earnedBadgeDefs.map((badge) => {
    const existing = earnedBadgeHistory.find((e) => e.badgeId === badge.id);
    return existing ?? {
      id: `live-eb-${badge.id}`,
      badgeId: badge.id,
      dateEarned: "Apr 17, 2026",
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

  // Use existing ledger if no tasks completed yet
  const finalLedger = totalCompleted > 0 ? liveLedger : creditsLedger;

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
    liveLedger: finalLedger,
  };
}

export function useAchievements() {
  const [totalCompleted, setTotalCompleted] = useState<number>(loadTotalCompleted);

  // Re-sync whenever the tab becomes visible (user navigated from task-dashboard)
  const sync = useCallback(() => {
    setTotalCompleted(loadTotalCompleted());
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [sync]);

  const stats = computeStats(totalCompleted);
  return stats;
}
