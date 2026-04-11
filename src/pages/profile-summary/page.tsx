import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <img src="https://public.readdy.ai/ai/img_res/c1296ba1-3a0e-4b18-b1f8-e3ff105a92d8.png" alt="MentorAI" className="w-8 h-8 object-contain" />
          <span className="font-bold text-gray-900 text-lg">MentorAI</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-violet-600 text-white text-xs font-bold">1</div>
          <div className="w-16 h-0.5 bg-violet-300" />
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-violet-600 text-white text-xs font-bold">2</div>
          <div className="w-16 h-0.5 bg-gray-200" />
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 text-gray-400 text-xs font-bold">3</div>
        </div>
      </nav>

      <main className="flex-1 px-6 py-10 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium mb-3">
            <i className="ri-sparkling-2-fill" />
            AI Analysis Complete
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Your Mentorship Profile</h1>
          <p className="text-gray-500 mt-1 text-sm">Here's what our AI found — and where you're headed.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Facts */}
          <div className={`lg:col-span-2 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium mb-6">
                <i className="ri-file-text-line" />
                Parsed from your resume
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Current Role</p>
                  <p className="text-xl font-bold text-gray-900">Marketing Manager</p>
                  <p className="text-sm text-gray-500">TechCorp Inc.</p>
                </div>
                <div className="h-px bg-gray-100" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Experience</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-gray-900">4</span>
                    <span className="text-gray-500 mb-1 text-sm">years</span>
                  </div>
                </div>
                <div className="h-px bg-gray-100" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Tech Stack & Tools</p>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((t) => (
                      <span key={t} className="px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="h-px bg-gray-100" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Dream Role</p>
                  <p className="text-base font-semibold text-gray-900">UX Designer at a Product Company</p>
                </div>

                <div className="h-px bg-gray-100" />

                {/* AI Mentor Snapshot */}
                <div className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-violet-100">
                        <i className="ri-robot-2-line text-violet-600 text-xs" />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">AI Mentor Snapshot</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      Live
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed mb-2">
                    A results-driven marketing professional making a deliberate pivot into UX design. With 4 years of customer-facing experience at TechCorp, she brings rare empathy and a data-first mindset that most junior designers lack — but needs structured guidance to translate that into a credible design portfolio.
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">
                    Her biggest blocker isn&apos;t motivation — it&apos;s confidence in the craft. The mentor&apos;s role here is part coach, part accountability partner: help her ship 2 real case studies and she&apos;ll be job-ready within 3 months.
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                      <i className="ri-fire-line text-xs" />
                      High Motivation
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                      <i className="ri-route-line text-xs" />
                      Career Switcher
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-medium">
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
            <div className="bg-white rounded-2xl p-6 border border-gray-100 border-l-4 border-l-emerald-400">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-100">
                  <i className="ri-lightbulb-flash-line text-emerald-600 text-base" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Your Strengths</h2>
                <span className="ml-auto text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">Transferable</span>
              </div>
              <ul className="flex flex-col gap-3">
                {strengths.map((s) => (
                  <li key={s} className="flex items-start gap-3">
                    <div className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-100 mt-0.5 shrink-0">
                      <i className="ri-check-line text-emerald-600 text-xs" />
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gaps */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 border-l-4 border-l-amber-400">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-100">
                  <i className="ri-focus-3-line text-amber-600 text-base" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Growth Areas</h2>
                <span className="ml-auto text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full">To develop</span>
              </div>
              <div className="flex flex-col gap-4">
                {gaps.map((g) => (
                  <div key={g.label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm text-gray-700">{g.label}</span>
                      <span className="text-xs text-amber-600 font-medium">{g.severity}% gap</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-1000"
                        style={{ width: visible ? `${g.severity}%` : "0%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Proposed Focus */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 border-l-4 border-l-violet-400">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-100">
                  <i className="ri-compass-3-line text-violet-600 text-base" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Your Focus Path</h2>
                <span className="ml-auto text-xs text-violet-600 font-medium bg-violet-50 px-2 py-0.5 rounded-full">AI Proposed</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {focusAreas.map((f) => (
                  <div key={f.num} className="bg-violet-50 rounded-xl p-4">
                    <span className="text-2xl font-black text-violet-200">{f.num}</span>
                    <p className="font-bold text-gray-900 text-sm mt-1 mb-1">{f.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
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
            className="px-10 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white font-bold text-base hover:from-violet-700 hover:to-violet-600 transition-all duration-200 hover:scale-[1.02] flex items-center gap-3 whitespace-nowrap cursor-pointer"
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
