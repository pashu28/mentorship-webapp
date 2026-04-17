const FEEDBACK = [
  {
    id: 1, mentor: "Sarah Chen", role: "Senior UX Designer · Google", avatar: "S", avatarBg: "#E11D48",
    sessionDate: "Apr 8, 2026", sessionTopic: "Portfolio Review & UX Case Study Walkthrough", rating: 5,
    comment: "Sarah was incredibly insightful. She gave me very specific, actionable feedback on my case studies and helped me understand what hiring managers actually look for. The session went over time because she was so thorough — really appreciated that.",
    tags: ["Portfolio", "Case Studies", "Career Advice"],
  },
  {
    id: 2, mentor: "Marcus Williams", role: "Product Manager · Stripe", avatar: "M", avatarBg: "#D97706",
    sessionDate: "Mar 22, 2026", sessionTopic: "Breaking into Product Management", rating: 4,
    comment: "Great session overall. Marcus shared his own transition story which was really motivating. Would have liked a bit more time on the tactical side — resume tips and interview prep — but the strategic framing was excellent.",
    tags: ["Career Transition", "Product Strategy", "Interview Prep"],
  },
  {
    id: 3, mentor: "Priya Nair", role: "UX Researcher · Airbnb", avatar: "P", avatarBg: "#0D9488",
    sessionDate: "Mar 5, 2026", sessionTopic: "User Research Methods & Study Design", rating: 5,
    comment: "Priya is an exceptional mentor. She walked me through her entire research process at Airbnb and helped me design a proper usability study for my portfolio project. Super knowledgeable and very patient with my questions.",
    tags: ["User Research", "Usability Testing", "Study Design"],
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <div key={s} className="w-4 h-4 flex items-center justify-center">
          <i className={`${s <= rating ? "ri-star-fill" : "ri-star-line"} text-sm`}
            style={{ color: s <= rating ? "var(--warning)" : "var(--border)" }} />
        </div>
      ))}
    </div>
  );
}

export default function FeedbackGiven() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{FEEDBACK.length} reviews given</p>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ backgroundColor: "var(--warning-light)" }}>
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-star-fill text-sm" style={{ color: "var(--warning)" }} />
          </div>
          <span className="text-sm font-semibold" style={{ color: "var(--warning)" }}>
            {(FEEDBACK.reduce((a, f) => a + f.rating, 0) / FEEDBACK.length).toFixed(1)} avg rating given
          </span>
        </div>
      </div>

      {FEEDBACK.map((fb) => (
        <div key={fb.id} className="border rounded-2xl p-5 space-y-4"
          style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-full text-white text-sm font-bold shrink-0"
                style={{ backgroundColor: fb.avatarBg }}>
                {fb.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{fb.mentor}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{fb.role}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <StarRating rating={fb.rating} />
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{fb.sessionDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ backgroundColor: "var(--bg-elevated)" }}>
            <div className="w-4 h-4 flex items-center justify-center shrink-0">
              <i className="ri-video-line text-sm" style={{ color: "var(--text-muted)" }} />
            </div>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{fb.sessionTopic}</p>
          </div>

          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>&ldquo;{fb.comment}&rdquo;</p>

          <div className="flex flex-wrap gap-1.5">
            {fb.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: "var(--accent-light)", color: "var(--accent-text)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
