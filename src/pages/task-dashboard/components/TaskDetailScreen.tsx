import { useState, useRef, useEffect } from "react";
import type { MainTask, TaskResource, VerificationQuestion } from "@/mocks/taskDashboard";

interface TaskDetailScreenProps {
  task: MainTask;
  onSubTaskToggle: (subId: string) => void;
  onTaskComplete: () => void;
  onClose: () => void;
}

type FlowStep = "overview" | "learn" | "quiz" | "complete";

const RESOURCE_TYPE_STYLE: Record<string, { icon: string; bg: string; text: string; border: string }> = {
  Video:   { icon: "ri-play-circle-line",   bg: "bg-rose-50",   text: "text-rose-600",   border: "border-rose-200" },
  PDF:     { icon: "ri-file-pdf-line",       bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
  Article: { icon: "ri-article-line",        bg: "bg-sky-50",    text: "text-sky-600",    border: "border-sky-200" },
  File:    { icon: "ri-file-download-line",  bg: "bg-gray-50",   text: "text-gray-600",   border: "border-gray-200" },
  Link:    { icon: "ri-links-line",          bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200" },
};

const STEP_STYLE = {
  violet: {
    dot: "bg-violet-500",
    bar: "bg-violet-500",
    badge: "bg-violet-50 text-violet-700 border-violet-200",
    text: "text-violet-600",
    iconBg: "bg-violet-100",
    iconText: "text-violet-600",
    accentBg: "bg-violet-50",
    accentBorder: "border-violet-200",
    btn: "bg-violet-600 hover:bg-violet-700",
    tabActive: "border-violet-500 text-violet-600",
  },
  emerald: {
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    text: "text-emerald-600",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-200",
    btn: "bg-emerald-600 hover:bg-emerald-700",
    tabActive: "border-emerald-500 text-emerald-600",
  },
  amber: {
    dot: "bg-amber-500",
    bar: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    text: "text-amber-600",
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
    accentBg: "bg-amber-50",
    accentBorder: "border-amber-200",
    btn: "bg-amber-500 hover:bg-amber-600",
    tabActive: "border-amber-500 text-amber-600",
  },
};

function ResourceCard({ resource }: { resource: TaskResource }) {
  const style = RESOURCE_TYPE_STYLE[resource.type] ?? RESOURCE_TYPE_STYLE.Link;
  return (
    <a
      href={`https://${resource.url}`}
      target="_blank"
      rel="nofollow noreferrer"
      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-all group cursor-pointer"
      onClick={(e) => e.stopPropagation()}
    >
      <div className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center shrink-0`}>
        <i className={`${style.icon} ${style.text} text-sm`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-800 leading-snug truncate">{resource.title}</p>
        <p className="text-xs text-gray-400 truncate">{resource.source}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className={`text-xs px-1.5 py-0.5 rounded-md border font-medium ${style.bg} ${style.text} ${style.border}`}>{resource.type}</span>
        <i className="ri-external-link-line text-gray-300 group-hover:text-gray-500 transition-colors text-sm" />
      </div>
    </a>
  );
}

export default function TaskDetailScreen({ task, onSubTaskToggle, onTaskComplete, onClose }: TaskDetailScreenProps) {
  const style = STEP_STYLE[task.color];
  const [flowStep, setFlowStep] = useState<FlowStep>("overview");
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answeredCorrect, setAnsweredCorrect] = useState<boolean | null>(null);
  const [tutorInput, setTutorInput] = useState("");
  const [tutorMessages, setTutorMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [tutorTyping, setTutorTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const doneSubs = task.subTasks.filter((s) => s.done).length;
  const allSubsDone = doneSubs === task.subTasks.length && task.subTasks.length > 0;
  const subsPct = task.subTasks.length > 0 ? Math.round((doneSubs / task.subTasks.length) * 100) : 0;
  const questions: VerificationQuestion[] = task.verificationQuestions;

  // Reset chat when switching away and back to AI Tutor tab
  useEffect(() => {
    if (flowStep !== "learn") {
      // keep messages so conversation persists within the same task session
    }
  }, [flowStep]);

  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [flowStep]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tutorMessages, tutorTyping]);

  const handleAnswerSelect = (idx: number) => {
    if (answeredCorrect !== null) return;
    setSelectedAnswer(idx);
    const correct = idx === questions[quizIdx].correct;
    setAnsweredCorrect(correct);
  };

  const handleNextQuestion = () => {
    if (quizIdx < questions.length - 1) {
      setQuizIdx((p) => p + 1);
      setSelectedAnswer(null);
      setAnsweredCorrect(null);
    } else {
      setCompleteUnlocked(true);
      setFlowStep("complete");
    }
  };

  const handleTutorSend = () => {
    if (!tutorInput.trim() || tutorTyping) return;
    const userMsg = tutorInput.trim();
    setTutorMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setTutorInput("");
    setTutorTyping(true);
    setTimeout(() => {
      // Pick the most relevant tip based on keyword overlap, fallback to first tip
      const lower = userMsg.toLowerCase();
      const scored = task.aiTips.map((tip) => {
        const words = lower.split(/\s+/).filter((w) => w.length > 3);
        const matches = words.filter((w) => tip.toLowerCase().includes(w)).length;
        return { tip, matches };
      });
      scored.sort((a, b) => b.matches - a.matches);
      const aiReply = scored[0].matches > 0
        ? scored[0].tip
        : `Great question! Here's what you should know about "${task.title}": ${task.aiTips[0]}`;
      setTutorMessages((prev) => [...prev, { role: "ai", text: aiReply }]);
      setTutorTyping(false);
    }, 1200);
  };

  const FLOW_TABS: { id: FlowStep; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "ri-layout-grid-line" },
    { id: "learn", label: "AI Tutor", icon: "ri-sparkling-2-fill" },
    { id: "quiz", label: "Quiz", icon: "ri-question-answer-line" },
    { id: "complete", label: "Complete", icon: "ri-checkbox-circle-line" },
  ];

  // Overview and AI Tutor are always freely accessible.
  // Quiz unlocks once the mentee explicitly clicks "Take Quiz" from AI Tutor.
  // Complete unlocks after finishing the quiz.
  const [quizUnlocked, setQuizUnlocked] = useState(false);
  const [completeUnlocked, setCompleteUnlocked] = useState(false);

  const flowOrder: FlowStep[] = ["overview", "learn", "quiz", "complete"];
  const currentFlowIdx = flowOrder.indexOf(flowStep);

  const isTabClickable = (tabId: FlowStep) => {
    if (tabId === "overview" || tabId === "learn") return true;
    if (tabId === "quiz") return quizUnlocked || completeUnlocked;
    if (tabId === "complete") return completeUnlocked;
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch bg-black/40 backdrop-blur-sm">
      {/* Backdrop click to close */}
      <div className="flex-1 hidden lg:block" onClick={onClose} />

      {/* Panel */}
      <div
        ref={panelRef}
        className="w-full lg:w-[680px] bg-white flex flex-col h-full overflow-hidden"
        style={{ boxShadow: "-8px 0 40px rgba(0,0,0,0.12)" }}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="border-b border-gray-100 px-6 py-4 flex items-start gap-3 shrink-0">
          <div className={`w-10 h-10 rounded-xl ${style.iconBg} flex items-center justify-center shrink-0`}>
            <i className={`${task.resourceIcon} ${style.iconText} text-lg`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${style.badge}`}>{task.stepLabel}</span>
              <span className="text-xs text-gray-400">{task.stepTitle}</span>
            </div>
            <h2 className="text-base font-bold text-gray-900 leading-snug">{task.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all cursor-pointer shrink-0"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        {/* ── Flow Tabs ──────────────────────────────────────────────────── */}
        <div className="flex items-center border-b border-gray-100 px-6 shrink-0 bg-white">
          {FLOW_TABS.map((tab, i) => {
            const isActive = flowStep === tab.id;
            const clickable = isTabClickable(tab.id);
            // Show checkmark if this step is "done" (quiz done = completeUnlocked, learn done = quizUnlocked)
            const isDone =
              (tab.id === "learn" && quizUnlocked) ||
              (tab.id === "quiz" && completeUnlocked) ||
              (tab.id === "overview" && (quizUnlocked || completeUnlocked));
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => { if (clickable) setFlowStep(tab.id); }}
                className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? `${style.tabActive} bg-transparent`
                    : clickable
                    ? "border-transparent text-gray-400 hover:text-gray-600 cursor-pointer"
                    : "border-transparent text-gray-300 cursor-not-allowed"
                }`}
              >
                <i className={`${tab.icon} text-sm`} />
                {tab.label}
                {isDone && !isActive && <i className="ri-check-line text-emerald-500 text-xs" />}
              </button>
            );
          })}
        </div>

        {/* ── Scrollable Content ─────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">

          {/* ══ OVERVIEW ══════════════════════════════════════════════════ */}
          {flowStep === "overview" && (
            <div className="p-6 flex flex-col gap-6">
              {/* Description */}
              <div>
                <p className="text-sm text-gray-600 leading-relaxed">{task.description}</p>
              </div>

              {/* Sub-tasks */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <i className="ri-list-check-2 text-gray-500 text-sm" />
                    <h3 className="text-sm font-bold text-gray-900">Sub-tasks</h3>
                  </div>
                  <span className="text-xs text-gray-400">{doneSubs}/{task.subTasks.length} done</span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                  <div className={`h-full ${style.bar} rounded-full transition-all duration-700`} style={{ width: `${subsPct}%` }} />
                </div>

                <div className="flex flex-col gap-2">
                  {task.subTasks.map((sub, idx) => (
                    <div
                      key={sub.id}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                        sub.done ? "bg-gray-50 border-gray-100" : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => onSubTaskToggle(sub.id)}
                    >
                      <div className="w-6 h-6 flex items-center justify-center shrink-0">
                        {sub.done ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                            <i className="ri-check-line text-white text-xs" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold text-gray-400">
                            {idx + 1}
                          </div>
                        )}
                      </div>
                      <p className={`text-sm flex-1 ${sub.done ? "text-gray-400 line-through" : "text-gray-800"}`}>{sub.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <i className="ri-links-line text-gray-500 text-sm" />
                  <h3 className="text-sm font-bold text-gray-900">Mentor Resources</h3>
                  <span className="text-xs text-gray-400 ml-auto">{task.resources.length} items</span>
                </div>
                <div className="flex flex-col gap-2">
                  {task.resources.map((res) => (
                    <ResourceCard key={res.id} resource={res} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ AI TUTOR (was Learn) ═══════════════════════════════════════ */}
          {flowStep === "learn" && (
            <div className="flex flex-col h-full" style={{ minHeight: "calc(100vh - 180px)" }}>
              {/* Chat header */}
              <div className={`flex items-center gap-3 px-6 py-3 border-b border-gray-100 ${style.accentBg} shrink-0`}>
                <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                  <i className="ri-sparkling-2-fill text-white text-sm" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">AI Tutor</p>
                  <p className="text-xs text-gray-500">Ask anything about this task</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (questions.length > 0) {
                      setQuizUnlocked(true);
                      setFlowStep("quiz");
                    } else {
                      setCompleteUnlocked(true);
                      setFlowStep("complete");
                    }
                  }}
                  className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${style.btn}`}
                >
                  {questions.length > 0 ? "I'm ready — Take Quiz →" : "Complete →"}
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
                {/* Welcome / greeting message */}
                <div className="flex gap-3" style={{ animation: "fadeSlideIn 0.35s ease-out" }}>
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                    <i className="ri-sparkling-2-fill text-violet-600 text-sm" />
                  </div>
                  <div className={`max-w-[80%] p-4 rounded-2xl rounded-tl-sm text-sm leading-relaxed ${style.accentBg} border ${style.accentBorder} text-gray-800`}>
                    Hi! I&apos;m your AI Tutor for <strong>&ldquo;{task.title}&rdquo;</strong>. Ask me anything about this task — concepts, steps, or anything you&apos;re unsure about. I&apos;m here to help!
                  </div>
                </div>

                {/* Suggested starter questions */}
                {tutorMessages.length <= 1 && !tutorTyping && (
                  <div className="flex flex-col gap-2 pl-11" style={{ animation: "fadeSlideIn 0.5s ease-out" }}>
                    <p className="text-xs text-gray-400 font-medium">Try asking:</p>
                    {[
                      `How do I get started with this task?`,
                      `What's the most important thing to understand here?`,
                      `Can you explain the key concepts?`,
                    ].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => { setTutorInput(q); }}
                        className="text-left text-xs px-3 py-2 rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-600 transition-all cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {/* Conversation messages (skip index 0 — that's the welcome, already rendered above) */}
                {tutorMessages.slice(1).map((msg, i) => (
                  <div
                    key={i + 1}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    style={{ animation: "fadeSlideIn 0.35s ease-out" }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "ai" ? "bg-violet-100" : "bg-gray-200"}`}>
                      <i className={`${msg.role === "ai" ? "ri-sparkling-2-fill text-violet-600" : "ri-user-line text-gray-500"} text-sm`} />
                    </div>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "ai"
                        ? `rounded-tl-sm ${style.accentBg} border ${style.accentBorder} text-gray-800`
                        : "rounded-tr-sm bg-gray-900 text-white"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {tutorTyping && (
                  <div className="flex gap-3" style={{ animation: "fadeSlideIn 0.35s ease-out" }}>
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                      <i className="ri-sparkling-2-fill text-violet-600 text-sm" />
                    </div>
                    <div className={`px-4 py-3 rounded-2xl rounded-tl-sm ${style.accentBg} border ${style.accentBorder} flex items-center gap-1.5`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat input */}
              <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-100 bg-white shrink-0">
                <input
                  type="text"
                  value={tutorInput}
                  onChange={(e) => setTutorInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleTutorSend(); }}
                  placeholder="Ask a follow-up question..."
                  className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-gray-400 bg-gray-50"
                />
                <button
                  type="button"
                  onClick={handleTutorSend}
                  disabled={tutorTyping}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-white transition-all cursor-pointer shrink-0 ${tutorTyping ? "bg-gray-300" : "bg-gray-900 hover:bg-gray-800"}`}
                >
                  <i className="ri-send-plane-fill text-sm" />
                </button>
              </div>
            </div>
          )}

          {/* ══ QUIZ ══════════════════════════════════════════════════════ */}
          {flowStep === "quiz" && (
            <div className="p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i className="ri-question-answer-line text-violet-500" />
                  <p className="text-sm font-bold text-gray-900">Knowledge Quiz</p>
                </div>
                <span className="text-xs text-gray-400">Question {quizIdx + 1} of {questions.length}</span>
              </div>

              {/* Progress dots */}
              <div className="flex gap-1.5">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                      i < quizIdx ? "bg-emerald-400" : i === quizIdx ? style.bar : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>

              <div>
                <p className="text-base font-semibold text-gray-900 leading-snug mb-4">{questions[quizIdx].question}</p>
                <div className="flex flex-col gap-2">
                  {questions[quizIdx].options.map((opt, i) => {
                    let btnStyle = "border-gray-200 bg-white hover:border-gray-300 cursor-pointer";
                    if (selectedAnswer !== null) {
                      if (i === questions[quizIdx].correct) btnStyle = "border-emerald-400 bg-emerald-50 cursor-default";
                      else if (i === selectedAnswer) btnStyle = "border-red-300 bg-red-50 cursor-default";
                      else btnStyle = "border-gray-100 bg-gray-50 opacity-50 cursor-default";
                    }
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAnswerSelect(i)}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${btnStyle}`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold ${
                          selectedAnswer !== null && i === questions[quizIdx].correct
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : selectedAnswer !== null && i === selectedAnswer
                            ? "border-red-400 bg-red-400 text-white"
                            : "border-gray-300 text-gray-400"
                        }`}>
                          {selectedAnswer !== null && i === questions[quizIdx].correct ? (
                            <i className="ri-check-line text-xs" />
                          ) : selectedAnswer !== null && i === selectedAnswer ? (
                            <i className="ri-close-line text-xs" />
                          ) : (
                            String.fromCharCode(65 + i)
                          )}
                        </div>
                        <span className="text-sm text-gray-800">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {answeredCorrect !== null && (
                <div className={`p-4 rounded-xl border ${answeredCorrect ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <i className={`${answeredCorrect ? "ri-checkbox-circle-fill text-emerald-500" : "ri-information-line text-amber-500"} text-base`} />
                    <p className={`text-xs font-semibold ${answeredCorrect ? "text-emerald-700" : "text-amber-700"}`}>
                      {answeredCorrect ? "Correct! Great job." : "Not quite — here's why:"}
                    </p>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">{questions[quizIdx].explanation}</p>
                </div>
              )}

              {answeredCorrect !== null && (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition-all cursor-pointer whitespace-nowrap ${style.btn}`}
                >
                  {quizIdx < questions.length - 1 ? "Next Question →" : "Finish Quiz →"}
                </button>
              )}

              {answeredCorrect === null && (
                <button
                  type="button"
                  onClick={() => setFlowStep("learn")}
                  className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap"
                >
                  ← Back to AI Tutor
                </button>
              )}
            </div>
          )}

          {/* ══ COMPLETE ══════════════════════════════════════════════════ */}
          {flowStep === "complete" && (
            <div className="p-6 flex flex-col items-center text-center gap-5">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                <i className="ri-checkbox-circle-fill text-emerald-500 text-4xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Task Complete!</h3>
                <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                  You&apos;ve finished all sub-tasks, reviewed the learning material, and passed the verification check.
                </p>
                <p className="text-xs text-gray-400 mt-1">Keep the momentum going — your next task is waiting.</p>
              </div>

              <div className={`w-full p-4 rounded-xl ${style.accentBg} border ${style.accentBorder} text-left`}>
                <p className="text-xs font-semibold text-gray-600 mb-2">What you learned:</p>
                {task.aiTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1.5">
                    <i className="ri-check-line text-emerald-500 text-xs mt-0.5 shrink-0" />
                    <p className="text-xs text-gray-600 leading-snug">{tip.slice(0, 90)}...</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={() => { onTaskComplete(); onClose(); }}
                  className={`flex-1 py-3 rounded-xl text-white font-semibold text-sm transition-all cursor-pointer whitespace-nowrap ${style.btn}`}
                >
                  <i className="ri-check-double-line mr-1.5" />
                  Mark Done &amp; Continue
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Bottom Action Bar ──────────────────────────────────────────── */}
        {flowStep === "overview" && (
          <div className="border-t border-gray-100 px-6 py-4 flex items-center gap-3 bg-white shrink-0">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">
                {allSubsDone ? "All sub-tasks done! Ready to learn." : `${doneSubs}/${task.subTasks.length} sub-tasks complete`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFlowStep("learn")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all cursor-pointer whitespace-nowrap ${style.btn}`}
            >
              <i className="ri-sparkling-2-fill text-sm" />
              Ask AI Tutor
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
