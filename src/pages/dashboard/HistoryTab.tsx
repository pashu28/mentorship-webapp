import { useState } from "react";
import {
  completedSessions,
  pastTasks,
  menteeFeedbackHistory,
  savedResources,
} from "@/mocks/history";

type HistorySection = "sessions" | "tasks" | "streak" | "feedback" | "resources";

const sectionTabs: { id: HistorySection; label: string; icon: string }[] = [
  { id: "sessions", label: "Sessions", icon: "ri-video-line" },
  { id: "tasks", label: "Tasks", icon: "ri-checkbox-circle-line" },
  { id: "streak", label: "Streak & Badges", icon: "ri-medal-line" },
  { id: "feedback", label: "My Feedback", icon: "ri-chat-quote-line" },
  { id: "resources", label: "Resources", icon: "ri-bookmark-line" },
];

const criteriaLabels: Record<string, string> = {
  clarityOfGuidance: "Clarity of guidance",
  relevanceOfAdvice: "Relevance of advice",
  communicationStyle: "Communication style",
  helpfulnessOfResources: "Helpfulness of resources",
  overallSatisfaction: "Overall satisfaction",
};

// Badge definitions — new simplified rules
const BADGE_LEVELS = [
  {
    threshold: 5,
    name: "Week Warrior",
    icon: "ri-star-fill",
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
    glow: "from-amber-50 to-orange-50",
    reason: "Earned for completing 5 tasks in a row.",
  },
  {
    threshold: 7,
    name: "Momentum",
    icon: "ri-rocket-2-fill",
    color: "text-violet-500",
    bg: "bg-violet-50",
    border: "border-violet-200",
    glow: "from-violet-50 to-indigo-50",
    reason: "Earned for maintaining 7-task consistency.",
  },
  {
    threshold: 10,
    name: "Champion",
    icon: "ri-trophy-fill",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    glow: "from-emerald-50 to-teal-50",
    reason: "Earned for completing 10 or more tasks.",
  },
];

// Mock earned badge data — most recent first
const earnedBadges = [
  {
    id: "b3",
    threshold: 10,
    dateEarned: "Apr 10, 2026",
    streakAtTime: 10,
  },
  {
    id: "b2",
    threshold: 7,
    dateEarned: "Apr 5, 2026",
    streakAtTime: 7,
  },
  {
    id: "b1",
    threshold: 5,
    dateEarned: "Apr 2, 2026",
    streakAtTime: 5,
  },
];

const streakStats = {
  current: 10,
  longest: 12,
  totalCompleted: 24,
  lastResetDaysAgo: 8,
};

const taskTimeline = [
  { id: "tl1", text: "Complete 2 Figma tutorials (Auto Layout + Components)", date: "Apr 8", step: "Build Your Foundation", done: true },
  { id: "tl2", text: "Read NNGroup article on UX case study structure", date: "Apr 7", step: "Build Your Foundation", done: true },
  { id: "tl3", text: "Watch Google UX Certificate Module 1", date: "Apr 5", step: "Build Your Foundation", done: true },
  { id: "tl4", text: "Write the problem statement for your onboarding redesign", date: "Mar 30", step: "Document Your Work", done: true },
  { id: "tl5", text: "Export and organize all design artifacts from Figma", date: "Mar 28", step: "Document Your Work", done: true },
  { id: "tl6", text: "Draft the case study using NNGroup template", date: "Mar 25", step: "Document Your Work", done: false },
  { id: "tl7", text: "Reach out to 3 UX designers on LinkedIn", date: "Mar 20", step: "Expand Your Network", done: false },
];

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "md" ? "text-base" : "text-xs";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <i key={s} className={`ri-star-fill ${cls} ${s <= rating ? "text-amber-400" : "text-gray-200"}`} />
      ))}
    </div>
  );
}

