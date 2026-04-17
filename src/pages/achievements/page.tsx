import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/feature/AppLayout";
import { useTheme } from "@/hooks/useTheme";
import { useAchievements } from "@/hooks/useAchievements";
import {
  BADGE_DEFS,
  CREDITS_PER_TASK,
  redemptionOptions,
  type BadgeDef,
} from "@/mocks/achievements";

// ── Helpers ────────────────────────────────────────────────────────────────

function getBadgeDef(badgeId: string): BadgeDef | undefined {
  return BADGE_DEFS.find((b) => b.id === badgeId);
}

// ── Tabs ───────────────────────────────────────────────────────────────────

type TabId = "overview" | "badges" | "history" | "credits";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "overview", label: "Overview",          icon: "ri-home-4-line" },
  { id: "badges",   label: "Badges & Rules",    icon: "ri-trophy-line" },
  { id: "history",  label: "Task History",      icon: "ri-list-check-3" },
  { id: "credits",  label: "Credits & Rewards", icon: "ri-coin-line" },
];

// ── Badge dark-mode color map ──────────────────────────────────────────────
const BADGE_DARK: Record<string, { bg: string; border: string; color: string }> = {
  "text-violet-500": { bg: "rgba(139,92,246,0.18)", border: "rgba(139,92,246,0.4)", color: "#C4B5FD" },
  "text-violet-600": { bg: "rgba(139,92,246,0.18)", border: "rgba(139,92,246,0.4)", color: "#C4B5FD" },
  "text-emerald-600": { bg: "rgba(52,211,153,0.15)", border: "rgba(52,211,153,0.35)", color: "#6EE7B7" },
  "text-emerald-700": { bg: "rgba(52,211,153,0.15)", border: "rgba(52,211,153,0.35)", color: "#6EE7B7" },
};

function getBadgeDarkStyle(colorClass: string) {
  return BADGE_DARK[colorClass] ?? { bg: "rgba(139,92,246,0.18)", border: "rgba(139,92,246,0.4)", color: "#C4B5FD" };
}

// ── Credits Hero ───────────────────────────────────────────────────────────

