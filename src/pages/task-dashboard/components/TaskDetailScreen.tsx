import { useState, useRef, useEffect } from "react";
import type { MainTask, TaskResource, VerificationQuestion } from "@/mocks/taskDashboard";

interface TaskDetailScreenProps {
  task: MainTask;
  onSubTaskToggle: (subId: string) => void;
  onTaskComplete: () => void;
  onClose: () => void;
}

type FlowStep = "overview" | "learn" | "quiz" | "complete";

const RESOURCE_TYPE_STYLE: Record<string, { icon: string; bgColor: string; textColor: string; borderColor: string; tagBg: string; tagText: string; tagBorder: string }> = {
  Video:   { icon: "ri-play-circle-line",   bgColor: "rgba(244,63,94,0.12)",   textColor: "#f43f5e",   borderColor: "rgba(244,63,94,0.25)",   tagBg: "rgba(244,63,94,0.12)",   tagText: "#f43f5e",   tagBorder: "rgba(244,63,94,0.3)" },
  PDF:     { icon: "ri-file-pdf-line",       bgColor: "rgba(249,115,22,0.12)",  textColor: "#f97316",  borderColor: "rgba(249,115,22,0.25)",  tagBg: "rgba(249,115,22,0.12)",  tagText: "#f97316",  tagBorder: "rgba(249,115,22,0.3)" },
  Article: { icon: "ri-article-line",        bgColor: "rgba(14,165,233,0.12)",  textColor: "#0ea5e9",  borderColor: "rgba(14,165,233,0.25)",  tagBg: "rgba(14,165,233,0.12)",  tagText: "#0ea5e9",  tagBorder: "rgba(14,165,233,0.3)" },
  File:    { icon: "ri-file-download-line",  bgColor: "rgba(100,116,139,0.12)", textColor: "#94a3b8",  borderColor: "rgba(100,116,139,0.25)", tagBg: "rgba(100,116,139,0.12)", tagText: "#94a3b8",  tagBorder: "rgba(100,116,139,0.3)" },
  Link:    { icon: "ri-links-line",          bgColor: "rgba(124,58,237,0.12)",  textColor: "#7c3aed",  borderColor: "rgba(124,58,237,0.25)",  tagBg: "rgba(124,58,237,0.12)",  tagText: "#a78bfa",  tagBorder: "rgba(124,58,237,0.3)" },
};

