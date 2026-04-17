import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mentors } from "@/mocks/mentors";
import BookingModal from "./BookingModal";
import OnboardingNav from "@/pages/onboarding/components/OnboardingNav";

export default function SmartMatchPage() {
  const [selectedMentor, setSelectedMentor] = useState<typeof mentors[0] | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
      <OnboardingNav currentStep={2} unlockedUpTo={2} />

      <main className="flex-1 px-6 py-14 max-w-6xl mx-auto w-full">
        <button
          type="button"
          onClick={() => navigate("/profile-summary")}
          className="flex items-center gap-1.5 text-sm transition-colors cursor-pointer mb-8"
          style={{ color: "var(--text-muted)" }}
        >
          <i className="ri-arrow-left-line text-base" />
          Back
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4" style={{ backgroundColor: "var(--accent-light)", color: "var(--accent-text)" }}>
            <i className="ri-sparkling-2-fill" />
            AI-Powered Matching
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
            Here are your best matches
          </h1>
          <div className="inline-flex mx-auto rounded-2xl px-6 py-4 text-left max-w-[520px] border" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-full shrink-0 mt-0.5" style={{ backgroundColor: "var(--accent-light)" }}>
                <i className="ri-brain-line text-sm" style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>How we matched you</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Our AI analyzed your resume, your target role, and the challenges you're facing to connect you with mentors who best match your goals and experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mentors.map((mentor, idx) => (
            <div
              key={mentor.id}
              className="rounded-2xl border overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col"
              style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", animationDelay: `${idx * 100}ms` }}
            >
              <div className="relative">
                <div className="h-32 flex items-end justify-center pb-0" style={{ background: "linear-gradient(135deg, var(--accent-light) 0%, var(--bg-elevated) 100%)" }}>
                  <img
                    src={mentor.photo}
                    alt={mentor.name}
                    className="w-24 h-24 rounded-full object-cover object-top border-4 translate-y-12"
                    style={{ borderColor: "var(--bg-surface)" }}
                  />
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold border" style={{ backgroundColor: "var(--bg-surface)", color: "var(--accent-text)", borderColor: "var(--border)" }}>
                  {mentor.matchScore}% match
                </div>
              </div>

              <div className="pt-14 pb-6 px-6 flex flex-col flex-1">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{mentor.name}</h3>
                  <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{mentor.role}</p>
                  <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{mentor.company}</p>
                </div>

                <div className="rounded-xl px-4 py-3 mb-4 text-center border" style={{ backgroundColor: "var(--accent-light)", borderColor: "var(--accent-light)" }}>
                  <p className="text-xs font-semibold" style={{ color: "var(--accent-text)" }}>
                    ✨ {mentor.matchReason}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                  {mentor.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-center leading-relaxed mb-5 flex-1" style={{ color: "var(--text-muted)" }}>{mentor.bio}</p>

                <div className="flex items-center justify-center gap-1.5 mb-5">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <span
                      key={day}
                      className="text-xs px-2 py-1 rounded-md font-medium"
                      style={mentor.availability.includes(day)
                        ? { backgroundColor: "var(--success-light)", color: "var(--success)" }
                        : { backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }
                      }
                    >
                      {day}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedMentor(mentor)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold text-sm hover:from-violet-700 hover:to-violet-600 transition-all duration-200 hover:scale-[1.02] whitespace-nowrap cursor-pointer"
                >
                  Schedule First Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedMentor && (
        <BookingModal
          mentor={selectedMentor}
          onClose={() => setSelectedMentor(null)}
          onConfirm={(_date, _time) => {
            setSelectedMentor(null);
            navigate("/session-dashboard");
          }}
        />
      )}
    </div>
  );
}
