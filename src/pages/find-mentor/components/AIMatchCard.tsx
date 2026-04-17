import { useState } from "react";

interface AIMatchMentor {
  id: number; name: string; role: string; company: string; domain: string;
  expertise: string[]; photo: string; matchScore: number; matchReasons: string[];
  bio: string; sessions: number; rating: number; reviews: number;
  availability: string[]; responseTime: string; sessionRate: string;
}

interface AIMatchCardProps { mentor: AIMatchMentor; rank: number; onSchedule: (mentor: AIMatchMentor) => void; }

export default function AIMatchCard({ mentor, rank, onSchedule }: AIMatchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [clicked, setClicked] = useState(false);

  const rankLabel = rank === 1 ? "Best Match" : rank === 2 ? "2nd Match" : "3rd Match";

  return (
    <div className="rounded-2xl border overflow-hidden transition-all duration-200"
      style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b"
        style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-sparkling-2-fill text-sm" style={{ color: "var(--warning)" }} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            AI Match #{rank} — {rankLabel}
          </span>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: "var(--success-light)", color: "var(--success)" }}>
          {mentor.matchScore}% match
        </span>
      </div>

      <div className="p-5">
        <div className="flex gap-4">
          <div className="w-16 h-16 flex items-center justify-center shrink-0">
            <img src={mentor.photo} alt={mentor.name} className="w-16 h-16 rounded-xl object-cover object-top" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>{mentor.name}</h3>
                <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {mentor.role} <span className="mx-1" style={{ color: "var(--border)" }}>·</span> {mentor.company}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <i className="ri-star-fill text-sm" style={{ color: "var(--warning)" }} />
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{mentor.rating}</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>({mentor.reviews})</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {mentor.expertise.slice(0, 4).map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full border font-medium"
                  style={{ backgroundColor: "var(--accent-light)", color: "var(--accent-text)", borderColor: "var(--accent-light)" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1.5">
          {mentor.matchReasons.map((reason) => (
            <div key={reason} className="flex items-center gap-2">
              <div className="w-4 h-4 flex items-center justify-center shrink-0">
                <i className="ri-check-line text-sm" style={{ color: "var(--success)" }} />
              </div>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{reason}</span>
            </div>
          ))}
        </div>

        {expanded && (
          <p className="mt-3 text-sm leading-relaxed border-t pt-3" style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}>
            {mentor.bio}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <i className="ri-calendar-check-line text-sm" style={{ color: "var(--text-muted)" }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{mentor.sessions} sessions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <i className="ri-time-line text-sm" style={{ color: "var(--text-muted)" }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Responds {mentor.responseTime}</span>
            </div>
            <button type="button" onClick={() => setExpanded((e) => !e)}
              className="text-xs transition-colors cursor-pointer whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
              {expanded ? "Less" : "More info"}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{mentor.sessionRate}</span>
            <button type="button" onClick={() => { setClicked(true); onSchedule(mentor); }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer whitespace-nowrap"
              style={{
                backgroundColor: clicked ? "var(--accent)" : "transparent",
                borderColor: clicked ? "var(--accent)" : "var(--border)",
                color: clicked ? "#fff" : "var(--text-secondary)",
              }}>
              <i className="ri-calendar-line text-xs" />
              Schedule Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
