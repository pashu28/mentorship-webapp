import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resourceVault, roadmapSteps } from "@/mocks/session";
import SessionFeedbackModal, { FeedbackData } from "./SessionFeedbackModal";

function getBookedMentor() {
  try {
    const raw = localStorage.getItem("mentorAI_bookedMentor");
    if (raw) {
      const m = JSON.parse(raw) as { name?: string; mentorName?: string; photo?: string; mentorPhoto?: string };
      const resolvedName = m.name ?? m.mentorName ?? "";
      const resolvedPhoto = m.photo ?? m.mentorPhoto ?? "";
      if (resolvedName) {
        return {
          mentorName: resolvedName,
          mentorPhoto: resolvedPhoto || "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20smiling%20mentor%2C%20soft%20studio%20lighting%2C%20clean%20white%20background%2C%20business%20casual%20attire%2C%20high%20quality%20portrait%20photography&width=400&height=400&seq=mentor-default&orientation=squarish",
        };
      }
    }
  } catch (_) { /* ignore */ }
  return {
    mentorName: "Your Mentor",
    mentorPhoto: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20smiling%20mentor%2C%20soft%20studio%20lighting%2C%20clean%20white%20background%2C%20business%20casual%20attire%2C%20high%20quality%20portrait%20photography&width=400&height=400&seq=mentor-default&orientation=squarish",
  };
}

export default function SessionSummaryPage() {
  const bookedMentor = getBookedMentor();
  const [tasks, setTasks] = useState(
    roadmapSteps.map((step) => ({ ...step, tasks: step.tasks.map((t) => ({ ...t, checked: false })) }))
  );
  const [showFeedback, setShowFeedback] = useState(true);
  const navigate = useNavigate();

  const handleFeedbackSubmit = (data: FeedbackData) => {
    console.log("Feedback submitted:", data);
  };

  const toggleTask = (stepId: number, taskId: string) => {
    setTasks((prev) =>
      prev.map((step) =>
        step.id === stepId
          ? { ...step, tasks: step.tasks.map((t) => t.id === taskId ? { ...t, checked: !t.checked } : t) }
          : step
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
      {showFeedback && (
        <SessionFeedbackModal
          mentorName={bookedMentor.mentorName}
          mentorPhoto={bookedMentor.mentorPhoto}
          sessionTopic="Portfolio Review & Case Study Structure"
          sessionDate="Apr 9, 2026"
          onSubmit={handleFeedbackSubmit}
          onSkip={() => setShowFeedback(false)}
        />
      )}

      <nav className="flex items-center justify-between px-8 py-4 border-b" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2.5">
          <img src="https://public.readdy.ai/ai/img_res/c1296ba1-3a0e-4b18-b1f8-e3ff105a92d8.png" alt="GrowthFlow" className="w-8 h-8 object-contain" />
          <span className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>GrowthFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>
            Session with {bookedMentor.mentorName} · Apr 7, 2026 · 60 min
          </span>
          <button type="button" onClick={() => navigate("/dashboard")} className="px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap" style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
            Go to Dashboard
          </button>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-10 pb-32">
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">🎉</div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Session Complete!</h1>
          <p className="text-base" style={{ color: "var(--text-muted)" }}>
            Here is your{" "}
            <span className="font-semibold" style={{ color: "var(--accent-text)" }}>structured roadmap</span>
          </p>
        </div>

        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 flex items-center justify-center"><i className="ri-archive-drawer-line text-base" style={{ color: "var(--warning)" }} /></div>
            <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Resource Vault</h2>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>({resourceVault.length} items saved)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {resourceVault.map((r) => (
              <a key={r.id} href={`https://${r.url}`} target="_blank" rel="nofollow noreferrer"
                className="group flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 cursor-pointer"
                style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
                <div className={`w-9 h-9 flex items-center justify-center rounded-lg ${r.color} shrink-0`}>
                  <i className={`${r.icon} text-base`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{r.title}</p>
                  <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{r.url}</p>
                </div>
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <i className="ri-external-link-line text-sm" style={{ color: "var(--text-muted)" }} />
                </div>
              </a>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-5 h-5 flex items-center justify-center"><i className="ri-route-line text-base" style={{ color: "var(--accent)" }} /></div>
            <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Your Action Roadmap</h2>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>(AI-prioritized)</span>
          </div>
          <div className="flex flex-col gap-4">
            {tasks.map((step, idx) => (
              <div key={step.id} className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Step {idx + 1}</span>
                    <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{step.title}</h3>
                  </div>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{step.description}</span>
                </div>
                <div className="px-5 py-2 flex flex-col gap-0">
                  {step.tasks.map((task, tIdx) => {
                    const dotColors = [
                      ["bg-violet-100 text-violet-600", "bg-violet-500 text-white"],
                      ["bg-emerald-100 text-emerald-600", "bg-emerald-500 text-white"],
                      ["bg-amber-100 text-amber-600", "bg-amber-500 text-white"],
                    ];
                    const [dotDefault, dotChecked] = dotColors[(step.id - 1) % dotColors.length];
                    const isChecked = (task as typeof task & { checked?: boolean }).checked;
                    return (
                      <div key={task.id}
                        className="flex items-center gap-3 py-3 cursor-pointer group"
                        style={{ borderBottom: tIdx < step.tasks.length - 1 ? "1px solid var(--border-subtle)" : "none" }}
                        onClick={() => toggleTask(step.id, task.id)}>
                        <div className={`w-6 h-6 flex items-center justify-center rounded-full shrink-0 transition-all text-xs font-bold ${isChecked ? dotChecked : dotDefault}`}>
                          {isChecked ? <i className="ri-check-line text-[11px]" /> : tIdx + 1}
                        </div>
                        <span className="text-sm leading-relaxed transition-colors"
                          style={{ color: isChecked ? "var(--text-muted)" : "var(--text-secondary)", textDecoration: isChecked ? "line-through" : "none" }}>
                          {task.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 border-t px-8 py-4 flex items-center justify-between" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Ready to start your journey?</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Add this roadmap to your personal dashboard</p>
        </div>
        <button type="button" onClick={() => navigate("/task-dashboard")}
          className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap">
          Save to My Tasks
          <i className="ri-arrow-right-line" />
        </button>
      </div>
    </div>
  );
}
