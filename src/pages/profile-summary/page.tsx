import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingNav from "@/pages/onboarding/components/OnboardingNav";

const techStack = ["Figma", "Adobe XD", "Sketch", "Miro", "Notion", "Jira", "HTML/CSS", "Google Analytics"];

const strengths = [
  "Strong visual communication & storytelling",
  "Data-driven decision making from marketing background",
  "Cross-functional collaboration & stakeholder management",
  "User empathy developed through 4 years of customer-facing roles",
];

const gaps = [
  { label: "UX Research Methods", severity: 72 },
  { label: "Prototyping & Interaction Design", severity: 58 },
  { label: "Design Systems Knowledge", severity: 45 },
  { label: "Portfolio Depth", severity: 80 },
];

const focusAreas = [
  { num: "01", title: "Portfolio Building", desc: "Create 2-3 end-to-end case studies showcasing your process" },
  { num: "02", title: "UX Research Skills", desc: "Learn usability testing, user interviews, and synthesis methods" },
  { num: "03", title: "Figma Mastery", desc: "Build proficiency in components, auto layout, and prototyping" },
];

export default function ProfileSummaryPage() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
      <OnboardingNav currentStep={1} unlockedUpTo={1} />

      <main className="flex-1 px-6 py-10 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/intake")}
            className="flex items-center gap-1.5 text-sm transition-colors cursor-pointer mb-5"
            style={{ color: "var(--text-muted)" }}
          >
            <i className="ri-arrow-left-line text-base" />
            Back
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-3"
            style={{ backgroundColor: "var(--success-light)", color: "var(--success)" }}>
            <i className="ri-sparkling-2-fill" />
            AI Analysis Complete
          </div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Your Mentorship Profile</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Here&apos;s what our AI found — and where you&apos;re headed.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Facts */}
          <div className={`lg:col-span-2 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="rounded-2xl p-6 border sticky top-6" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
                style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}>
                <i className="ri-file-text-line" />
                Parsed from your resume
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Current Role</p>
                  <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Marketing Manager</p>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>TechCorp Inc.</p>
                </div>
                <div className="h-px" style={{ backgroundColor: "var(--border)" }} />
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Experience</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold" style={{ color: "var(--text-primary)" }}>4</span>
                    <span className="mb-1 text-sm" style={{ color: "var(--text-muted)" }}>years</span>
                  </div>
                </div>
                <div className="h-px" style={{ backgroundColor: "var(--border)" }} />
                <div>
                  <p className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Tech Stack &amp; Tools</p>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((t) => (
                      <span key={t} className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: "var(--accent-light)", color: "var(--accent-text)" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="h-px" style={{ backgroundColor: "var(--border)" }} />
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Dream Role</p>
                  <p className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>UX Designer at a Product Company</p>
                </div>

                <div className="h-px" style={{ backgroundColor: "var(--border)" }} />

                {/* AI Mentor Snapshot */}
                <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex items-center justify-center rounded-full" style={{ backgroundColor: "var(--accent-light)" }}>
                        <i className="ri-robot-2-line text-xs" style={{ color: "var(--accent)" }} />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>AI Mentor Snapshot</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--success)" }}>
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: "var(--success)" }} />
                      Live
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--text-muted)" }}>
                    A results-driven marketing professional making a deliberate pivot into UX design. With 4 years of customer-facing experience at TechCorp, she brings rare empathy and a data-first mindset that most junior designers lack — but needs structured guidance to translate that into a credible design portfolio.
                  </p>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
                    Her biggest blocker isn&apos;t motivation — it&apos;s confidence in the craft. The mentor&apos;s role here is part coach, part accountability partner: help her ship 2 real case studies and she&apos;ll be job-ready within 3 months.
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: "var(--success-light)", color: "var(--success)" }}>
                      <i className="ri-fire-line text-xs" />
                      High Motivation
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: "var(--warning-light)", color: "var(--warning)" }}>
                      <i className="ri-route-line text-xs" />
                      Career Switcher
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: "var(--accent-light)", color: "var(--accent-text)" }}>
                      <i className="ri-bar-chart-2-line text-xs" />
                      Data-Oriented
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: AI Magic */}
          <div className={`lg:col-span-3 flex flex-col gap-5 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            {/* Strengths */}
            <div className="rounded-2xl p-6 border border-l-4" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", borderLeftColor: "var(--success)" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-full" style={{ backgroundColor: "var(--success-light)" }}>
                  <i className="ri-lightbulb-flash-line text-base" style={{ color: "var(--success)" }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Your Strengths</h2>
                <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "var(--success-light)", color: "var(--success)" }}>Transferable</span>
              </div>
              <ul className="flex flex-col gap-3">
                {strengths.map((s) => (
                  <li key={s} className="flex items-start gap-3">
                    <div className="w-5 h-5 flex items-center justify-center rounded-full mt-0.5 shrink-0" style={{ backgroundColor: "var(--success-light)" }}>
                      <i className="ri-check-line text-xs" style={{ color: "var(--success)" }} />
                    </div>
                    <span className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gaps */}
            <div className="rounded-2xl p-6 border border-l-4" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", borderLeftColor: "var(--warning)" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-full" style={{ backgroundColor: "var(--warning-light)" }}>
                  <i className="ri-focus-3-line text-base" style={{ color: "var(--warning)" }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Growth Areas</h2>
                <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "var(--warning-light)", color: "var(--warning)" }}>To develop</span>
              </div>
              <div className="flex flex-col gap-4">
                {gaps.map((g) => (
                  <div key={g.label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{g.label}</span>
                      <span className="text-xs font-medium" style={{ color: "var(--warning)" }}>{g.severity}% gap</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-elevated)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: visible ? `${g.severity}%` : "0%", background: "linear-gradient(to right, var(--warning), var(--warning))" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Proposed Focus */}
            <div className="rounded-2xl p-6 border border-l-4" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", borderLeftColor: "var(--accent)" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-full" style={{ backgroundColor: "var(--accent-light)" }}>
                  <i className="ri-compass-3-line text-base" style={{ color: "var(--accent)" }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Your Focus Path</h2>
                <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "var(--accent-light)", color: "var(--accent-text)" }}>AI Proposed</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {focusAreas.map((f) => (
                  <div key={f.num} className="rounded-xl p-4" style={{ backgroundColor: "var(--bg-elevated)" }}>
                    <span className="text-2xl font-black" style={{ color: "var(--accent-light)" }}>{f.num}</span>
                    <p className="font-bold text-sm mt-1 mb-1" style={{ color: "var(--text-primary)" }}>{f.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => navigate("/smart-match")}
            className="px-10 py-4 rounded-xl text-white font-bold text-base transition-all duration-200 hover:scale-[1.02] flex items-center gap-3 whitespace-nowrap cursor-pointer"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <i className="ri-sparkling-2-fill text-lg" />
            Show My Mentor Matches
            <i className="ri-arrow-right-line text-lg" />
          </button>
        </div>
      </main>
    </div>
  );
}
