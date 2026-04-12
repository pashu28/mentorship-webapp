import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/feature/AppLayout";
import { scheduledSessions } from "@/mocks/sessions";

const STATUS_CONFIG = {
  upcoming: { label: "Upcoming", bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500" },
  today:    { label: "Today",    bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  past:     { label: "Completed", bg: "bg-gray-50",  text: "text-gray-500",   border: "border-gray-200",   dot: "bg-gray-400" },
};

type FilterType = "all" | "upcoming" | "today" | "past";

export default function SessionDashboardPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = scheduledSessions.filter((s) =>
    filter === "all" ? true : s.status === filter
  );

  const todaySession = scheduledSessions.find((s) => s.status === "today");

  const handleJoin = (session: typeof scheduledSessions[0]) => {
    navigate("/meeting-lobby", {
      state: {
        mentorName: session.mentorName,
        mentorRole: session.mentorRole,
        mentorCompany: session.mentorCompany,
        mentorPhoto: session.mentorPhoto,
        date: session.dateLabel,
        time: session.time,
        sessionId: session.id,
        agenda: session.agenda,
      },
    });
  };

  return (
    <AppLayout>
      <div className="px-6 py-8 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Sessions</h1>
          <p className="text-gray-400 text-sm mt-1">All your mentoring sessions, sorted by date.</p>
        </div>

        {/* Today's session banner */}
        {todaySession && (
          <div
            className="relative rounded-2xl p-6 mb-8 overflow-hidden border border-violet-100"
            style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #e0e7ff 100%)" }}
          >
            {/* Top highlight line */}
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-violet-300/50 to-transparent" />
            {/* Left accent bar */}
            <div className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-violet-500" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={todaySession.mentorPhoto}
                    alt={todaySession.mentorName}
                    className="w-14 h-14 rounded-full object-cover object-top border-2 border-white ring-2 ring-violet-200"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-violet-500 border-2 border-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">Today's Session</span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-100 text-violet-600 text-xs font-medium border border-violet-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse inline-block" />
                      Live Soon
                    </span>
                  </div>
                  <h2 className="text-gray-900 font-bold text-lg">{todaySession.mentorName}</h2>
                  <p className="text-gray-500 text-sm">{todaySession.mentorRole} · {todaySession.mentorCompany}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-violet-400 text-xs mb-0.5">Time</p>
                  <p className="text-gray-800 font-bold text-base">{todaySession.time}</p>
                </div>
                <div className="text-center">
                  <p className="text-violet-400 text-xs mb-0.5">Duration</p>
                  <p className="text-gray-800 font-bold text-base">{todaySession.duration}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleJoin(todaySession)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 transition-all cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-video-line" />
                  Join Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex items-center gap-1 mb-6 bg-gray-100 rounded-full p-1 w-fit">
          {(["all", "upcoming", "today", "past"] as FilterType[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap capitalize ${
                filter === f ? "bg-white text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f === "all" ? "All Sessions" : f === "today" ? "Today" : f === "upcoming" ? "Upcoming" : "Past"}
            </button>
          ))}
        </div>

        {/* Session cards */}
        <div className="flex flex-col gap-4">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-3">
                <i className="ri-calendar-line text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-500 font-medium">No sessions found</p>
              <p className="text-gray-400 text-sm mt-1">Try a different filter or book a new session.</p>
            </div>
          )}

          {filtered.map((session) => {
            const cfg = STATUS_CONFIG[session.status];
            const isExpanded = expandedId === session.id;

            return (
              <div
                key={session.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-200"
              >
                {/* Card main row */}
                <div className="flex items-center gap-5 p-5">
                  {/* Date block */}
                  <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 shrink-0">
                    <span className="text-xs font-semibold text-gray-400 uppercase">{session.month}</span>
                    <span className="text-xl font-black text-gray-900 leading-tight">{session.day}</span>
                  </div>

                  {/* Mentor info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img
                      src={session.mentorPhoto}
                      alt={session.mentorName}
                      className="w-10 h-10 rounded-full object-cover object-top border border-gray-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{session.mentorName}</p>
                      <p className="text-xs text-gray-400 truncate">{session.mentorRole} · {session.mentorCompany}</p>
                    </div>
                  </div>

                  {/* Session meta */}
                  <div className="hidden md:flex items-center gap-6 shrink-0">
                    <div>
                      <p className="text-xs text-gray-400">Time</p>
                      <p className="text-sm font-semibold text-gray-800">{session.time}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Duration</p>
                      <p className="text-sm font-semibold text-gray-800">{session.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Topic</p>
                      <p className="text-sm font-semibold text-gray-800 max-w-[140px] truncate">{session.topic}</p>
                    </div>
                  </div>

                  {/* Status + actions */}
                  <div className="flex items-center gap-3 shrink-0 ml-auto">
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${session.status === "today" ? "animate-pulse" : ""}`} />
                      {cfg.label}
                    </span>

                    {session.status === "today" && (
                      <button
                        type="button"
                        onClick={() => handleJoin(session)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-all cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-video-line" />
                        Join
                      </button>
                    )}

                    {session.status === "upcoming" && (
                      <button
                        type="button"
                        onClick={() => handleJoin(session)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-violet-200 text-violet-600 text-xs font-medium hover:bg-violet-50 transition-all cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-settings-3-line" />
                        Pre-Join
                      </button>
                    )}

                    {session.status === "past" && (
                      <button
                        type="button"
                        onClick={() => navigate("/session-summary")}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-file-list-3-line" />
                        Summary
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : session.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-all cursor-pointer"
                    >
                      <i className={`${isExpanded ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} text-base`} />
                    </button>
                  </div>
                </div>

                {/* Expanded agenda */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Session Agenda</p>
                        <ol className="flex flex-col gap-2">
                          {session.agenda.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <span className="text-sm text-gray-600">{item}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Prep Notes</p>
                        <div className="flex flex-col gap-2">
                          {session.prepNotes.map((note, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <div className="w-4 h-4 flex items-center justify-center rounded bg-amber-100 shrink-0 mt-0.5">
                                <i className="ri-lightbulb-line text-amber-600 text-xs" />
                              </div>
                              <p className="text-sm text-gray-600">{note}</p>
                            </div>
                          ))}
                        </div>
                        {session.status !== "past" && (
                          <button
                            type="button"
                            onClick={() => handleJoin(session)}
                            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-all cursor-pointer whitespace-nowrap"
                          >
                            <i className="ri-settings-3-line" />
                            Open Pre-Join Settings
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Book new session CTA */}
        <div className="mt-8 flex items-center justify-center">
          <button
            type="button"
            onClick={() => navigate("/find-mentor")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm font-medium hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-all cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line" />
            Book a new session
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
