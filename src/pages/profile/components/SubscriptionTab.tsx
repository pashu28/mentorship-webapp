import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BADGE_DEFS, CREDITS_PER_TASK, achievementStats } from "@/mocks/achievements";

function loadTotalCompleted(): number {
  try { const raw = localStorage.getItem("task_total_completed"); if (raw) return parseInt(raw, 10) || 0; } catch (_) { /* ignore */ }
  return achievementStats.totalTasksCompleted;
}
function calcCredits(n: number): number {
  return n * CREDITS_PER_TASK + BADGE_DEFS.filter((b) => n >= b.tasksRequired).reduce((s, b) => s + b.bonusCredits, 0);
}
function getEarnedBadges(n: number) { return BADGE_DEFS.filter((b) => n >= b.tasksRequired); }
function getNextBadge(n: number) { return BADGE_DEFS.find((b) => n < b.tasksRequired) ?? null; }

const REDEMPTIONS = [
  { id: "bonus-session",    title: "Free Bonus Session",       description: "1 extra 30-min mentor session, on us",              cost: 200, icon: "ri-video-chat-line",    tag: "Most Popular" },
  { id: "discount-10",      title: "10% Off Next Month",       description: "Applied to your next subscription renewal",         cost: 150, icon: "ri-coupon-3-line",      tag: "Best Value" },
  { id: "premium-resources",title: "Unlock Premium Resources", description: "Access the premium resource vault for 30 days",     cost: 100, icon: "ri-archive-drawer-line",tag: "Quick Reward" },
  { id: "priority-match",   title: "Priority Mentor Matching", description: "Jump to the front of the matching queue",           cost: 80,  icon: "ri-user-star-line",     tag: "" },
];

