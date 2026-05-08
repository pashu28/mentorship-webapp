// ── How it works ───────────────────────────────────────────────────────────
// 1. Complete a task → earn CREDITS_PER_TASK credits instantly
// 2. Badges unlock when total tasks completed reaches a threshold
// 3. Unlocking a badge awards bonus credits on top
// No separate "points" concept — credits is the only currency.

export const CREDITS_PER_TASK = 10;

// ── Badge definitions ──────────────────────────────────────────────────────

export interface BadgeDef {
  id: string;
  name: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  glow: string;
  description: string;
  tasksRequired: number;  // total tasks completed needed to unlock
  bonusCredits: number;   // bonus credits awarded when badge unlocks
}

export const BADGE_DEFS: BadgeDef[] = [
  {
    id: "first-step",
    name: "First Step",
    icon: "ri-footprint-fill",
    color: "text-violet-500",
    bg: "bg-violet-50",
    border: "border-violet-200",
    glow: "from-violet-50 to-violet-100",
    description: "Complete your very first task.",
    tasksRequired: 1,
    bonusCredits: 10,
  },
  {
    id: "rising-star",
    name: "Rising Star",
    icon: "ri-star-fill",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    glow: "from-violet-50 to-violet-100",
    description: "Complete 5 tasks total.",
    tasksRequired: 5,
    bonusCredits: 20,
  },
  {
    id: "task-veteran",
    name: "Task Veteran",
    icon: "ri-shield-star-fill",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    glow: "from-violet-50 to-violet-100",
    description: "Complete 10 tasks total.",
    tasksRequired: 10,
    bonusCredits: 30,
  },
  {
    id: "gold-achiever",
    name: "Gold Achiever",
    icon: "ri-medal-fill",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    glow: "from-emerald-50 to-emerald-100",
    description: "Complete 25 tasks total.",
    tasksRequired: 25,
    bonusCredits: 60,
  },
  {
    id: "champion",
    name: "Champion",
    icon: "ri-trophy-fill",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    glow: "from-emerald-50 to-emerald-100",
    description: "Complete 50 tasks total.",
    tasksRequired: 50,
    bonusCredits: 100,
  },
  {
    id: "centurion",
    name: "Centurion",
    icon: "ri-vip-crown-fill",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    glow: "from-emerald-50 to-emerald-100",
    description: "Complete 100 tasks total.",
    tasksRequired: 100,
    bonusCredits: 200,
  },
];

// ── Completed task history ─────────────────────────────────────────────────

export interface CompletedTaskEntry {
  id: string;
  taskId: string;
  taskTitle: string;
  stepLabel: string;
  creditsEarned: number; // always CREDITS_PER_TASK
  completedAt: string;
}

export const completedTaskHistory: CompletedTaskEntry[] = [];

// ── Earned badge history ───────────────────────────────────────────────────

export interface EarnedBadge {
  id: string;
  badgeId: string;
  dateEarned: string;
  tasksAtTime: number;    // total tasks completed when badge unlocked
  bonusCreditsAwarded: number;
}

export const earnedBadgeHistory: EarnedBadge[] = [];

// ── Credits ledger ─────────────────────────────────────────────────────────
// Two sources of credits:
//   "task"  — 10 credits per completed task
//   "badge" — bonus credits when a badge is unlocked

export interface CreditEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "task" | "badge" | "redeemed";
  badgeId?: string;
}

export const creditsLedger: CreditEntry[] = [];

// ── Redemption options ─────────────────────────────────────────────────────

export interface RedemptionOption {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: string;
  iconBg: string;
  iconColor: string;
  tag: string;
}

export const redemptionOptions: RedemptionOption[] = [
  {
    id: "r1",
    title: "Free Bonus Session",
    description: "Redeem for 1 extra 30-min session with your mentor, on us.",
    cost: 200,
    icon: "ri-video-chat-line",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    tag: "Most Popular",
  },
  {
    id: "r2",
    title: "10% Off Next Month",
    description: "Get 10% discount applied to your next subscription renewal.",
    cost: 150,
    icon: "ri-coupon-3-line",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    tag: "Best Value",
  },
  {
    id: "r3",
    title: "Unlock Premium Resources",
    description: "Access the premium resource vault for 30 days.",
    cost: 100,
    icon: "ri-archive-drawer-line",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    tag: "Quick Reward",
  },
  {
    id: "r4",
    title: "Priority Matching",
    description: "Jump to the front of the queue for mentor matching.",
    cost: 80,
    icon: "ri-user-star-line",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    tag: "",
  },
];

// ── Summary stats ──────────────────────────────────────────────────────────
// Starts at zero — all values are earned by the mentee in real-time.

export const achievementStats = {
  totalTasksCompleted: 0,
  creditsFromTasks: 0,
  creditsFromBadges: 0,
  totalCreditsEarned: 0,
  totalCreditsRedeemed: 0,
  totalBadgesEarned: 0,
  nextBadge: "first-step",
  tasksToNextBadge: 1,
};