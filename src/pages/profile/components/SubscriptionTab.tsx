import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BADGE_DEFS, CREDITS_PER_TASK, achievementStats } from "@/mocks/achievements";

// ── Credits helpers ────────────────────────────────────────────────────────
function loadTotalCompleted(): number {
  try {
    const raw = localStorage.getItem("task_total_completed");
    if (raw) return parseInt(raw, 10) || 0;
  } catch (_) { /* ignore */ }
  return achievementStats.totalTasksCompleted;
}

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

// ── Redemption options (tied to subscription) ─────────────────────────────
const REDEMPTIONS = [
  {
    id: "bonus-session",
    title: "Free Bonus Session",
    description: "1 extra 30-min mentor session, on us",
    cost: 200,
    icon: "ri-video-chat-line",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    tag: "Most Popular",
    tagColor: "bg-violet-100 text-violet-700 border-violet-200",
  },
  {
    id: "discount-10",
    title: "10% Off Next Month",
    description: "Applied to your next subscription renewal",
    cost: 150,
    icon: "ri-coupon-3-line",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    tag: "Best Value",
    tagColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    id: "premium-resources",
    title: "Unlock Premium Resources",
    description: "Access the premium resource vault for 30 days",
    cost: 100,
    icon: "ri-archive-drawer-line",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    tag: "Quick Reward",
    tagColor: "bg-violet-100 text-violet-700 border-violet-200",
  },
  {
    id: "priority-match",
    title: "Priority Mentor Matching",
    description: "Jump to the front of the matching queue",
    cost: 80,
    icon: "ri-user-star-line",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    tag: "",
    tagColor: "",
  },
];

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "Get started with the basics",
    features: [
      "Up to 2 mentor sessions/month",
      "AI Tutor (10 queries/day)",
      "Basic task tracking",
      "Resource Vault (limited)",
      "Earn credits on every task",
    ],
    cta: "Current Plan",
    current: true,
    highlight: false,
    accentColor: "text-gray-500",
    accentBg: "bg-gray-100",
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    period: "per month",
    description: "For serious learners",
    features: [
      "Unlimited mentor sessions",
      "AI Tutor (unlimited)",
      "Advanced task & goal tracking",
      "Full Resource Vault access",
      "Priority mentor matching",
      "Session recordings",
      "2× credits on every task",
    ],
    cta: "Upgrade to Pro",
    current: false,
    highlight: true,
    accentColor: "text-violet-600",
    accentBg: "bg-violet-50",
  },
  {
    id: "team",
    name: "Team",
    price: 49,
    period: "per month",
    description: "For cohorts and organizations",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Team progress dashboard",
      "Dedicated account manager",
      "Custom mentor matching",
      "3× credits on every task",
    ],
    cta: "Contact Sales",
    current: false,
    highlight: false,
    accentColor: "text-violet-600",
    accentBg: "bg-violet-50",
  },
];