function CreditsHero() {
  const { isDark } = useTheme();
  const stats = useAchievements();
  const {
    totalCreditsEarned, totalCreditsRedeemed, creditsFromTasks, creditsFromBadges,
    totalTasksCompleted, totalBadgesEarned, nextBadgeDef, tasksToNextBadge, balance,
  } = stats;

  const pct = nextBadgeDef
    ? Math.min(Math.round((totalTasksCompleted / nextBadgeDef.tasksRequired) * 100), 100)
    : 100;

  const heroBg = isDark
    ? "var(--bg-surface)"
    : "linear-gradient(135deg, #EDE9F8 0%, #E8EEF8 50%, #E2F4EE 100%)";
  const innerCardBg = isDark ? "var(--bg-elevated)" : "rgba(255,255,255,0.75)";
  const progressTrackBg = isDark ? "var(--bg-elevated)" : "rgba(255,255,255,0.6)";

  return (
    <div className="relative rounded-2xl p-6 overflow-hidden border"
      style={{ background: heroBg, borderColor: "var(--border)" }}>

      <div className="relative z-10 flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 flex items-center justify-center rounded-full" style={{ backgroundColor: "var(--accent-light)" }}>
              <i className="ri-coin-fill text-xs" style={{ color: "var(--accent)" }} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--accent-text)" }}>Credits Balance</span>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-5xl font-black leading-none" style={{ color: "var(--text-primary)" }}>{balance}</span>
            <span className="text-sm pb-1 font-medium" style={{ color: "var(--text-muted)" }}>credits available</span>
          </div>

          {/* Breakdown */}
          <div className="rounded-xl px-4 py-3 mb-4 border"
            style={{ backgroundColor: innerCardBg, borderColor: isDark ? "var(--border)" : "rgba(255,255,255,0.6)" }}>
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
              How your {totalCreditsEarned} credits were earned:
            </p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full shrink-0" style={{ backgroundColor: "var(--success-light)" }}>
                    <i className="ri-checkbox-circle-fill text-xs" style={{ color: "var(--success)" }} />
                  </div>
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {totalTasksCompleted} task{totalTasksCompleted !== 1 ? "s" : ""} × {CREDITS_PER_TASK} credits each
                  </span>
                </div>
                <span className="text-xs font-bold" style={{ color: "var(--success)" }}>+{creditsFromTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full shrink-0" style={{ backgroundColor: "var(--warning-light)" }}>
                    <i className="ri-trophy-fill text-xs" style={{ color: "var(--warning)" }} />
                  </div>
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {totalBadgesEarned} badge{totalBadgesEarned !== 1 ? "s" : ""} unlocked — bonus credits
                  </span>
                </div>
                <span className="text-xs font-bold" style={{ color: "var(--warning)" }}>+{creditsFromBadges}</span>
              </div>
              <div className="border-t pt-1.5 flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Total earned</span>
                <span className="text-xs font-black" style={{ color: "var(--text-primary)" }}>{totalCreditsEarned}</span>
              </div>
            </div>
          </div>

          {/* Progress to next badge */}
          {nextBadgeDef ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <i className={`${nextBadgeDef.icon} ${nextBadgeDef.color} text-sm`} />
                  <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                    Next badge: <span className="font-bold">{nextBadgeDef.name}</span>
                  </span>
                </div>
                <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>
                  {totalTasksCompleted} / {nextBadgeDef.tasksRequired} tasks
                </span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: progressTrackBg }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: "linear-gradient(90deg, var(--accent), var(--success))" }} />
              </div>
              <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                Complete {tasksToNextBadge} more task{tasksToNextBadge !== 1 ? "s" : ""} to unlock {nextBadgeDef.name} (+{nextBadgeDef.bonusCredits} bonus credits)
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: "var(--success-light)" }}>
              <i className="ri-checkbox-circle-fill text-sm" style={{ color: "var(--success)" }} />
              <p className="text-xs font-semibold" style={{ color: "var(--success)" }}>All badges unlocked — you&apos;re a champion!</p>
            </div>
          )}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 lg:w-44 shrink-0">
          {[
            { label: "Tasks Done",    value: totalTasksCompleted,        icon: "ri-checkbox-circle-fill", colorVar: "var(--success)" },
            { label: "Badges Earned", value: totalBadgesEarned,          icon: "ri-medal-fill",           colorVar: "var(--warning)" },
            { label: "Total Earned",  value: `${totalCreditsEarned} cr`, icon: "ri-coin-fill",            colorVar: "var(--accent)" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl px-3 py-3 flex items-center gap-2.5 border"
              style={{ backgroundColor: isDark ? innerCardBg : "rgba(255,255,255,0.85)", borderColor: isDark ? "var(--border)" : "rgba(255,255,255,0.6)" }}>
              <div className="w-7 h-7 flex items-center justify-center shrink-0">
                <i className={`${stat.icon} text-lg`} style={{ color: stat.colorVar }} />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold leading-none" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
                <p className="text-[10px] mt-0.5 leading-tight" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Overview Tab ───────────────────────────────────────────────────────────

function OverviewTab({ onTabChange }: { onTabChange: (tab: TabId) => void }) {
  const { isDark } = useTheme();
  const stats = useAchievements();
  const { balance, liveCompletedTasks, earnedBadgeDefs } = stats;
  const recentTasks = [...liveCompletedTasks].reverse().slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <CreditsHero />

      {/* How it works */}
      <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 mb-4">
          <i className="ri-information-line text-base" style={{ color: "var(--accent)" }} />
          <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>How Credits Work</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { step: "1", icon: "ri-checkbox-circle-fill", colorVar: "var(--success)", bgVar: "var(--success-light)", title: `Complete a task → +${CREDITS_PER_TASK} credits`, desc: "Every task you finish earns you 10 credits, instantly." },
            { step: "2", icon: "ri-trophy-fill",          colorVar: "var(--warning)",  bgVar: "var(--warning-light)", title: "Reach a task milestone → badge unlocks",          desc: "Hit 1, 5, 10, 25, 50, or 100 tasks to unlock a badge." },
            { step: "3", icon: "ri-gift-fill",            colorVar: "var(--accent)",   bgVar: "var(--accent-light)",  title: "Badge unlocked → bonus credits",                   desc: "Each badge awards extra credits on top of your task credits." },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-3 p-4 rounded-xl border"
              style={{ backgroundColor: isDark ? "var(--bg-elevated)" : "var(--bg-surface)", borderColor: "var(--border)" }}>
              <div className="w-9 h-9 flex items-center justify-center rounded-xl shrink-0" style={{ backgroundColor: s.bgVar }}>
                <i className={`${s.icon} text-lg`} style={{ color: s.colorVar }} />
              </div>
              <div>
                <p className="text-xs font-bold mb-0.5" style={{ color: "var(--text-primary)" }}>{s.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent tasks */}
        <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <i className="ri-checkbox-circle-fill text-base" style={{ color: "var(--success)" }} />
              <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Recent Tasks Completed</h2>
            </div>
            <button type="button" onClick={() => onTabChange("history")}
              className="text-xs cursor-pointer whitespace-nowrap" style={{ color: "var(--accent)" }}>View all →</button>
          </div>
          {recentTasks.length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-2 text-center">
              <i className="ri-checkbox-blank-circle-line text-3xl" style={{ color: "var(--border)" }} />
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>No tasks completed yet. Head to the task dashboard to get started!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border"
                  style={{ backgroundColor: "var(--success-light)", borderColor: "var(--success-light)" }}>
                  <div className="w-7 h-7 flex items-center justify-center rounded-full shrink-0" style={{ backgroundColor: "var(--success-light)" }}>
                    <i className="ri-check-line text-sm" style={{ color: "var(--success)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>{task.taskTitle}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{task.stepLabel} · {task.completedAt}</p>
                  </div>
                  <span className="text-xs font-bold whitespace-nowrap" style={{ color: "var(--success)" }}>+{task.creditsEarned} cr</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Redeem preview */}
        <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <i className="ri-gift-fill text-base" style={{ color: "var(--accent)" }} />
              <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Redeem Credits</h2>
            </div>
            <button type="button" onClick={() => onTabChange("credits")}
              className="text-xs cursor-pointer whitespace-nowrap" style={{ color: "var(--accent)" }}>View all →</button>
          </div>
          <div className="flex flex-col gap-2.5">
            {redemptionOptions.slice(0, 3).map((opt) => {
              const canRedeem = balance >= opt.cost;
              return (
                <div key={opt.id} className="flex items-center gap-3 p-3 rounded-xl border transition-all"
                  style={{ backgroundColor: isDark ? "var(--bg-elevated)" : "var(--bg-surface)", borderColor: "var(--border)" }}>
                  <div className="w-9 h-9 flex items-center justify-center rounded-lg shrink-0"
                    style={{ backgroundColor: "var(--accent-light)" }}>
                    <i className={`${opt.icon} text-base`} style={{ color: "var(--accent)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{opt.title}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{opt.cost} credits</p>
                  </div>
                  <button type="button"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
                    style={{
                      backgroundColor: canRedeem ? "var(--accent)" : isDark ? "var(--bg-elevated)" : "var(--bg-base)",
                      color: canRedeem ? "#fff" : "var(--text-muted)",
                      cursor: canRedeem ? "pointer" : "not-allowed",
                    }} disabled={!canRedeem}>
                    {canRedeem ? "Redeem" : `Need ${opt.cost - balance}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* All badges overview */}
      <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <i className="ri-trophy-fill text-base" style={{ color: "var(--warning)" }} />
            <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Badges</h2>
          </div>
          <button type="button" onClick={() => onTabChange("badges")}
            className="text-xs cursor-pointer whitespace-nowrap" style={{ color: "var(--accent)" }}>View all →</button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {BADGE_DEFS.map((badge) => {
            const earned = earnedBadgeDefs.some((b) => b.id === badge.id);
            const ds = isDark ? getBadgeDarkStyle(badge.color) : null;
            return (
              <div key={badge.id}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center ${earned && !isDark ? `bg-gradient-to-br ${badge.glow} ${badge.border}` : ""}`}
                style={
                  earned && isDark && ds
                    ? { backgroundColor: ds.bg, borderColor: ds.border }
                    : !earned
                    ? { backgroundColor: isDark ? "var(--bg-elevated)" : "var(--bg-surface)", borderColor: "var(--border)", opacity: 0.5 }
                    : {}
                }>
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-xl border ${earned && !isDark ? `${badge.bg} ${badge.border}` : ""}`}
                  style={
                    earned && isDark && ds
                      ? { backgroundColor: ds.bg, borderColor: ds.border }
                      : !earned
                      ? { backgroundColor: isDark ? "var(--bg-elevated)" : "var(--bg-base)", borderColor: "var(--border)" }
                      : {}
                  }>
                  <i
                    className={`${badge.icon} text-lg ${earned && !isDark ? badge.color : ""}`}
                    style={earned && isDark && ds ? { color: ds.color } : !earned ? { color: "var(--text-muted)" } : {}}
                  />
                </div>
                <p
                  className={`text-[10px] font-bold leading-tight ${earned && !isDark ? badge.color : ""}`}
                  style={earned && isDark && ds ? { color: ds.color } : !earned ? { color: "var(--text-muted)" } : {}}>
                  {badge.name}
                </p>
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                  {earned ? `+${badge.bonusCredits} bonus` : `${badge.tasksRequired} tasks`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Badges & Rules Tab ─────────────────────────────────────────────────────

function BadgesTab() {
  const { isDark } = useTheme();
  const stats = useAchievements();
  const { totalTasksCompleted, earnedBadgeDefs, liveEarnedBadges } = stats;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 mb-2">
          <i className="ri-information-line text-base" style={{ color: "var(--accent)" }} />
          <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Badge Rules</h2>
        </div>
        <p className="text-xs leading-relaxed mb-1" style={{ color: "var(--text-muted)" }}>
          Badges unlock automatically when your <strong style={{ color: "var(--text-secondary)" }}>total tasks completed</strong> reaches a milestone.
          Each badge awards <strong style={{ color: "var(--text-secondary)" }}>bonus credits</strong> on top of the credits you already earned from completing those tasks.
          Badges never reset — once earned, they&apos;re yours forever.
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          You&apos;ve completed <strong style={{ color: "var(--text-primary)" }}>{totalTasksCompleted} task{totalTasksCompleted !== 1 ? "s" : ""}</strong> so far.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {BADGE_DEFS.map((badge) => {
          const earned = earnedBadgeDefs.some((b) => b.id === badge.id);
          const earnedEntry = liveEarnedBadges.find((e) => e.badgeId === badge.id);
          const pct = Math.min(Math.round((totalTasksCompleted / badge.tasksRequired) * 100), 100);
          const ds = isDark ? getBadgeDarkStyle(badge.color) : null;

          return (
            <div key={badge.id}
              className={`relative rounded-2xl border p-5 overflow-hidden transition-all ${earned && !isDark ? `bg-gradient-to-br ${badge.glow} ${badge.border}` : ""}`}
              style={
                earned && isDark && ds
                  ? { backgroundColor: ds.bg, borderColor: ds.border }
                  : !earned
                  ? { backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }
                  : {}
              }>
              {earned && (
                <div className="absolute top-3 right-4 opacity-10 pointer-events-none">
                  <i
                    className={`ri-sparkling-2-fill text-5xl ${!isDark ? badge.color : ""}`}
                    style={isDark && ds ? { color: ds.color } : {}}
                  />
                </div>
              )}
              <div className="relative z-10 flex items-start gap-4">
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-2xl border shrink-0 ${earned && !isDark ? `${badge.bg} ${badge.border}` : ""}`}
                  style={
                    earned && isDark && ds
                      ? { backgroundColor: ds.bg, borderColor: ds.border }
                      : !earned
                      ? { backgroundColor: isDark ? "var(--bg-elevated)" : "var(--bg-base)", borderColor: "var(--border)" }
                      : {}
                  }>
                  <i
                    className={`${badge.icon} text-2xl ${earned && !isDark ? badge.color : ""}`}
                    style={earned && isDark && ds ? { color: ds.color } : !earned ? { color: "var(--text-muted)" } : {}}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className={`text-sm font-bold ${earned && !isDark ? badge.color : ""}`}
                        style={earned && isDark && ds ? { color: ds.color } : !earned ? { color: "var(--text-muted)" } : {}}>
                        {badge.name}
                      </p>
                      {earned && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                          style={{ backgroundColor: "var(--success-light)", color: "var(--success)", borderColor: "var(--success-light)" }}>
                          Unlocked
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      {[`Unlock at ${badge.tasksRequired} task${badge.tasksRequired !== 1 ? "s" : ""}`, `+${badge.bonusCredits} bonus credits`].map((label) => (
                        <span
                          key={label}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${earned && !isDark ? `${badge.bg} ${badge.color} ${badge.border}` : ""}`}
                          style={
                            earned && isDark && ds
                              ? { backgroundColor: ds.bg, color: ds.color, borderColor: ds.border }
                              : !earned
                              ? { backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)", borderColor: "var(--border)" }
                              : {}
                          }>
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-muted)" }}>{badge.description}</p>
                  {earned && earnedEntry ? (
                    <div className="flex items-center gap-2">
                      <i className="ri-calendar-check-line text-xs" style={{ color: "var(--text-muted)" }} />
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        Unlocked on {earnedEntry.dateEarned} after completing {earnedEntry.tasksAtTime} task{earnedEntry.tasksAtTime !== 1 ? "s" : ""}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>Your progress</span>
                        <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{totalTasksCompleted} / {badge.tasksRequired} tasks</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? "var(--bg-elevated)" : "var(--bg-base)" }}>
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: "var(--accent)" }} />
                      </div>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                        {badge.tasksRequired - totalTasksCompleted} more task{badge.tasksRequired - totalTasksCompleted !== 1 ? "s" : ""} to unlock
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Task History Tab ───────────────────────────────────────────────────────

function TaskHistoryTab() {
  const { isDark } = useTheme();
  const stats = useAchievements();
  const { liveCompletedTasks, liveEarnedBadges, totalTasksCompleted, totalBadgesEarned, creditsFromTasks } = stats;
  const sorted = [...liveCompletedTasks].reverse();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Tasks Completed",    value: totalTasksCompleted, icon: "ri-checkbox-circle-fill", colorVar: "var(--success)", bgVar: "var(--success-light)" },
          { label: "Credits from Tasks", value: creditsFromTasks,    icon: "ri-coin-fill",            colorVar: "var(--accent)",  bgVar: "var(--accent-light)" },
          { label: "Badges Earned",      value: totalBadgesEarned,   icon: "ri-trophy-fill",          colorVar: "var(--warning)", bgVar: "var(--warning-light)" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border p-4 flex items-center gap-3"
            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
            <div className="w-10 h-10 flex items-center justify-center rounded-xl shrink-0" style={{ backgroundColor: stat.bgVar }}>
              <i className={`${stat.icon} text-lg`} style={{ color: stat.colorVar }} />
            </div>
            <div>
              <p className="text-xl font-black leading-none" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 mb-4">
          <i className="ri-list-check-3 text-base" style={{ color: "var(--text-muted)" }} />
          <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>All Completed Tasks</h2>
          <span className="text-xs ml-auto" style={{ color: "var(--text-muted)" }}>{totalTasksCompleted} tasks</span>
        </div>

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center py-10 gap-2 text-center">
            <i className="ri-checkbox-blank-circle-line text-3xl" style={{ color: "var(--border)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>No tasks completed yet</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Complete tasks on the task dashboard to see your history here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-0">
            {sorted.map((task, idx) => {
              const badgeOnThisTask = liveEarnedBadges.find((e) => e.tasksAtTime === liveCompletedTasks.length - idx);
              return (
                <div key={task.id} style={idx > 0 ? { borderTop: "1px solid var(--border)" } : {}}>
                  <div className="flex items-center gap-3 py-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full border shrink-0"
                      style={{ backgroundColor: "var(--success-light)", borderColor: "var(--success-light)" }}>
                      <i className="ri-check-line text-sm" style={{ color: "var(--success)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{task.taskTitle}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{task.stepLabel} · {task.completedAt}</p>
                    </div>
                    <span className="text-sm font-bold whitespace-nowrap shrink-0" style={{ color: "var(--success)" }}>+{task.creditsEarned} cr</span>
                  </div>
                  {badgeOnThisTask && (() => {
                    const bd = getBadgeDef(badgeOnThisTask.badgeId);
                    if (!bd) return null;
                    const ds = isDark ? getBadgeDarkStyle(bd.color) : null;
                    return (
                      <div
                        className={`flex items-center gap-2 mx-3 mb-2 px-3 py-2 rounded-lg border ${!isDark ? `${bd.bg} ${bd.border}` : ""}`}
                        style={isDark && ds ? { backgroundColor: ds.bg, borderColor: ds.border } : {}}>
                        <i className={`${bd.icon} text-sm ${!isDark ? bd.color : ""}`} style={isDark && ds ? { color: ds.color } : {}} />
                        <p className={`text-xs font-semibold ${!isDark ? bd.color : ""}`} style={isDark && ds ? { color: ds.color } : {}}>
                          Badge unlocked: {bd.name} — +{badgeOnThisTask.bonusCreditsAwarded} bonus credits!
                        </p>
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Credits & Rewards Tab ──────────────────────────────────────────────────

function CreditsTab() {
  const { isDark } = useTheme();
  const stats = useAchievements();
  const { balance, totalTasksCompleted, totalBadgesEarned, creditsFromTasks, creditsFromBadges, totalCreditsEarned, liveLedger } = stats;
  const [redeemed, setRedeemed] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl border"
            style={{ backgroundColor: "var(--accent-light)", borderColor: "var(--accent-light)" }}>
            <i className="ri-coin-fill text-xl" style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Available Credits</p>
            <p className="text-3xl font-black leading-none" style={{ color: "var(--text-primary)" }}>{balance}</p>
          </div>
          <div className="ml-auto flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{totalTasksCompleted} tasks × {CREDITS_PER_TASK}</span>
              <span className="text-xs font-bold" style={{ color: "var(--success)" }}>= +{creditsFromTasks}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{totalBadgesEarned} badge bonuses</span>
              <span className="text-xs font-bold" style={{ color: "var(--warning)" }}>= +{creditsFromBadges}</span>
            </div>
            <div className="flex items-center gap-2 border-t pt-1" style={{ borderColor: "var(--border)" }}>
              <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Total earned</span>
              <span className="text-xs font-black" style={{ color: "var(--text-primary)" }}>{totalCreditsEarned}</span>
            </div>
          </div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
          You earn <strong style={{ color: "var(--text-secondary)" }}>{CREDITS_PER_TASK} credits per task</strong> completed. Unlock badges to earn <strong style={{ color: "var(--text-secondary)" }}>bonus credits</strong> on top. Redeem credits below for real subscription perks.
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--text-muted)" }}>Redeem Your Credits</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {redemptionOptions.map((opt) => {
            const canRedeem = balance >= opt.cost;
            const isRedeemed = redeemed.includes(opt.id);
            return (
              <div key={opt.id} className="rounded-2xl border p-5 flex flex-col gap-4 transition-all"
                style={{
                  backgroundColor: isRedeemed ? "var(--success-light)" : "var(--bg-surface)",
                  borderColor: isRedeemed ? "var(--success-light)" : "var(--border)",
                }}>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl shrink-0"
                    style={{ backgroundColor: "var(--accent-light)" }}>
                    <i className={`${opt.icon} text-xl`} style={{ color: "var(--accent)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{opt.title}</p>
                      {opt.tag && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap"
                          style={{ backgroundColor: "var(--accent-light)", color: "var(--accent-text)", borderColor: "var(--accent-light)" }}>
                          {opt.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{opt.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-1.5">
                    <i className="ri-coin-fill text-sm" style={{ color: "var(--warning)" }} />
                    <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{opt.cost} credits</span>
                    {!canRedeem && !isRedeemed && (
                      <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>({opt.cost - balance} more needed)</span>
                    )}
                  </div>
                  {isRedeemed ? (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ backgroundColor: "var(--success-light)", color: "var(--success)" }}>
                      <i className="ri-check-line" /> Redeemed!
                    </span>
                  ) : (
                    <button type="button" onClick={() => canRedeem && setRedeemed((p) => [...p, opt.id])}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
                      style={{
                        backgroundColor: canRedeem ? "var(--accent)" : isDark ? "var(--bg-elevated)" : "var(--bg-base)",
                        color: canRedeem ? "#fff" : "var(--text-muted)",
                        cursor: canRedeem ? "pointer" : "not-allowed",
                      }} disabled={!canRedeem}>
                      {canRedeem ? "Redeem Now" : "Not enough credits"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Credits ledger */}
      <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 mb-4">
          <i className="ri-receipt-line text-base" style={{ color: "var(--text-muted)" }} />
          <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Credits History</h2>
        </div>
        {liveLedger.length === 0 ? (
          <div className="flex flex-col items-center py-8 gap-2 text-center">
            <i className="ri-coin-line text-3xl" style={{ color: "var(--border)" }} />
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>No credits earned yet. Complete tasks to start earning!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-0">
            {[...liveLedger].reverse().map((entry, idx) => {
              const badge = entry.badgeId ? getBadgeDef(entry.badgeId) : undefined;
              const isBadgeEntry = entry.type === "badge";
              return (
                <div key={entry.id} className="flex items-center gap-3 py-3" style={idx > 0 ? { borderTop: "1px solid var(--border)" } : {}}>
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg shrink-0"
                    style={{ backgroundColor: isBadgeEntry ? "var(--warning-light)" : "var(--success-light)" }}>
                    <i className={`${isBadgeEntry ? (badge?.icon ?? "ri-trophy-line") : "ri-checkbox-circle-line"} text-sm`}
                      style={{ color: isBadgeEntry ? "var(--warning)" : "var(--success)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{entry.description}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{entry.date}</p>
                  </div>
                  <span className="text-sm font-bold whitespace-nowrap shrink-0"
                    style={{ color: entry.type === "redeemed" ? "var(--danger)" : isBadgeEntry ? "var(--warning)" : "var(--success)" }}>
                    +{entry.amount} cr
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function AchievementsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const stats = useAchievements();
  const { balance } = stats;

  return (
    <AppLayout>
      <div className="w-full min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
        <div className="px-6 pt-8 pb-4" style={{ backgroundColor: "var(--bg-base)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Achievements &amp; Rewards</h1>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                  Complete tasks to earn credits, unlock badges, and redeem perks.
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border shrink-0"
                style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
                <i className="ri-coin-fill text-base" style={{ color: "var(--warning)" }} />
                <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{balance}</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>credits available</span>
              </div>
            </div>

            <div className="flex items-center gap-0 border-b" style={{ borderColor: "var(--border)" }}>
              {TABS.map((tab) => (
                <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap -mb-px"
                  style={{
                    borderColor: activeTab === tab.id ? "var(--accent)" : "transparent",
                    color: activeTab === tab.id ? "var(--accent)" : "var(--text-muted)",
                  }}>
                  <i className={`${tab.icon} text-sm`} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-6">
          {activeTab === "overview" && <OverviewTab onTabChange={setActiveTab} />}
          {activeTab === "badges"   && <BadgesTab />}
          {activeTab === "history"  && <TaskHistoryTab />}
          {activeTab === "credits"  && <CreditsTab />}
        </div>
      </div>
    </AppLayout>
  );
}