const STEP_STYLE = {
  violet: { dot: "bg-violet-500", bar: "bg-violet-500", badge: "bg-violet-50 text-violet-700 border-violet-200", text: "text-violet-600", iconBg: "bg-violet-100", iconText: "text-violet-600", btn: "bg-violet-600 hover:bg-violet-700", tabActive: "border-violet-500 text-violet-600" },
  emerald: { dot: "bg-emerald-500", bar: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", text: "text-emerald-600", iconBg: "bg-emerald-100", iconText: "text-emerald-600", btn: "bg-emerald-600 hover:bg-emerald-700", tabActive: "border-emerald-500 text-emerald-600" },
  amber: { dot: "bg-amber-500", bar: "bg-amber-500", badge: "bg-amber-50 text-amber-700 border-amber-200", text: "text-amber-600", iconBg: "bg-amber-100", iconText: "text-amber-600", btn: "bg-amber-500 hover:bg-amber-600", tabActive: "border-amber-500 text-amber-600" },
};

function ResourceCard({ resource }: { resource: TaskResource }) {
  const rStyle = RESOURCE_TYPE_STYLE[resource.type] ?? RESOURCE_TYPE_STYLE.Link;
  return (
    <a
      href={`https://${resource.url}`}
      target="_blank"
      rel="nofollow noreferrer"
      className="flex items-center gap-3 p-3 rounded-xl border transition-all group cursor-pointer"
      style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: rStyle.bgColor }}>
        <i className={`${rStyle.icon} text-sm`} style={{ color: rStyle.textColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold leading-snug truncate" style={{ color: "var(--text-primary)" }}>{resource.title}</p>
        <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{resource.source}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-xs px-1.5 py-0.5 rounded-md border font-medium"
          style={{ backgroundColor: rStyle.tagBg, color: rStyle.tagText, borderColor: rStyle.tagBorder }}>
          {resource.type}
        </span>
        <i className="ri-external-link-line text-sm" style={{ color: "var(--text-muted)" }} />
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
  const [quizUnlocked, setQuizUnlocked] = useState(false);
  const [completeUnlocked, setCompleteUnlocked] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const doneSubs = task.subTasks.filter((s) => s.done).length;
  const allSubsDone = doneSubs === task.subTasks.length && task.subTasks.length > 0;
  const subsPct = task.subTasks.length > 0 ? Math.round((doneSubs / task.subTasks.length) * 100) : 0;
  const questions: VerificationQuestion[] = task.verificationQuestions;

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

  const isTabClickable = (tabId: FlowStep) => {
    if (tabId === "overview" || tabId === "learn") return true;
    if (tabId === "quiz") return quizUnlocked || completeUnlocked;
    if (tabId === "complete") return completeUnlocked;
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch bg-black/50 backdrop-blur-sm">
      <div className="flex-1 hidden lg:block" onClick={onClose} />
      <div
        ref={panelRef}
        className="w-full lg:w-[680px] flex flex-col h-full overflow-hidden"
        style={{ backgroundColor: "var(--bg-surface)", boxShadow: "-8px 0 40px rgba(0,0,0,0.25)" }}
      >
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-start gap-3 shrink-0" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--accent-light)" }}>
            <i className={`${task.resourceIcon} text-lg`} style={{ color: "var(--accent)" }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${style.badge}`}>{task.stepLabel}</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{task.stepTitle}</span>
            </div>
            <h2 className="text-base font-bold leading-snug" style={{ color: "var(--text-primary)" }}>{task.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer shrink-0"
            style={{ color: "var(--text-muted)" }}
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        {/* Flow Tabs */}
        <div className="flex items-center border-b px-6 shrink-0" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          {FLOW_TABS.map((tab) => {
            const isActive = flowStep === tab.id;
            const clickable = isTabClickable(tab.id);
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
                  isActive ? `${style.tabActive} bg-transparent` : clickable ? "border-transparent cursor-pointer" : "border-transparent cursor-not-allowed"
                }`}
                style={!isActive ? { color: clickable ? "var(--text-muted)" : "var(--text-disabled)" } : {}}
              >
                <i className={`${tab.icon} text-sm`} />
                {tab.label}
                {isDone && !isActive && <i className="ri-check-line text-emerald-500 text-xs" />}
              </button>
            );
          })}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "var(--bg-surface)" }}>

          {/* OVERVIEW */}
          {flowStep === "overview" && (
            <div className="p-6 flex flex-col gap-6">
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{task.description}</p>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <i className="ri-list-check-2 text-sm" style={{ color: "var(--text-muted)" }} />
                    <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Sub-tasks</h3>
                  </div>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{doneSubs}/{task.subTasks.length} done</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ backgroundColor: "var(--bg-elevated)" }}>
                  <div className={`h-full ${style.bar} rounded-full transition-all duration-700`} style={{ width: `${subsPct}%` }} />
                </div>
                <div className="flex flex-col gap-2">
                  {task.subTasks.map((sub, idx) => (
                    <div
                      key={sub.id}
                      className="flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer"
                      style={{ backgroundColor: sub.done ? "var(--bg-elevated)" : "var(--bg-surface)", borderColor: "var(--border)" }}
                      onClick={() => onSubTaskToggle(sub.id)}
                    >
                      <div className="w-6 h-6 flex items-center justify-center shrink-0">
                        {sub.done ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                            <i className="ri-check-line text-white text-xs" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                            {idx + 1}
                          </div>
                        )}
                      </div>
                      <p className={`text-sm flex-1 ${sub.done ? "line-through" : ""}`} style={{ color: sub.done ? "var(--text-muted)" : "var(--text-primary)" }}>{sub.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <i className="ri-links-line text-sm" style={{ color: "var(--text-muted)" }} />
                  <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Mentor Resources</h3>
                  <span className="text-xs ml-auto" style={{ color: "var(--text-muted)" }}>{task.resources.length} items</span>
                </div>
                <div className="flex flex-col gap-2">
                  {task.resources.map((res) => (
                    <ResourceCard key={res.id} resource={res} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI TUTOR */}
          {flowStep === "learn" && (
            <div className="flex flex-col h-full" style={{ minHeight: "calc(100vh - 180px)" }}>
              <div className="flex items-center gap-3 px-6 py-3 border-b shrink-0" style={{ borderColor: "var(--border)", backgroundColor: "var(--accent-light)" }}>
                <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                  <i className="ri-sparkling-2-fill text-white text-sm" />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>AI Tutor</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Ask anything about this task</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (questions.length > 0) { setQuizUnlocked(true); setFlowStep("quiz"); }
                    else { setCompleteUnlocked(true); setFlowStep("complete"); }
                  }}
                  className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${style.btn}`}
                >
                  {questions.length > 0 ? "I'm ready — Take Quiz →" : "Complete →"}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--accent-light)" }}>
                    <i className="ri-sparkling-2-fill text-sm" style={{ color: "var(--accent)" }} />
                  </div>
                  <div className="max-w-[80%] p-4 rounded-2xl rounded-tl-sm text-sm leading-relaxed border" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
                    Hi! I&apos;m your AI Tutor for <strong>&ldquo;{task.title}&rdquo;</strong>. Ask me anything about this task — concepts, steps, or anything you&apos;re unsure about.
                  </div>
                </div>

                {tutorMessages.length <= 1 && !tutorTyping && (
                  <div className="flex flex-col gap-2 pl-11">
                    <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Try asking:</p>
                    {[
                      "How do I get started with this task?",
                      "What's the most important thing to understand here?",
                      "Can you explain the key concepts?",
                    ].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setTutorInput(q)}
                        className="text-left text-xs px-3 py-2 rounded-xl border transition-all cursor-pointer"
                        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {tutorMessages.slice(1).map((msg, i) => (
                  <div key={i + 1} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: msg.role === "ai" ? "var(--accent-light)" : "var(--bg-elevated)" }}>
                      <i className={`${msg.role === "ai" ? "ri-sparkling-2-fill" : "ri-user-line"} text-sm`} style={{ color: msg.role === "ai" ? "var(--accent)" : "var(--text-muted)" }} />
                    </div>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === "ai" ? "rounded-tl-sm border" : "rounded-tr-sm"}`}
                      style={msg.role === "ai"
                        ? { backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-primary)" }
                        : { backgroundColor: "var(--accent)", color: "#fff" }
                      }
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {tutorTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--accent-light)" }}>
                      <i className="ri-sparkling-2-fill text-sm" style={{ color: "var(--accent)" }} />
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm border flex items-center gap-1.5" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "var(--text-muted)", animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "var(--text-muted)", animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "var(--text-muted)", animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="flex items-center gap-2 px-6 py-4 border-t shrink-0" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <input
                  type="text"
                  value={tutorInput}
                  onChange={(e) => setTutorInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleTutorSend(); }}
                  placeholder="Ask a follow-up question..."
                  className="flex-1 text-sm px-4 py-2.5 rounded-xl border focus:outline-none transition-all"
                  style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                />
                <button
                  type="button"
                  onClick={handleTutorSend}
                  disabled={tutorTyping}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-white transition-all cursor-pointer shrink-0"
                  style={{ backgroundColor: tutorTyping ? "var(--text-muted)" : "var(--accent)" }}
                >
                  <i className="ri-send-plane-fill text-sm" />
                </button>
              </div>
            </div>
          )}

          {/* QUIZ */}
          {flowStep === "quiz" && (
            <div className="p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i className="ri-question-answer-line text-violet-500" />
                  <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Knowledge Quiz</p>
                </div>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Question {quizIdx + 1} of {questions.length}</span>
              </div>

              <div className="flex gap-1.5">
                {questions.map((_, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < quizIdx ? "bg-emerald-400" : i === quizIdx ? style.bar : ""}`}
                    style={i > quizIdx ? { backgroundColor: "var(--bg-elevated)" } : {}} />
                ))}
              </div>

              <div>
                <p className="text-base font-semibold leading-snug mb-4" style={{ color: "var(--text-primary)" }}>{questions[quizIdx].question}</p>
                <div className="flex flex-col gap-2">
                  {questions[quizIdx].options.map((opt, i) => {
                    const isCorrect = selectedAnswer !== null && i === questions[quizIdx].correct;
                    const isWrong = selectedAnswer !== null && i === selectedAnswer && i !== questions[quizIdx].correct;
                    const isNeutral = selectedAnswer !== null && !isCorrect && !isWrong;
                    let bgColor = "var(--bg-elevated)";
                    let borderColor = "var(--border)";
                    let textColor = "var(--text-primary)";
                    let cursor = "cursor-pointer";
                    if (isCorrect) { bgColor = "var(--success-light)"; borderColor = "var(--success)"; cursor = "cursor-default"; }
                    else if (isWrong) { bgColor = "var(--danger-light)"; borderColor = "var(--danger)"; cursor = "cursor-default"; }
                    else if (isNeutral) { cursor = "cursor-default"; textColor = "var(--text-muted)"; }
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAnswerSelect(i)}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${cursor}`}
                        style={{ backgroundColor: bgColor, borderColor, color: textColor }}
                      >
                        <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold"
                          style={{
                            borderColor: isCorrect ? "var(--success)" : isWrong ? "var(--danger)" : "var(--border)",
                            backgroundColor: isCorrect ? "var(--success)" : isWrong ? "var(--danger)" : "transparent",
                            color: isCorrect || isWrong ? "#fff" : "var(--text-muted)",
                          }}
                        >
                          {isCorrect ? <i className="ri-check-line text-xs" /> : isWrong ? <i className="ri-close-line text-xs" /> : String.fromCharCode(65 + i)}
                        </div>
                        <span className="text-sm">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {answeredCorrect !== null && (
                <div className="p-4 rounded-xl border" style={{ backgroundColor: answeredCorrect ? "var(--success-light)" : "var(--warning-light)", borderColor: answeredCorrect ? "var(--success)" : "var(--warning)" }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <i className={`${answeredCorrect ? "ri-checkbox-circle-fill" : "ri-information-line"} text-base`} style={{ color: answeredCorrect ? "var(--success)" : "var(--warning)" }} />
                    <p className="text-xs font-semibold" style={{ color: answeredCorrect ? "var(--success)" : "var(--warning)" }}>
                      {answeredCorrect ? "Correct! Great job." : "Not quite — here's why:"}
                    </p>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{questions[quizIdx].explanation}</p>
                </div>
              )}

              {answeredCorrect !== null && (
                <button type="button" onClick={handleNextQuestion} className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition-all cursor-pointer whitespace-nowrap ${style.btn}`}>
                  {quizIdx < questions.length - 1 ? "Next Question →" : "Finish Quiz →"}
                </button>
              )}

              {answeredCorrect === null && (
                <button type="button" onClick={() => setFlowStep("learn")} className="w-full py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer whitespace-nowrap" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                  ← Back to AI Tutor
                </button>
              )}
            </div>
          )}

          {/* COMPLETE */}
          {flowStep === "complete" && (
            <div className="p-6 flex flex-col items-center text-center gap-5">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--success-light)" }}>
                <i className="ri-checkbox-circle-fill text-4xl" style={{ color: "var(--success)" }} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Task Complete!</h3>
                <p className="text-sm max-w-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  You&apos;ve finished all sub-tasks, reviewed the learning material, and passed the verification check.
                </p>
              </div>

              <div className="w-full p-4 rounded-xl border text-left" style={{ backgroundColor: "var(--accent-light)", borderColor: "var(--accent-light)" }}>
                <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>What you learned:</p>
                {task.aiTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1.5">
                    <i className="ri-check-line text-xs mt-0.5 shrink-0" style={{ color: "var(--success)" }} />
                    <p className="text-xs leading-snug" style={{ color: "var(--text-secondary)" }}>{tip.slice(0, 90)}...</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 w-full">
                <button type="button" onClick={() => { onTaskComplete(); onClose(); }} className={`flex-1 py-3 rounded-xl text-white font-semibold text-sm transition-all cursor-pointer whitespace-nowrap ${style.btn}`}>
                  <i className="ri-check-double-line mr-1.5" />
                  Mark Done &amp; Continue
                </button>
                <button type="button" onClick={onClose} className="px-4 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer whitespace-nowrap" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        {flowStep === "overview" && (
          <div className="border-t px-6 py-4 flex items-center gap-3 shrink-0" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <div className="flex-1 min-w-0">
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {allSubsDone ? "All sub-tasks done! Ready to learn." : `${doneSubs}/${task.subTasks.length} sub-tasks complete`}
              </p>
            </div>
            <button type="button" onClick={() => setFlowStep("learn")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all cursor-pointer whitespace-nowrap ${style.btn}`}>
              <i className="ri-sparkling-2-fill text-sm" />
              Ask AI Tutor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