export default function SubscriptionTab() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [redeemedIds, setRedeemedIds] = useState<string[]>([]);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");

  const totalCompleted = loadTotalCompleted();
  const totalCredits = calcCredits(totalCompleted);
  const earnedBadges = getEarnedBadges(totalCompleted);
  const nextBadge = getNextBadge(totalCompleted);
  const spentCredits = redeemedIds.reduce((sum, id) => {
    const r = REDEMPTIONS.find((x) => x.id === id);
    return sum + (r?.cost ?? 0);
  }, 0);
  const availableCredits = totalCredits - spentCredits;

  const latestBadge = earnedBadges[earnedBadges.length - 1] ?? null;
  const nextBadgeThreshold = nextBadge?.tasksRequired ?? (latestBadge?.tasksRequired ?? 1);
  const prevBadgeThreshold = latestBadge?.tasksRequired ?? 0;
  const badgeProgressPct = nextBadge
    ? Math.min(Math.round(((totalCompleted - prevBadgeThreshold) / (nextBadgeThreshold - prevBadgeThreshold)) * 100), 100)
    : 100;

  function handleRedeem(id: string) {
    const item = REDEMPTIONS.find((r) => r.id === id);
    if (!item || availableCredits < item.cost) return;
    setRedeemedIds((prev) => [...prev, id]);
    setConfirmId(id);
    setTimeout(() => setConfirmId(null), 3000);
  }

  return (
    <div className="space-y-5">

      {/* ── Credits Summary Bar ─────────────────────────────────────────── */}
      <div className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-gray-100 bg-white">
        {/* Balance */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-violet-50 border border-violet-100">
            <i className="ri-copper-coin-fill text-violet-500 text-base" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Credits</p>
            <p className="text-xl font-black text-gray-900 leading-none">{availableCredits}</p>
          </div>
        </div>

        <div className="w-px h-10 bg-gray-100 shrink-0" />

        {/* Current badge */}
        <div className="flex items-center gap-2 shrink-0">
          {latestBadge ? (
            <>
              <div className={`w-7 h-7 flex items-center justify-center rounded-lg ${latestBadge.bg} border ${latestBadge.border} shrink-0`}>
                <i className={`${latestBadge.icon} text-xs ${latestBadge.color}`} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Badge</p>
                <p className="text-xs font-bold text-gray-800">{latestBadge.name}</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 border border-gray-200 shrink-0">
                <i className="ri-medal-line text-gray-400 text-xs" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Badge</p>
                <p className="text-xs font-bold text-gray-500">None yet</p>
              </div>
            </>
          )}
        </div>

        <div className="w-px h-10 bg-gray-100 shrink-0" />

        {/* Next badge progress */}
        {nextBadge ? (
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] text-gray-400">
                Next: <span className="font-semibold text-gray-700">{nextBadge.name}</span>
                <span className="text-emerald-600 font-semibold ml-1">+{nextBadge.bonusCredits} cr</span>
              </p>
              <p className="text-[10px] font-bold text-gray-500">{nextBadge.tasksRequired - totalCompleted} tasks away</p>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 bg-violet-500"
                style={{ width: `${badgeProgressPct}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-emerald-600">All badges earned!</p>
            <p className="text-[10px] text-gray-400">{earnedBadges.length} of {BADGE_DEFS.length} milestones complete</p>
          </div>
        )}

        {/* Link to achievements */}
        <button
          type="button"
          onClick={() => navigate("/achievements")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <i className="ri-trophy-line text-xs" />
          Achievements
        </button>
      </div>

      {/* ── Redeem Credits ──────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <i className="ri-gift-2-line text-violet-500 text-base" />
            <h3 className="text-sm font-semibold text-gray-900">Redeem Credits</h3>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-xs font-bold text-violet-700">
            <i className="ri-copper-coin-fill text-violet-500 text-xs" />
            {availableCredits} available
          </span>
        </div>

        {/* Confirm toast */}
        {confirmId && (
          <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
            <i className="ri-check-double-line text-emerald-500 text-sm" />
            Redeemed! Your perk has been applied to your account.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REDEMPTIONS.map((item) => {
            const alreadyRedeemed = redeemedIds.includes(item.id);
            const canAfford = availableCredits >= item.cost;
            return (
              <div
                key={item.id}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                  alreadyRedeemed
                    ? "bg-emerald-50 border-emerald-200"
                    : canAfford
                    ? "bg-white border-gray-100 hover:border-gray-200"
                    : "bg-gray-50 border-gray-100 opacity-60"
                }`}
              >
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${item.iconBg} shrink-0`}>
                  <i className={`${item.icon} ${item.iconColor} text-lg`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    {item.tag && (
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${item.tagColor}`}>
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{item.description}</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1 text-xs font-bold text-violet-600">
                      <i className="ri-copper-coin-fill text-violet-500 text-xs" />
                      {item.cost} credits
                    </span>
                    {alreadyRedeemed ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                        <i className="ri-check-line text-xs" />
                        Redeemed
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRedeem(item.id)}
                        disabled={!canAfford}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                          canAfford
                            ? "bg-violet-600 text-white hover:bg-violet-700"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {canAfford ? "Redeem" : `Need ${item.cost - availableCredits} more`}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Earn more CTA */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Complete more tasks to earn credits and unlock perks
          </p>
          <button
            type="button"
            onClick={() => navigate("/task-dashboard")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-task-line text-xs" />
            Go to Tasks
          </button>
        </div>
      </div>

      {/* ── Billing Toggle ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
          {(["monthly", "annual"] as const).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBilling(b)}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                billing === b ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {b === "monthly" ? "Monthly" : "Annual · Save 20%"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Plan Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {PLANS.map((plan) => {
          const displayPrice = billing === "annual" && plan.price > 0
            ? Math.round(plan.price * 0.8)
            : plan.price;
          const isSelected = selectedPlan === plan.id;
          const isProPlan = plan.id === "pro";

          return (
            <div
              key={plan.id}
              onClick={() => !plan.current && setSelectedPlan(plan.id)}
              style={{ transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease" }}
              className={`
                bg-white rounded-2xl p-5 flex flex-col gap-4 relative
                ${!plan.current ? "cursor-pointer" : ""}
                ${isSelected
                  ? "border-2 border-violet-500 -translate-y-1"
                  : isProPlan
                  ? "border-2 border-violet-200 hover:-translate-y-0.5"
                  : "border border-gray-100 hover:-translate-y-0.5"
                }
              `}
            >
              {/* Most Popular badge — more prominent */}
              {isProPlan && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-bold whitespace-nowrap">
                  <i className="ri-fire-fill text-amber-300 text-xs" />
                  Most Popular
                </div>
              )}

              {/* Selected checkmark ring */}
              <div
                className={`absolute top-3.5 right-3.5 w-5 h-5 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-violet-500 bg-violet-500 scale-100 opacity-100"
                    : "border-gray-200 bg-transparent scale-75 opacity-0"
                }`}
              >
                <i className="ri-check-line text-white text-[10px]" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${plan.accentBg} ${plan.accentColor}`}>
                    {plan.name}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{plan.description}</p>
              </div>

              <div>
                <span className="text-2xl font-bold text-gray-900">
                  {displayPrice === 0 ? "$0" : `$${displayPrice}`}
                </span>
                <span className="text-xs text-gray-400 ml-1">{plan.period}</span>
                {billing === "annual" && plan.price > 0 && (
                  <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                    Save ${Math.round(plan.price * 0.2 * 12)}/year
                  </p>
                )}
              </div>

              <ul className="space-y-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                    <div className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                      <i className={`ri-checkbox-circle-fill text-sm ${isProPlan ? "text-violet-500" : "text-gray-300"}`} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Credits multiplier callout */}
              {plan.id !== "free" && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${plan.accentBg} border-violet-100`}>
                  <i className={`ri-copper-coin-fill text-sm ${plan.accentColor}`} />
                  <p className={`text-xs font-semibold ${plan.accentColor}`}>
                    {plan.id === "pro" ? "2× credits" : "3× credits"} on every task
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  plan.current
                    ? "bg-gray-100 text-gray-500 cursor-default"
                    : isProPlan
                    ? "bg-violet-600 text-white hover:bg-violet-700"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
                disabled={plan.current}
              >
                {plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Usage ───────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">This Month&apos;s Usage</h3>
        {[
          { label: "Mentor Sessions",  used: 1,  total: 2,   unit: "sessions" },
          { label: "AI Tutor Queries", used: 67, total: 300, unit: "queries"  },
          { label: "Resource Vault",   used: 4,  total: 10,  unit: "resources"},
        ].map((u) => (
          <div key={u.label}>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-medium text-gray-700">{u.label}</p>
              <p className="text-xs text-gray-400">{u.used} / {u.total} {u.unit}</p>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all"
                style={{ width: `${Math.min((u.used / u.total) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">Upgrade to Pro for unlimited access</p>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            Upgrade Now
          </button>
        </div>
      </div>

    </div>
  );
}