function SessionsSection() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm text-gray-500">{completedSessions.length} sessions completed</p>
        <span className="text-xs text-violet-600 font-medium bg-violet-50 px-2.5 py-1 rounded-full">
          {completedSessions.reduce((acc, s) => acc + parseInt(s.duration), 0)} min total
        </span>
      </div>
      {completedSessions.map((session) => (
        <div key={session.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div
            className="p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
            onClick={() => setExpanded(expanded === session.id ? null : session.id)}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                <img src={session.mentorPhoto} alt={session.mentor} className="w-full h-full object-cover object-top" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{session.topic}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{session.mentor} · {session.date} · {session.duration}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StarRating rating={session.rating} />
                    <i className={`ri-arrow-down-s-line text-gray-400 transition-transform ${expanded === session.id ? "rotate-180" : ""}`} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {session.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {expanded === session.id && (
            <div className="px-5 pb-5 border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-700 leading-relaxed mb-4">{session.summary}</p>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Resources from this session</p>
                <div className="flex flex-col gap-1.5">
                  {session.resources.map((r) => (
                    <div key={r} className="flex items-center gap-2 text-sm text-gray-700">
                      <i className="ri-link text-violet-400 text-xs" />
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TaskTimeline() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-50">
          <i className="ri-time-line text-violet-500 text-base" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">Activity Timeline</p>
          <p className="text-xs text-gray-400">Recent task history</p>
        </div>
      </div>
      <div className="relative flex flex-col gap-0">
        {taskTimeline.map((item, idx) => (
          <div key={item.id} className="flex gap-4 relative">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 flex items-center justify-center rounded-full shrink-0 z-10 ${
                item.done ? "bg-emerald-100" : "bg-gray-100"
              }`}>
                <i className={`text-xs ${item.done ? "ri-check-line text-emerald-600" : "ri-time-line text-gray-400"}`} />
              </div>
              {idx < taskTimeline.length - 1 && (
                <div className="w-px flex-1 bg-gray-100 my-1" style={{ minHeight: "20px" }} />
              )}
            </div>
            <div className={`flex-1 ${idx === taskTimeline.length - 1 ? "pb-0" : "pb-4"}`}>
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm leading-snug ${item.done ? "text-gray-700" : "text-gray-400"}`}>
                  {item.text}
                </p>
                <span className="text-xs text-gray-400 shrink-0 mt-0.5">{item.date}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400">{item.step}</span>
                {item.done
                  ? <span className="text-xs text-emerald-500 font-medium">Completed</span>
                  : <span className="text-xs text-amber-500 font-medium">In progress</span>
                }
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TasksSection() {
  const completed = pastTasks.filter((t) => t.status === "completed");
  const inProgress = pastTasks.filter((t) => t.status === "in-progress");
  const pending = pastTasks.filter((t) => t.status === "pending");

  const statusConfig = {
    completed: { label: "Completed", icon: "ri-checkbox-circle-fill", color: "text-emerald-500", bg: "bg-emerald-50" },
    "in-progress": { label: "In Progress", icon: "ri-time-line", color: "text-amber-500", bg: "bg-amber-50" },
    pending: { label: "Pending", icon: "ri-circle-line", color: "text-gray-400", bg: "bg-gray-50" },
  };

  const groups = [
    { key: "completed" as const, tasks: completed },
    { key: "in-progress" as const, tasks: inProgress },
    { key: "pending" as const, tasks: pending },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Task list by status */}
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">All Tasks</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Completed", count: completed.length, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "In Progress", count: inProgress.length, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Pending", count: pending.length, color: "text-gray-500", bg: "bg-gray-50" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} rounded-xl p-4 text-center`}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
        {groups.map(({ key, tasks }) => tasks.length > 0 && (
          <div key={key}>
            <div className="flex items-center gap-2 mb-3">
              <i className={`${statusConfig[key].icon} ${statusConfig[key].color}`} />
              <p className="text-sm font-semibold text-gray-700">{statusConfig[key].label}</p>
              <span className="text-xs text-gray-400">({tasks.length})</span>
            </div>
            <div className="flex flex-col gap-2">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3">
                  <div className={`w-5 h-5 flex items-center justify-center rounded shrink-0 mt-0.5 ${statusConfig[key].bg}`}>
                    <i className={`${statusConfig[key].icon} ${statusConfig[key].color} text-xs`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${key === "completed" ? "text-gray-500 line-through" : "text-gray-800"}`}>{task.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">{task.step}</span>
                      {task.completedDate && (
                        <>
                          <span className="text-gray-200">·</span>
                          <span className="text-xs text-emerald-500">{task.completedDate}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StreakAndBadgesSection() {
  const { current, longest, totalCompleted } = streakStats;

  // Next badge the mentee hasn't earned yet
  const nextBadge = BADGE_LEVELS.find((b) => current < b.threshold);
  const progressPct = nextBadge ? Math.round((current / nextBadge.threshold) * 100) : 100;

  return (
    <div className="flex flex-col gap-5">

      {/* Streak stat bar */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-50">
            <i className="ri-fire-fill text-orange-500 text-lg" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Task Streak</p>
            <p className="text-xs text-gray-400">Your consistency over time</p>
          </div>
          <span className="ml-auto text-xs font-semibold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
            {current} task streak
          </span>
        </div>
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          {[
            { label: "Current streak", value: current, unit: "tasks", icon: "ri-fire-fill", color: "text-orange-500", bg: "bg-orange-50" },
            { label: "Longest streak", value: longest, unit: "tasks", icon: "ri-trophy-fill", color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Total completed", value: totalCompleted, unit: "tasks", icon: "ri-checkbox-circle-fill", color: "text-emerald-500", bg: "bg-emerald-50" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center py-5 px-4 gap-1.5">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full ${stat.bg}`}>
                <i className={`${stat.icon} ${stat.color} text-sm`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 leading-none">{stat.value}</p>
              <p className="text-xs text-gray-500 text-center">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Progress to next badge */}
        {nextBadge && (
          <div className="px-5 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">
                Next badge:&nbsp;
                <span className={`font-semibold ${nextBadge.color}`}>{nextBadge.name}</span>
              </span>
              <span className="text-xs text-gray-400">{current}/{nextBadge.threshold} tasks</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-400 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">{nextBadge.reason.replace("Earned for", "Complete")}</p>
          </div>
        )}
        {!nextBadge && (
          <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-2">
            <i className="ri-checkbox-circle-fill text-emerald-500 text-base" />
            <p className="text-xs text-emerald-700 font-medium">All badges unlocked — you&apos;re a Champion!</p>
          </div>
        )}
      </div>

      {/* Badge Achievement Cards — most recent first */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Badge Achievements</p>
        <div className="flex flex-col gap-3">
          {earnedBadges.map((earned) => {
            const badge = BADGE_LEVELS.find((b) => b.threshold === earned.threshold);
            if (!badge) return null;
            return (
              <div
                key={earned.id}
                className={`relative bg-gradient-to-r ${badge.glow} rounded-2xl border ${badge.border} p-5 overflow-hidden`}
              >
                {/* Subtle sparkle accent */}
                <div className="absolute top-3 right-4 opacity-10">
                  <i className={`ri-sparkling-2-fill text-5xl ${badge.color}`} />
                </div>

                <div className="flex items-start gap-4 relative z-10">
                  {/* Badge icon */}
                  <div className={`w-14 h-14 flex items-center justify-center rounded-2xl ${badge.bg} border ${badge.border} shrink-0`}>
                    <i className={`${badge.icon} text-2xl ${badge.color}`} />
                  </div>

                  {/* Badge info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`text-base font-bold ${badge.color}`}>{badge.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Earned on {earned.dateEarned} &nbsp;·&nbsp; {earned.streakAtTime}-task streak
                        </p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge.bg} ${badge.color} border ${badge.border} whitespace-nowrap shrink-0`}>
                        {earned.streakAtTime} tasks
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">{badge.reason}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streak timeline */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Streak Timeline</p>
        <TaskTimeline />
      </div>
    </div>
  );
}

function FeedbackSection() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const avgRating = (
    menteeFeedbackHistory.reduce((sum, f) => sum + f.overallRating, 0) / menteeFeedbackHistory.length
  ).toFixed(1);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-6">
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-900">{avgRating}</p>
          <StarRating rating={Math.round(parseFloat(avgRating))} size="md" />
          <p className="text-xs text-gray-400 mt-1">avg rating</p>
        </div>
        <div className="w-px h-12 bg-gray-100" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800 mb-1">Your session ratings</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            You&apos;ve rated {menteeFeedbackHistory.length} sessions. Your feedback helps mentors improve and keeps the quality of mentoring high.
          </p>
        </div>
      </div>

      {menteeFeedbackHistory.map((fb) => (
        <div key={fb.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div
            className="p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
            onClick={() => setExpanded(expanded === fb.id ? null : fb.id)}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                <img src={fb.mentorPhoto} alt={fb.mentor} className="w-full h-full object-cover object-top" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{fb.sessionTopic}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{fb.mentor} · {fb.date}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StarRating rating={fb.overallRating} />
                    <i className={`ri-arrow-down-s-line text-gray-400 transition-transform ${expanded === fb.id ? "rotate-180" : ""}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {expanded === fb.id && (
            <div className="px-5 pb-5 border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Criteria breakdown</p>
              <div className="flex flex-col gap-2.5 mb-4">
                {Object.entries(fb.criteria).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{criteriaLabels[key]}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <i key={s} className={`ri-star-fill text-xs ${s <= val ? "text-amber-400" : "text-gray-200"}`} />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-3">{val}</span>
                    </div>
                  </div>
                ))}
              </div>
              {fb.comments && (
                <div className="bg-gray-50 rounded-xl p-4 mb-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Your comments</p>
                  <p className="text-sm text-gray-700 leading-relaxed italic">&ldquo;{fb.comments}&rdquo;</p>
                </div>
              )}
              {fb.changeRequest && (
                <div className="bg-amber-50 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <i className="ri-edit-line text-amber-500 text-xs" />
                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Requested for next time</p>
                  </div>
                  <p className="text-sm text-amber-800 leading-relaxed">{fb.changeRequest}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ResourcesSection() {
  const grouped = savedResources.reduce<Record<string, typeof savedResources>>((acc, r) => {
    if (!acc[r.session]) acc[r.session] = [];
    acc[r.session].push(r);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{savedResources.length} resources saved across {Object.keys(grouped).length} sessions</p>
      </div>
      {Object.entries(grouped).map(([session, resources]) => (
        <div key={session}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{session}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {resources.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3 hover:border-violet-200 transition-colors cursor-pointer">
                <div className={`w-9 h-9 flex items-center justify-center rounded-lg ${r.color} shrink-0`}>
                  <i className={`${r.icon} text-base`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 leading-snug">{r.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{r.url}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{r.savedDate}</p>
                </div>
                <i className="ri-external-link-line text-gray-300 text-sm shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HistoryTab() {
  const [activeSection, setActiveSection] = useState<HistorySection>("sessions");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {sectionTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSection(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeSection === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <i className={`${tab.icon} text-sm`} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeSection === "sessions" && <SessionsSection />}
      {activeSection === "tasks" && <TasksSection />}
      {activeSection === "streak" && <StreakAndBadgesSection />}
      {activeSection === "feedback" && <FeedbackSection />}
      {activeSection === "resources" && <ResourcesSection />}
    </div>
  );
}
