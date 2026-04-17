import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/feature/AppLayout";
import { scheduledSessions } from "@/mocks/sessions";
import { useTheme } from "@/hooks/useTheme";

const STATUS_CONFIG = {
  upcoming: {
    label: "Upcoming",
    dotColor: "var(--accent)",
    textColor: "var(--accent-text)",
    bgVar: "var(--accent-light)",
    borderVar: "var(--accent-light)",
    pulse: false,
  },
  today: {
    label: "Today",
    dotColor: "var(--success)",
    textColor: "var(--success)",
    bgVar: "var(--success-light)",
    borderVar: "var(--success-light)",
    pulse: true,
  },
  past: {
    label: "Completed",
    dotColor: "var(--text-muted)",
    textColor: "var(--text-muted)",
    bgVar: "var(--bg-elevated)",
    borderVar: "var(--border)",
    pulse: false,
  },
};

type FilterType = "all" | "upcoming" | "today" | "past";

export default function SessionDashboardPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const bookedMentor = useMemo(() => {
    try {
      const raw = localStorage.getItem("mentorAI_bookedMentor");
      return raw
        ? (JSON.parse(raw) as {
            name: string;
            role: string;
            company: string;
            photo: string;
            date: string;
            time: string;
          })
        : null;
    } catch {
      return null;
    }
  }, []);

  const filtered = scheduledSessions.filter((s) =>
    filter === "all" ? true : s.status === filter
  );

  const rawTodaySession = scheduledSessions.find((s) => s.status === "today");
  const todaySession =
    rawTodaySession && bookedMentor
      ? {
          ...rawTodaySession,
          mentorName: bookedMentor.name,
          mentorRole: bookedMentor.role,
          mentorCompany: bookedMentor.company,
          mentorPhoto: bookedMentor.photo,
          time: bookedMentor.time || rawTodaySession.time,
        }
      : rawTodaySession;

  const handleJoin = (session: (typeof scheduledSessions)[0]) => {
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

        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            My Sessions
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            All your mentoring sessions, sorted by date.
          </p>
        </div>

        {/* ── Today's session banner ── */}
        {todaySession && (
          <div
            className="relative rounded-2xl p-6 mb-8 overflow-hidden border"
            style={{
              background: isDark
                ? "linear-gradient(135deg, var(--accent-light) 0%, var(--bg-elevated) 100%)"
                : "linear-gradient(135deg, #EDE9F8 0%, #E8EEF8 50%, #E2F4EE 100%)",
              borderColor: isDark ? "var(--accent-light)" : "rgba(180,170,230,0.45)",
              boxShadow: isDark ? "none" : "0 0 0 1px rgba(180,170,230,0.25), 0 4px 16px rgba(160,150,220,0.1)",
            }}
          >
            {/* Top highlight line */}
            <div
              className="absolute top-0 left-6 right-6 h-px"
              style={{ background: "linear-gradient(to right, transparent, var(--accent-text), transparent)", opacity: 0.4 }}
            />
            {/* Left accent bar */}
            <div
              className="absolute left-0 top-4 bottom-4 w-1 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={todaySession.mentorPhoto}
                    alt={todaySession.mentorName}
                    className="w-14 h-14 rounded-full object-cover object-top border-2"
                    style={{ borderColor: "var(--bg-surface)" }}
                  />
                  <span
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2"
                    style={{ backgroundColor: "var(--accent)", borderColor: "var(--bg-surface)" }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "var(--accent-text)" }}
                    >
                      Today&apos;s Session
                    </span>
                    <span
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border"
                      style={{
                        backgroundColor: "var(--accent-light)",
                        color: "var(--accent-text)",
                        borderColor: "var(--accent-light)",
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse inline-block"
                        style={{ backgroundColor: "var(--accent)" }}
                      />
                      Live Soon
                    </span>
                  </div>
                  <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                    {todaySession.mentorName}
                  </h2>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {todaySession.mentorRole} · {todaySession.mentorCompany}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs mb-0.5" style={{ color: "var(--accent-text)" }}>Time</p>
                  <p className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
                    {todaySession.time}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs mb-0.5" style={{ color: "var(--accent-text)" }}>Duration</p>
                  <p className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
                    {todaySession.duration}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleJoin(todaySession)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all cursor-pointer whitespace-nowrap"
                  style={{ backgroundColor: "var(--accent)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent-hover)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent)")}
                >
                  <i className="ri-video-line" />
                  Join Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Filter tabs ── */}
        <div
          className="flex items-center gap-1 mb-6 rounded-full p-1 w-fit"
          style={{ backgroundColor: "var(--bg-elevated)" }}
        >
          {(["all", "upcoming", "today", "past"] as FilterType[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap capitalize"
              style={{
                backgroundColor: filter === f ? "var(--bg-surface)" : "transparent",
                color: filter === f ? "var(--text-primary)" : "var(--text-muted)",
              }}
            >
              {f === "all" ? "All Sessions" : f === "today" ? "Today" : f === "upcoming" ? "Upcoming" : "Past"}
            </button>
          ))}
        </div>

        {/* ── Session cards ── */}
        <div className="flex flex-col gap-4">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-16 text-center">
              <div
                className="w-14 h-14 flex items-center justify-center rounded-full mb-3"
                style={{ backgroundColor: "var(--bg-elevated)" }}
              >
                <i className="ri-calendar-line text-2xl" style={{ color: "var(--text-muted)" }} />
              </div>
              <p className="font-medium" style={{ color: "var(--text-secondary)" }}>
                No sessions found
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                Try a different filter or book a new session.
              </p>
            </div>
          )}

          {filtered.map((session) => {
            const cfg = STATUS_CONFIG[session.status];
            const isExpanded = expandedId === session.id;

            return (
              <div
                key={session.id}
                className="rounded-2xl border overflow-hidden transition-all duration-200"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border)",
                }}
              >
                {/* Card main row */}
                <div className="flex items-center gap-5 p-5">

                  {/* Date block */}
                  <div
                    className="flex flex-col items-center justify-center w-14 h-14 rounded-xl border shrink-0"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <span
                      className="text-xs font-semibold uppercase"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {session.month}
                    </span>
                    <span
                      className="text-xl font-black leading-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {session.day}
                    </span>
                  </div>

                  {/* Mentor info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img
                      src={session.mentorPhoto}
                      alt={session.mentorName}
                      className="w-10 h-10 rounded-full object-cover object-top border shrink-0"
                      style={{ borderColor: "var(--border)" }}
                    />
                    <div className="min-w-0">
                      <p
                        className="font-semibold text-sm truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {session.mentorName}
                      </p>
                      <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                        {session.mentorRole} · {session.mentorCompany}
                      </p>
                    </div>
                  </div>

                  {/* Session meta */}
                  <div className="hidden md:flex items-center gap-6 shrink-0">
                    {[
                      { label: "Time", value: session.time },
                      { label: "Duration", value: session.duration },
                      { label: "Topic", value: session.topic },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
                        <p
                          className="text-sm font-semibold max-w-[140px] truncate"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Status + actions */}
                  <div className="flex items-center gap-3 shrink-0 ml-auto">
                    {/* Status badge */}
                    <span
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium"
                      style={{
                        backgroundColor: cfg.bgVar,
                        color: cfg.textColor,
                        borderColor: cfg.borderVar,
                      }}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${cfg.pulse ? "animate-pulse" : ""}`}
                        style={{ backgroundColor: cfg.dotColor }}
                      />
                      {cfg.label}
                    </span>

                    {/* Action buttons */}
                    {session.status === "today" && (
                      <button
                        type="button"
                        onClick={() => handleJoin(session)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                        style={{ backgroundColor: "var(--accent)" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent-hover)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent)")}
                      >
                        <i className="ri-video-line" />
                        Join
                      </button>
                    )}

                    {session.status === "upcoming" && (
                      <button
                        type="button"
                        onClick={() => handleJoin(session)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
                        style={{
                          borderColor: "var(--accent-light)",
                          color: "var(--accent-text)",
                          backgroundColor: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent-light)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                        }}
                      >
                        <i className="ri-settings-3-line" />
                        Pre-Join
                      </button>
                    )}

                    {session.status === "past" && (
                      <button
                        type="button"
                        onClick={() => navigate("/session-summary")}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
                        style={{
                          borderColor: "var(--border)",
                          color: "var(--text-muted)",
                          backgroundColor: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-elevated)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                        }}
                      >
                        <i className="ri-file-list-3-line" />
                        Summary
                      </button>
                    )}

                    {/* Expand toggle */}
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : session.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer"
                      style={{ color: "var(--text-muted)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-elevated)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                      }}
                    >
                      <i className={`${isExpanded ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} text-base`} />
                    </button>
                  </div>
                </div>

                {/* ── Expanded agenda ── */}
                {isExpanded && (
                  <div
                    className="border-t px-5 py-4"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "var(--bg-elevated)",
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Agenda */}
                      <div>
                        <p
                          className="text-xs font-semibold uppercase tracking-wider mb-3"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Session Agenda
                        </p>
                        <ol className="flex flex-col gap-2">
                          {session.agenda.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span
                                className="w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold shrink-0 mt-0.5"
                                style={{
                                  backgroundColor: "var(--accent-light)",
                                  color: "var(--accent-text)",
                                }}
                              >
                                {i + 1}
                              </span>
                              <span className="text-sm" style={{ color: "var(--text-body, var(--text-secondary))" }}>
                                {item}
                              </span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Prep notes */}
                      <div>
                        <p
                          className="text-xs font-semibold uppercase tracking-wider mb-3"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Prep Notes
                        </p>
                        <div className="flex flex-col gap-2">
                          {session.prepNotes.map((note, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <div
                                className="w-4 h-4 flex items-center justify-center rounded shrink-0 mt-0.5"
                                style={{ backgroundColor: "var(--warning-light)" }}
                              >
                                <i className="ri-lightbulb-line text-xs" style={{ color: "var(--warning)" }} />
                              </div>
                              <p className="text-sm" style={{ color: "var(--text-body, var(--text-secondary))" }}>
                                {note}
                              </p>
                            </div>
                          ))}
                        </div>
                        {session.status !== "past" && (
                          <button
                            type="button"
                            onClick={() => handleJoin(session)}
                            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                            style={{ backgroundColor: "var(--accent)" }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent-hover)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent)")}
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

        {/* ── Book new session CTA ── */}
        <div className="mt-8 flex items-center justify-center">
          <button
            type="button"
            onClick={() => navigate("/find-mentor")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-dashed text-sm font-medium transition-all cursor-pointer whitespace-nowrap"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-muted)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--accent-text)";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent-light)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            }}
          >
            <i className="ri-add-line" />
            Book a new session
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