const PLANS = [
  { id: "free",  name: "Free",  price: 0,  period: "forever",    description: "Get started with the basics",       features: ["Up to 2 mentor sessions/month","AI Tutor (10 queries/day)","Basic task tracking","Resource Vault (limited)","Earn credits on every task"],                                                                cta: "Current Plan",   current: true,  highlight: false },
  { id: "pro",   name: "Pro",   price: 19, period: "per month",  description: "For serious learners",              features: ["Unlimited mentor sessions","AI Tutor (unlimited)","Advanced task & goal tracking","Full Resource Vault access","Priority mentor matching","Session recordings","2× credits on every task"],                  cta: "Upgrade to Pro", current: false, highlight: true  },
  { id: "team",  name: "Team",  price: 49, period: "per month",  description: "For cohorts and organizations",     features: ["Everything in Pro","Up to 10 team members","Team progress dashboard","Dedicated account manager","Custom mentor matching","3× credits on every task"],                                                       cta: "Contact Sales",  current: false, highlight: false },
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
  const spentCredits = redeemedIds.reduce((sum, id) => sum + (REDEMPTIONS.find((x) => x.id === id)?.cost ?? 0), 0);
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

  const cardStyle = { backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" };

  return (
    <div className="space-y-5">

      {/* Credits Summary Bar */}
      <div className="flex items-center gap-4 px-5 py-4 rounded-2xl border" style={cardStyle}>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 flex items-center justify-center rounded-xl border"
            style={{ backgroundColor: "var(--accent-light)", borderColor: "var(--accent-light)" }}>
            <i className="ri-copper-coin-fill text-base" style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide font-semibold" style={{ color: "var(--text-muted)" }}>Credits</p>
            <p className="text-xl font-black leading-none" style={{ color: "var(--text-primary)" }}>{availableCredits}</p>
          </div>
        </div>
        <div className="w-px h-10 shrink-0" style={{ backgroundColor: "var(--border)" }} />
        <div className="flex items-center gap-2 shrink-0">
          {latestBadge ? (
            <>
              <div className="w-7 h-7 flex items-center justify-center rounded-lg border shrink-0"
                style={{ backgroundColor: "var(--accent-light)", borderColor: "var(--accent-light)" }}>
                <i className={`${latestBadge.icon} text-xs`} style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide font-semibold" style={{ color: "var(--text-muted)" }}>Badge</p>
                <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{latestBadge.name}</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-7 h-7 flex items-center justify-center rounded-lg border shrink-0"
                style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}>
                <i className="ri-medal-line text-xs" style={{ color: "var(--text-muted)" }} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide font-semibold" style={{ color: "var(--text-muted)" }}>Badge</p>
                <p className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>None yet</p>
              </div>
            </>
          )}
        </div>
        <div className="w-px h-10 shrink-0" style={{ backgroundColor: "var(--border)" }} />
        {nextBadge ? (
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                Next: <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>{nextBadge.name}</span>
                <span className="font-semibold ml-1" style={{ color: "var(--success)" }}>+{nextBadge.bonusCredits} cr</span>
              </p>
              <p className="text-[10px] font-bold" style={{ color: "var(--text-muted)" }}>{nextBadge.tasksRequired - totalCompleted} tasks away</p>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-elevated)" }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${badgeProgressPct}%`, backgroundColor: "var(--accent)" }} />
            </div>
          </div>
        ) : (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold" style={{ color: "var(--success)" }}>All badges earned!</p>
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{earnedBadges.length} of {BADGE_DEFS.length} milestones complete</p>
          </div>
        )}
        <button type="button" onClick={() => navigate("/achievements")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
          <i className="ri-trophy-line text-xs" />
          Achievements
        </button>
      </div>

      {/* Redeem Credits */}
      <div className="border rounded-2xl p-5" style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <i className="ri-gift-2-line text-base" style={{ color: "var(--accent)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Redeem Credits</h3>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold"
            style={{ backgroundColor: "var(--accent-light)", borderColor: "var(--accent-light)", color: "var(--accent-text)" }}>
            <i className="ri-copper-coin-fill text-xs" />
            {availableCredits} available
          </span>
        </div>

        {confirmId && (
          <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-medium"
            style={{ backgroundColor: "var(--success-light)", borderColor: "var(--success-light)", color: "var(--success)" }}>
            <i className="ri-check-double-line text-sm" />
            Redeemed! Your perk has been applied to your account.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REDEMPTIONS.map((item) => {
            const alreadyRedeemed = redeemedIds.includes(item.id);
            const canAfford = availableCredits >= item.cost;
            return (
              <div key={item.id} className="flex items-start gap-3 p-4 rounded-xl border transition-all"
                style={{
                  backgroundColor: alreadyRedeemed ? "var(--success-light)" : "var(--bg-elevated)",
                  borderColor: alreadyRedeemed ? "var(--success-light)" : "var(--border)",
                  opacity: !alreadyRedeemed && !canAfford ? 0.6 : 1,
                }}>
                <div className="w-10 h-10 flex items-center justify-center rounded-xl shrink-0"
                  style={{ backgroundColor: "var(--accent-light)" }}>
                  <i className={`${item.icon} text-lg`} style={{ color: "var(--accent)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{item.title}</p>
                    {item.tag && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full border"
                        style={{ backgroundColor: "var(--accent-light)", color: "var(--accent-text)", borderColor: "var(--accent-light)" }}>
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>{item.description}</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1 text-xs font-bold" style={{ color: "var(--accent-text)" }}>
                      <i className="ri-copper-coin-fill text-xs" style={{ color: "var(--accent)" }} />
                      {item.cost} credits
                    </span>
                    {alreadyRedeemed ? (
                      <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--success)" }}>
                        <i className="ri-check-line text-xs" /> Redeemed
                      </span>
                    ) : (
                      <button type="button" onClick={() => handleRedeem(item.id)} disabled={!canAfford}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                        style={{
                          backgroundColor: canAfford ? "var(--accent)" : "var(--bg-elevated)",
                          color: canAfford ? "#fff" : "var(--text-muted)",
                          cursor: canAfford ? "pointer" : "not-allowed",
                        }}>
                        {canAfford ? "Redeem" : `Need ${item.cost - availableCredits} more`}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Complete more tasks to earn credits and unlock perks</p>
          <button type="button" onClick={() => navigate("/task-dashboard")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
            <i className="ri-task-line text-xs" /> Go to Tasks
          </button>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-1 rounded-full p-1" style={{ backgroundColor: "var(--bg-elevated)" }}>
          {(["monthly", "annual"] as const).map((b) => (
            <button key={b} type="button" onClick={() => setBilling(b)}
              className="px-5 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
              style={{
                backgroundColor: billing === b ? "var(--bg-surface)" : "transparent",
                color: billing === b ? "var(--text-primary)" : "var(--text-muted)",
              }}>
              {b === "monthly" ? "Monthly" : "Annual · Save 20%"}
            </button>
          ))}
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-3 gap-4">
        {PLANS.map((plan) => {
          const displayPrice = billing === "annual" && plan.price > 0 ? Math.round(plan.price * 0.8) : plan.price;
          const isSelected = selectedPlan === plan.id;
          const isProPlan = plan.id === "pro";
          return (
            <div key={plan.id} onClick={() => !plan.current && setSelectedPlan(plan.id)}
              className="rounded-2xl p-5 flex flex-col gap-4 relative border transition-all"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: isSelected ? "var(--accent)" : isProPlan ? "var(--accent-light)" : "var(--border)",
                transform: isSelected ? "translateY(-4px)" : "none",
                cursor: plan.current ? "default" : "pointer",
              }}>
              {isProPlan && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-bold whitespace-nowrap"
                  style={{ backgroundColor: "var(--accent)" }}>
                  <i className="ri-fire-fill text-amber-300 text-xs" /> Most Popular
                </div>
              )}
              <div className={`absolute top-3.5 right-3.5 w-5 h-5 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${isSelected ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
                style={{ borderColor: "var(--accent)", backgroundColor: isSelected ? "var(--accent)" : "transparent" }}>
                <i className="ri-check-line text-white text-[10px]" />
              </div>
              <div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "var(--accent-light)", color: "var(--accent-text)" }}>
                  {plan.name}
                </span>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{plan.description}</p>
              </div>
              <div>
                <span className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {displayPrice === 0 ? "$0" : `$${displayPrice}`}
                </span>
                <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>{plan.period}</span>
                {billing === "annual" && plan.price > 0 && (
                  <p className="text-[10px] font-medium mt-0.5" style={{ color: "var(--success)" }}>
                    Save ${Math.round(plan.price * 0.2 * 12)}/year
                  </p>
                )}
              </div>
              <ul className="space-y-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                    <div className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                      <i className={`ri-checkbox-circle-fill text-sm`}
                        style={{ color: isProPlan ? "var(--accent)" : "var(--border)" }} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              {plan.id !== "free" && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border"
                  style={{ backgroundColor: "var(--accent-light)", borderColor: "var(--accent-light)" }}>
                  <i className="ri-copper-coin-fill text-sm" style={{ color: "var(--accent)" }} />
                  <p className="text-xs font-semibold" style={{ color: "var(--accent-text)" }}>
                    {plan.id === "pro" ? "2×" : "3×"} credits on every task
                  </p>
                </div>
              )}
              <button type="button" onClick={(e) => e.stopPropagation()}
                className="w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap"
                style={{
                  backgroundColor: plan.current ? "var(--bg-elevated)" : isProPlan ? "var(--accent)" : "transparent",
                  color: plan.current ? "var(--text-muted)" : isProPlan ? "#fff" : "var(--text-secondary)",
                  border: plan.current || isProPlan ? "none" : `1px solid var(--border)`,
                  cursor: plan.current ? "default" : "pointer",
                }}
                disabled={plan.current}>
                {plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* Usage */}
      <div className="border rounded-2xl p-6 space-y-4" style={cardStyle}>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>This Month&apos;s Usage</h3>
        {[
          { label: "Mentor Sessions",  used: 1,  total: 2,   unit: "sessions" },
          { label: "AI Tutor Queries", used: 67, total: 300, unit: "queries"  },
          { label: "Resource Vault",   used: 4,  total: 10,  unit: "resources"},
        ].map((u) => (
          <div key={u.label}>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{u.label}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{u.used} / {u.total} {u.unit}</p>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-elevated)" }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((u.used / u.total) * 100, 100)}%`, backgroundColor: "var(--accent)" }} />
            </div>
          </div>
        ))}
        <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Upgrade to Pro for unlimited access</p>
          <button type="button" className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            style={{ backgroundColor: "var(--accent)" }}>
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}
