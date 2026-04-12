import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/feature/AppLayout";
import {
  BADGE_DEFS,
  earnedBadgeHistory,
  completedTaskHistory,
  creditsLedger,
  redemptionOptions,
  achievementStats,
  CREDITS_PER_TASK,
  type BadgeDef,
} from "@/mocks/achievements";

// ── Helpers ────────────────────────────────────────────────────────────────

function getBadgeDef(badgeId: string): BadgeDef | undefined {
  return BADGE_DEFS.find((b) => b.id === badgeId);
}

function isBadgeEarned(badgeId: string): boolean {
  return earnedBadgeHistory.some((e) => e.badgeId === badgeId);
}

// ── Tabs ───────────────────────────────────────────────────────────────────

type TabId = "overview" | "badges" | "history" | "credits";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "overview", label: "Overview",          icon: "ri-home-4-line" },
  { id: "badges",   label: "Badges & Rules",    icon: "ri-trophy-line" },
  { id: "history",  label: "Task History",      icon: "ri-list-check-3" },
  { id: "credits",  label: "Credits & Rewards", icon: "ri-coin-line" },
];

// ── Credits Hero ───────────────────────────────────────────────────────────

function CreditsHero() {
  const { totalCreditsEarned, totalCreditsRedeemed, creditsFromTasks, creditsFromBadges,
          totalTasksCompleted, totalBadgesEarned, nextBadge, tasksToNextBadge } = achievementStats;
  const balance = totalCreditsEarned - totalCreditsRedeemed;
  const nextBadgeDef = getBadgeDef(nextBadge);
  const pct = nextBadgeDef
    ? Math.min(Math.round((totalTasksCompleted / nextBadgeDef.tasksRequired) * 100), 100)
    : 100;

  return (
    <div className="relative rounded-2xl p-6 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 40%, #ecfdf5 100%)" }}>
      <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #c4b5fd 0%, transparent 70%)" }} />
      <div className="absolute -bottom-10 left-1/3 w-52 h-52 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #6ee7b7 0%, transparent 70%)" }} />

      <div className="relative z-10 flex flex-col lg:flex-row gap-6">
        {/* Left: balance + breakdown */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-violet-100">
              <i className="ri-coin-fill text-violet-600 text-xs" />
            </div>
            <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest">Credits Balance</span>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-5xl font-black text-gray-900 leading-none">{balance}</span>
            <span className="text-sm text-gray-400 pb-1 font-medium">credits available</span>
          </div>

          {/* Breakdown — the key explainer */}
          <div className="bg-white/60 rounded-xl px-4 py-3 mb-4">
            <p className="text-xs font-semibold text-gray-600 mb-2">How your {totalCreditsEarned} credits were earned:</p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-100 shrink-0">
                    <i className="ri-checkbox-circle-fill text-emerald-500 text-xs" />
                  </div>
                  <span className="text-xs text-gray-600">
                    {totalTasksCompleted} tasks × {CREDITS_PER_TASK} credits each
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-600">+{creditsFromTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-amber-100 shrink-0">
                    <i className="ri-trophy-fill text-amber-500 text-xs" />
                  </div>
                  <span className="text-xs text-gray-600">
                    {totalBadgesEarned} badge{totalBadgesEarned !== 1 ? "s" : ""} unlocked — bonus credits
                  </span>
                </div>
                <span className="text-xs font-bold text-amber-600">+{creditsFromBadges}</span>
              </div>
              <div className="border-t border-gray-200 pt-1.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">Total earned</span>
                <span className="text-xs font-black text-gray-900">{totalCreditsEarned}</span>
              </div>
            </div>
          </div>

          {/* Progress to next badge */}
          {nextBadgeDef && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <i className={`${nextBadgeDef.icon} ${nextBadgeDef.color} text-sm`} />
                  <span className="text-xs text-gray-600 font-medium">
                    Next badge: <span className="font-bold">{nextBadgeDef.name}</span>
                  </span>
                </div>
                <span className="text-xs font-bold text-gray-500">
                  {totalTasksCompleted} / {nextBadgeDef.tasksRequired} tasks
                </span>
              </div>
              <div className="h-2.5 bg-white/60 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: "linear-gradient(90deg, #7c3aed, #10b981)" }} />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Complete {tasksToNextBadge} more task{tasksToNextBadge !== 1 ? "s" : ""} to unlock {nextBadgeDef.name} (+{nextBadgeDef.bonusCredits} bonus credits)
              </p>
            </div>
          )}
        </div>

        {/* Right: quick stats */}
        <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 lg:w-44 shrink-0">
          {[
            { label: "Tasks Done",    value: totalTasksCompleted, icon: "ri-checkbox-circle-fill", color: "text-emerald-500" },
            { label: "Badges Earned", value: totalBadgesEarned,   icon: "ri-medal-fill",           color: "text-amber-500" },
            { label: "Total Earned",  value: `${totalCreditsEarned} cr`, icon: "ri-coin-fill",     color: "text-violet-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/70 rounded-xl px-3 py-3 flex items-center gap-2.5">
              <div className="w-7 h-7 flex items-center justify-center shrink-0">
                <i className={`${stat.icon} ${stat.color} text-lg`} />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-gray-900 leading-none">{stat.value}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{stat.label}</p>
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
  const balance = achievementStats.totalCreditsEarned - achievementStats.totalCreditsRedeemed;
  const recentTasks = [...completedTaskHistory].reverse().slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <CreditsHero />

      {/* How it works — always visible explainer */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <i className="ri-information-line text-violet-500 text-base" />
          <h2 className="font-bold text-gray-900 text-sm">How Credits Work</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { step: "1", icon: "ri-checkbox-circle-fill", color: "text-emerald-500", bg: "bg-emerald-50", title: `Complete a task → +${CREDITS_PER_TASK} credits`, desc: "Every task you finish earns you 10 credits, instantly." },
            { step: "2", icon: "ri-trophy-fill",          color: "text-amber-500",   bg: "bg-amber-50",   title: "Reach a task milestone → badge unlocks", desc: "Hit 1, 5, 10, 25, 50, or 100 tasks to unlock a badge." },
            { step: "3", icon: "ri-gift-fill",            color: "text-violet-500",  bg: "bg-violet-50",  title: "Badge unlocked → bonus credits", desc: "Each badge awards extra credits on top of your task credits." },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className={`w-9 h-9 flex items-center justify-center rounded-xl ${s.bg} shrink-0`}>
                <i className={`${s.icon} ${s.color} text-lg`} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800 mb-0.5">{s.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent tasks */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <i className="ri-checkbox-circle-fill text-emerald-500 text-base" />
              <h2 className="font-bold text-gray-900 text-sm">Recent Tasks Completed</h2>
            </div>
            <button type="button" onClick={() => onTabChange("history")}
              className="text-xs text-violet-600 hover:underline cursor-pointer whitespace-nowrap">
              View all →
            </button>
          </div>
          <div className="flex flex-col gap-2.5">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-100 shrink-0">
                  <i className="ri-check-line text-emerald-600 text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{task.taskTitle}</p>
                  <p className="text-xs text-gray-400">{task.stepLabel} · {task.completedAt}</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 whitespace-nowrap">+{task.creditsEarned} cr</span>
              </div>
            ))}
          </div>
        </div>

        {/* Redeem preview */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <i className="ri-gift-fill text-violet-500 text-base" />
              <h2 className="font-bold text-gray-900 text-sm">Redeem Credits</h2>
            </div>
            <button type="button" onClick={() => onTabChange("credits")}
              className="text-xs text-violet-600 hover:underline cursor-pointer whitespace-nowrap">
              View all →
            </button>
          </div>
          <div className="flex flex-col gap-2.5">
            {redemptionOptions.slice(0, 3).map((opt) => {
              const canRedeem = balance >= opt.cost;
              return (
                <div key={opt.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
                  <div className={`w-9 h-9 flex items-center justify-center rounded-lg ${opt.iconBg} shrink-0`}>
                    <i className={`${opt.icon} ${opt.iconColor} text-base`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900">{opt.title}</p>
                    <p className="text-xs text-gray-400">{opt.cost} credits</p>
                  </div>
                  <button type="button"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                      canRedeem ? "bg-violet-600 text-white hover:bg-violet-700 cursor-pointer" : "bg-gray-100 text-gray-300 cursor-not-allowed"
                    }`} disabled={!canRedeem}>
                    {canRedeem ? "Redeem" : `Need ${opt.cost - balance}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* All badges overview */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <i className="ri-trophy-fill text-amber-500 text-base" />
            <h2 className="font-bold text-gray-900 text-sm">Badges</h2>
          </div>
          <button type="button" onClick={() => onTabChange("badges")}
            className="text-xs text-violet-600 hover:underline cursor-pointer whitespace-nowrap">
            View all →
          </button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {BADGE_DEFS.map((badge) => {
            const earned = isBadgeEarned(badge.id);
            return (
              <div key={badge.id}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center ${
                  earned ? `bg-gradient-to-br ${badge.glow} ${badge.border}` : "bg-gray-50 border-gray-100 opacity-40"
                }`}>
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl border ${
                  earned ? `${badge.bg} ${badge.border}` : "bg-gray-100 border-gray-200"
                }`}>
                  <i className={`${badge.icon} text-lg ${earned ? badge.color : "text-gray-300"}`} />
                </div>
                <p className={`text-[10px] font-bold leading-tight ${earned ? badge.color : "text-gray-300"}`}>{badge.name}</p>
                <span className={`text-[10px] ${earned ? "text-gray-500" : "text-gray-300"}`}>
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
  const { totalTasksCompleted } = achievementStats;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-2">
          <i className="ri-information-line text-violet-500 text-base" />
          <h2 className="font-bold text-gray-900 text-sm">Badge Rules</h2>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mb-1">
          Badges unlock automatically when your <strong>total tasks completed</strong> reaches a milestone.
          Each badge awards <strong>bonus credits</strong> on top of the credits you already earned from completing those tasks.
          Badges never reset — once earned, they&apos;re yours forever.
        </p>
        <p className="text-xs text-gray-400">
          You&apos;ve completed <strong className="text-gray-700">{totalTasksCompleted} tasks</strong> so far.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {BADGE_DEFS.map((badge) => {
          const earned = isBadgeEarned(badge.id);
          const earnedEntry = earnedBadgeHistory.find((e) => e.badgeId === badge.id);
          const pct = Math.min(Math.round((totalTasksCompleted / badge.tasksRequired) * 100), 100);

          return (
            <div key={badge.id}
              className={`relative rounded-2xl border p-5 overflow-hidden transition-all ${
                earned ? `bg-gradient-to-br ${badge.glow} ${badge.border}` : "bg-white border-gray-100"
              }`}>
              {earned && (
                <div className="absolute top-3 right-4 opacity-10 pointer-events-none">
                  <i className={`ri-sparkling-2-fill text-5xl ${badge.color}`} />
                </div>
              )}
              <div className="relative z-10 flex items-start gap-4">
                <div className={`w-14 h-14 flex items-center justify-center rounded-2xl border shrink-0 ${
                  earned ? `${badge.bg} ${badge.border}` : "bg-gray-100 border-gray-200"
                }`}>
                  <i className={`${badge.icon} text-2xl ${earned ? badge.color : "text-gray-300"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-bold ${earned ? badge.color : "text-gray-500"}`}>{badge.name}</p>
                      {earned && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                          Unlocked
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${
                        earned ? `${badge.bg} ${badge.color} ${badge.border}` : "bg-gray-100 text-gray-400 border-gray-200"
                      }`}>
                        Unlock at {badge.tasksRequired} task{badge.tasksRequired !== 1 ? "s" : ""}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${
                        earned ? `${badge.bg} ${badge.color} ${badge.border}` : "bg-gray-100 text-gray-400 border-gray-200"
                      }`}>
                        +{badge.bonusCredits} bonus credits
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{badge.description}</p>

                  {earned && earnedEntry ? (
                    <div className="flex items-center gap-2">
                      <i className="ri-calendar-check-line text-gray-400 text-xs" />
                      <p className="text-xs text-gray-400">
                        Unlocked on {earnedEntry.dateEarned} after completing {earnedEntry.tasksAtTime} task{earnedEntry.tasksAtTime !== 1 ? "s" : ""}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Your progress</span>
                        <span className="text-xs font-semibold text-gray-500">
                          {totalTasksCompleted} / {badge.tasksRequired} tasks
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-400 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
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
  const sorted = [...completedTaskHistory].reverse();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Tasks Completed",   value: completedTaskHistory.length,                                    icon: "ri-checkbox-circle-fill", color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Credits from Tasks",value: completedTaskHistory.reduce((s, t) => s + t.creditsEarned, 0), icon: "ri-coin-fill",            color: "text-violet-500",  bg: "bg-violet-50" },
          { label: "Badges Earned",     value: earnedBadgeHistory.length,                                      icon: "ri-trophy-fill",          color: "text-amber-500",   bg: "bg-amber-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${stat.bg} shrink-0`}>
              <i className={`${stat.icon} ${stat.color} text-lg`} />
            </div>
            <div>
              <p className="text-xl font-black text-gray-900 leading-none">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <i className="ri-list-check-3 text-gray-400 text-base" />
          <h2 className="font-bold text-gray-900 text-sm">All Completed Tasks</h2>
          <span className="text-xs text-gray-400 ml-auto">{completedTaskHistory.length} tasks</span>
        </div>
        <div className="flex flex-col gap-0 divide-y divide-gray-50">
          {sorted.map((task) => {
            // Check if a badge was earned on this date
            const badgeOnThisDate = earnedBadgeHistory.find(
              (e) => e.dateEarned === task.completedAt && e.tasksAtTime === (completedTaskHistory.length - sorted.indexOf(task))
            );
            return (
              <div key={task.id}>
                <div className="flex items-center gap-3 py-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 shrink-0">
                    <i className="ri-check-line text-emerald-500 text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{task.taskTitle}</p>
                    <p className="text-xs text-gray-400">{task.stepLabel} · {task.completedAt}</p>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 whitespace-nowrap shrink-0">+{task.creditsEarned} cr</span>
                </div>
                {badgeOnThisDate && (() => {
                  const bd = getBadgeDef(badgeOnThisDate.badgeId);
                  if (!bd) return null;
                  return (
                    <div className={`flex items-center gap-2 mx-3 mb-2 px-3 py-2 rounded-lg border ${bd.bg} ${bd.border}`}>
                      <i className={`${bd.icon} ${bd.color} text-sm`} />
                      <p className={`text-xs font-semibold ${bd.color}`}>
                        Badge unlocked: {bd.name} — +{badgeOnThisDate.bonusCreditsAwarded} bonus credits!
                      </p>
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Credits & Rewards Tab ──────────────────────────────────────────────────

function CreditsTab() {
  const balance = achievementStats.totalCreditsEarned - achievementStats.totalCreditsRedeemed;
  const [redeemed, setRedeemed] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-6">
      {/* Balance card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-violet-50 border border-violet-100">
            <i className="ri-coin-fill text-violet-600 text-xl" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Available Credits</p>
            <p className="text-3xl font-black text-gray-900 leading-none">{balance}</p>
          </div>
          <div className="ml-auto flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{achievementStats.totalTasksCompleted} tasks × {CREDITS_PER_TASK}</span>
              <span className="text-xs font-bold text-emerald-600">= +{achievementStats.creditsFromTasks}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{achievementStats.totalBadgesEarned} badge bonuses</span>
              <span className="text-xs font-bold text-amber-600">= +{achievementStats.creditsFromBadges}</span>
            </div>
            <div className="flex items-center gap-2 border-t border-gray-100 pt-1">
              <span className="text-xs font-semibold text-gray-600">Total earned</span>
              <span className="text-xs font-black text-gray-900">{achievementStats.totalCreditsEarned}</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          You earn <strong>{CREDITS_PER_TASK} credits per task</strong> completed. Unlock badges to earn <strong>bonus credits</strong> on top. Redeem credits below for real subscription perks.
        </p>
      </div>

      {/* Redemption options */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Redeem Your Credits</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {redemptionOptions.map((opt) => {
            const canRedeem = balance >= opt.cost;
            const isRedeemed = redeemed.includes(opt.id);
            return (
              <div key={opt.id}
                className={`bg-white rounded-2xl border p-5 flex flex-col gap-4 transition-all ${
                  isRedeemed ? "border-emerald-200 bg-emerald-50/30" : "border-gray-100 hover:border-gray-200"
                }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${opt.iconBg} shrink-0`}>
                    <i className={`${opt.icon} ${opt.iconColor} text-xl`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-bold text-gray-900">{opt.title}</p>
                      {opt.tag && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200 whitespace-nowrap">
                          {opt.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{opt.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <i className="ri-coin-fill text-amber-500 text-sm" />
                    <span className="text-sm font-bold text-gray-900">{opt.cost} credits</span>
                    {!canRedeem && !isRedeemed && (
                      <span className="text-xs text-gray-400 ml-1">({opt.cost - balance} more needed)</span>
                    )}
                  </div>
                  {isRedeemed ? (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-semibold">
                      <i className="ri-check-line" /> Redeemed!
                    </span>
                  ) : (
                    <button type="button"
                      onClick={() => canRedeem && setRedeemed((p) => [...p, opt.id])}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                        canRedeem ? "bg-violet-600 text-white hover:bg-violet-700 cursor-pointer" : "bg-gray-100 text-gray-300 cursor-not-allowed"
                      }`} disabled={!canRedeem}>
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
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <i className="ri-receipt-line text-gray-400 text-base" />
          <h2 className="font-bold text-gray-900 text-sm">Credits History</h2>
        </div>
        <div className="flex flex-col gap-0 divide-y divide-gray-50">
          {[...creditsLedger].reverse().map((entry) => {
            const badge = entry.badgeId ? getBadgeDef(entry.badgeId) : undefined;
            const isBadgeEntry = entry.type === "badge";
            return (
              <div key={entry.id} className="flex items-center gap-3 py-3">
                <div className={`w-8 h-8 flex items-center justify-center rounded-lg shrink-0 ${
                  isBadgeEntry ? (badge?.bg ?? "bg-amber-50") : "bg-emerald-50"
                }`}>
                  <i className={`${isBadgeEntry ? (badge?.icon ?? "ri-trophy-line") : "ri-checkbox-circle-line"} ${
                    isBadgeEntry ? (badge?.color ?? "text-amber-500") : "text-emerald-500"
                  } text-sm`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800">{entry.description}</p>
                  <p className="text-xs text-gray-400">{entry.date}</p>
                </div>
                <span className={`text-sm font-bold whitespace-nowrap shrink-0 ${
                  entry.type === "redeemed" ? "text-red-500" : isBadgeEntry ? "text-amber-600" : "text-emerald-600"
                }`}>
                  +{entry.amount} cr
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function AchievementsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const balance = achievementStats.totalCreditsEarned - achievementStats.totalCreditsRedeemed;

  return (
    <AppLayout>
      <div className="w-full min-h-screen bg-[#F7F8FA]">
        <div className="bg-[#F7F8FA] px-6 pt-8 pb-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <button type="button" onClick={() => navigate("/task-dashboard")}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer whitespace-nowrap mb-2">
                  <i className="ri-arrow-left-s-line text-sm" />
                  Task Dashboard
                </button>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Achievements &amp; Rewards</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Complete tasks to earn credits, unlock badges, and redeem perks.
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-100 shrink-0">
                <i className="ri-coin-fill text-amber-500 text-base" />
                <span className="text-sm font-bold text-gray-900">{balance}</span>
                <span className="text-xs text-gray-400">credits available</span>
              </div>
            </div>

            <div className="flex items-center gap-0 border-b border-gray-200">
              {TABS.map((tab) => (
                <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap -mb-px ${
                    activeTab === tab.id
                      ? "border-violet-600 text-violet-700"
                      : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
                  }`}>
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
