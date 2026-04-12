import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resourceVault, roadmapSteps } from "@/mocks/session";
import SessionFeedbackModal, { FeedbackData } from "./SessionFeedbackModal";

export default function SessionSummaryPage() {
  const [tasks, setTasks] = useState(() =>
    roadmapSteps.map((step) => ({
      ...step,
      tasks: step.tasks.map((t) => ({ ...t })),
    }))
  );
  const [showFeedback, setShowFeedback] = useState(true);
  const navigate = useNavigate();

  const handleFeedbackSubmit = (data: FeedbackData) => {
    console.log("Feedback submitted:", data);
  };

  const handleFeedbackClose = () => {
    setShowFeedback(false);
  };

  const toggleTask = (stepId: number, taskId: string) => {
    setTasks((prev) =>
      prev.map((step) =>
        step.id === stepId
          ? {
              ...step,
              tasks: step.tasks.map((t) =>
                t.id === taskId ? { ...t, done: !t.done } : t
              ),
            }
          : step
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] dark:bg-zinc-950 flex flex-col">
      {showFeedback && (
        <SessionFeedbackModal
          mentorName="Sarah Chen"
          mentorPhoto="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20asian%20woman%20smiling%20warmly%2C%20soft%20studio%20lighting%2C%20clean%20white%20background%2C%20business%20casual%20attire%2C%20confident%20expression%2C%20high%20quality%20portrait%20photography&width=400&height=400&seq=mentor1&orientation=squarish"
          sessionTopic="Portfolio Review & Case Study Structure"
          sessionDate="Apr 9, 2026"
          onSubmit={handleFeedbackSubmit}
          onSkip={handleFeedbackClose}
        />
      )}

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <img
            src="https://public.readdy.ai/ai/img_res/c1296ba1-3a0e-4b18-b1f8-e3ff105a92d8.png"
            alt="MentorAI"
            className="w-8 h-8 object-contain"
          />
          <span className="font-bold text-gray-900 text-lg">MentorAI</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Session with Sarah Chen · Apr 7, 2026 · 60 min
          </span>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-all cursor-pointer whitespace-nowrap"
          >
            Go to Dashboard
          </button>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-10 pb-32">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Session Complete!</h1>
          <p className="text-gray-500 text-base">
            Here is your{" "}
            <span className="text-violet-600 font-semibold underline underline-offset-2 decoration-violet-300">
              structured roadmap
            </span>
          </p>
        </div>

        {/* Resource Vault */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-archive-drawer-line text-amber-500 text-base" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Resource Vault</h2>
            <span className="text-xs text-gray-400">({resourceVault.length} items saved)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {resourceVault.map((r) => (
              <a
                key={r.id}
                href={`https://${r.url}`}
                target="_blank"
                rel="nofollow noreferrer"
                className="group flex items-center gap-3 p-3.5 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 hover:border-gray-200 transition-all duration-200 cursor-pointer"
              >
                <div
                  className={`w-9 h-9 flex items-center justify-center rounded-lg ${r.color} shrink-0`}
                >
                  <i className={`${r.icon} text-base`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{r.title}</p>
                  <p className="text-xs text-gray-400 truncate">{r.url}</p>
                </div>
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <i className="ri-external-link-line text-gray-300 group-hover:text-gray-500 transition-colors text-sm" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Action Roadmap */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-route-line text-violet-500 text-base" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Your Action Roadmap</h2>
            <span className="text-xs text-gray-400">(AI-prioritized)</span>
          </div>

          <div className="flex flex-col gap-4">
            {tasks.map((step, idx) => (
              <div
                key={step.id}
                className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 overflow-hidden"
              >
                {/* Step header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-medium">Step {idx + 1}</span>
                    <h3 className="text-sm font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <span className="text-xs text-gray-400">{step.description}</span>
                </div>

                {/* Tasks */}
                <div className="px-5 py-3 flex flex-col gap-0">
                  {step.tasks.map((task, tIdx) => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 py-3 cursor-pointer group ${
                        tIdx < step.tasks.length - 1 ? "border-b border-gray-50" : ""
                      }`}
                      onClick={() => toggleTask(step.id, task.id)}
                    >
                      <div
                        className={`w-4 h-4 flex items-center justify-center rounded border-2 shrink-0 transition-all ${
                          task.done
                            ? "border-violet-500 bg-violet-500"
                            : "border-gray-300 group-hover:border-gray-400"
                        }`}
                      >
                        {task.done && (
                          <i className="ri-check-line text-white text-[10px]" />
                        )}
                      </div>
                      <span
                        className={`text-sm leading-relaxed transition-colors ${
                          task.done
                            ? "text-gray-400 line-through"
                            : "text-gray-700"
                        }`}
                      >
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 px-8 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">Ready to start your journey?</p>
          <p className="text-xs text-gray-500">Add this roadmap to your personal dashboard</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/task-dashboard")}
          className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
        >
          Save to My Tasks
          <i className="ri-arrow-right-line" />
        </button>
      </div>
    </div>
  );
}
