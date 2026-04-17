import { useState } from "react";

interface Mentor {
  id: number; name: string; role: string; company: string; domain: string;
  expertise: string[]; photo: string; matchScore: number; bio: string;
  sessions: number; rating: number; reviews: number;
  availability: string[]; responseTime: string; sessionRate: string;
}

interface MentorCardProps { mentor: Mentor; rank: number; onSchedule: (mentor: Mentor) => void; }

export default function MentorCard({ mentor, rank, onSchedule }: MentorCardProps) {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="rounded-xl border p-4 transition-all duration-200 flex gap-4"
      style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
      <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-1">
        <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>#{rank}</span>
      </div>
      <div className="w-12 h-12 flex items-center justify-center shrink-0">
        <img src={mentor.photo} alt={mentor.name} className="w-12 h-12 rounded-xl object-cover object-top" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{mentor.name}</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full border font-medium"
                style={{ backgroundColor: "var(--accent-light)", color: "var(--accent-text)", borderColor: "var(--accent-light)" }}>
                {mentor.domain}
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{mentor.role} · {mentor.company}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <i className="ri-star-fill text-xs" style={{ color: "var(--warning)" }} />
            <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{mentor.rating}</span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>({mentor.reviews})</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2">
          {mentor.expertise.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full border font-medium"
              style={{ backgroundColor: "var(--accent-light)", color: "var(--accent-text)", borderColor: "var(--accent-light)" }}>
              {tag}
            </span>
          ))}
          {mentor.expertise.length > 3 && (
            <span className="text-xs px-2 py-0.5" style={{ color: "var(--text-muted)" }}>+{mentor.expertise.length - 3}</span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {[
              { icon: "ri-calendar-check-line", text: `${mentor.sessions} sessions` },
              { icon: "ri-time-line",           text: mentor.responseTime },
              { icon: "ri-bar-chart-fill",      text: `${mentor.matchScore}% match` },
            ].map((m) => (
              <div key={m.text} className="flex items-center gap-1">
                <i className={`${m.icon} text-xs`} style={{ color: "var(--text-muted)" }} />
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{m.text}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{mentor.sessionRate}</span>
            <button type="button" onClick={() => { setClicked(true); onSchedule(mentor); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer whitespace-nowrap"
              style={{
                backgroundColor: clicked ? "var(--accent)" : "transparent",
                borderColor: clicked ? "var(--accent)" : "var(--border)",
                color: clicked ? "#fff" : "var(--text-secondary)",
              }}>
              <i className="ri-calendar-line text-xs" />
              Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
