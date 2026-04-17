import { useState, useRef, useEffect } from "react";

interface SubTask {
  id: string;
  text: string;
  done: boolean;
}

interface VerificationQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface TaskDetailPanelProps {
  taskId: string;
  taskText: string;
  stepTitle: string;
  stepColor: string;
  subTasks: SubTask[];
  onSubTaskToggle: (subId: string) => void;
  onTaskComplete: () => void;
  onClose: () => void;
}

const VERIFICATION_QUESTIONS: Record<string, VerificationQuestion[]> = {
  t1: [
    {
      question: "What does Auto Layout in Figma primarily help you do?",
      options: [
        "Add animations to your designs",
        "Create frames that resize automatically based on content",
        "Export designs to code",
        "Manage color styles",
      ],
      correct: 1,
      explanation: "Auto Layout creates frames that automatically resize when content changes — just like CSS Flexbox. It's one of Figma's most powerful features for building responsive components.",
    },
    {
      question: "Which of these is a key benefit of using Components in Figma?",
      options: [
        "They make files load faster",
        "They allow you to reuse design elements and update them globally",
        "They automatically generate code",
        "They replace the need for Auto Layout",
      ],
      correct: 1,
      explanation: "Components let you create a master element and reuse it across your design. Update the master and all instances update automatically — huge time saver!",
    },
  ],
  t2: [
    {
      question: "According to NNGroup, what is the most important section of a UX case study?",
      options: [
        "The final visual designs",
        "The problem statement and your process",
        "The tools you used",
        "The number of screens designed",
      ],
      correct: 1,
      explanation: "NNGroup emphasizes that recruiters care most about HOW you think and solve problems — your process, research, and decision-making — not just the final visuals.",
    },
  ],
  t3: [
    {
      question: "What is the main focus of Google UX Design Certificate Module 1?",
      options: [
        "Advanced Figma techniques",
        "Foundations of UX design and the design process",
        "Building a portfolio website",
        "Conducting usability tests",
      ],
      correct: 1,
      explanation: "Module 1 covers the fundamentals — what UX design is, the design process, and the role of a UX designer. It sets the foundation for everything that follows.",
    },
  ],
  t4: [
    {
      question: "A strong problem statement should include:",
      options: [
        "The solution you plan to build",
        "The user, their need, and supporting data",
        "A list of competitors",
        "Your personal opinion about the problem",
      ],
      correct: 1,
      explanation: "A great problem statement identifies WHO has the problem, WHAT the problem is, and WHY it matters (backed by data). Your 34% drop-off stat is perfect supporting evidence!",
    },
  ],
  t5: [
    {
      question: "Why should you export Figma assets at 2x resolution?",
      options: [
        "It makes files smaller",
        "It ensures crisp display on high-DPI (Retina) screens",
        "It's required for portfolio submissions",
        "It automatically compresses images",
      ],
      correct: 1,
      explanation: "2x (or @2x) exports ensure your designs look sharp on Retina and high-DPI displays. At 1x, images can appear blurry on modern screens.",
    },
  ],
  t6: [
    {
      question: "What should the 'Outcomes' section of your case study highlight?",
      options: [
        "All the design iterations you made",
        "Measurable results and what you learned",
        "The tools and software used",
        "Your personal design preferences",
      ],
      correct: 1,
      explanation: "Outcomes should show impact — metrics like 'reduced drop-off by 34%' or 'increased task completion by 20%'. Quantifiable results make your case study stand out.",
    },
  ],
  t7: [
    {
      question: "What makes a LinkedIn outreach message effective?",
      options: [
        "Keeping it generic so it applies to everyone",
        "Personalizing it with a specific reason you admire their work",
        "Asking for a job immediately",
        "Making it as long as possible",
      ],
      correct: 1,
      explanation: "Personalization is key. Mention something specific about their work or career path. People respond to genuine interest, not copy-paste templates.",
    },
  ],
  t8: [
    {
      question: "What is ADPList primarily used for?",
      options: [
        "Selling design assets",
        "Connecting mentees with free mentors in tech and design",
        "Finding freelance design work",
        "Hosting design portfolios",
      ],
      correct: 1,
      explanation: "ADPList is a free mentorship platform where experienced designers and tech professionals offer their time to help others grow. It's a goldmine for career guidance!",
    },
  ],
  t9: [
    {
      question: "What is Mobbin best used for?",
      options: [
        "Creating wireframes",
        "Exploring real-world UI patterns and app screenshots for inspiration",
        "Generating design assets with AI",
        "Collaborating on Figma files",
      ],
      correct: 1,
      explanation: "Mobbin is a curated library of real app screenshots organized by pattern type. It's perfect for researching how top apps handle specific UI challenges.",
    },
  ],
};

const AI_EXPLANATIONS: Record<string, string[]> = {
  t1: [
    "Auto Layout in Figma works like CSS Flexbox — elements stack and resize automatically. Start by selecting a frame, then enable Auto Layout from the right panel (or press Shift+A).",
    "Components are reusable design elements. Create a master component, then use instances throughout your design. Change the master and all instances update instantly.",
  ],
  t2: [
    "NNGroup case studies follow a clear structure: Problem → Research → Process → Solution → Outcomes. The key is showing your thinking, not just the final design.",
    "Your 34% drop-off stat is gold — lead with it in your problem statement. Data-backed problem statements immediately grab recruiter attention.",
  ],
  t3: [
    "Module 1 covers the UX design process: Empathize → Define → Ideate → Prototype → Test. This framework will guide every project you work on.",
    "The certificate is free to audit on Coursera. Focus on the quizzes and assignments — they reinforce the concepts much better than just watching videos.",
  ],
  t4: [
    "Your problem statement formula: '[User type] needs [need] because [insight/data].' Example: 'New users need a clearer onboarding flow because 34% drop off before completing setup.'",
    "Keep it to 2-3 sentences max. Recruiters skim — make every word count.",
  ],
  t5: [
    "In Figma, select all screens → right-click → Export. Choose PNG at 2x. Create folders: /screens, /components, /icons. Label files clearly: 01-onboarding-welcome.png",
    "Organized assets show professionalism. Recruiters and hiring managers often look at your file structure as a signal of how you work.",
  ],
  t6: [
    "Use the NNGroup template as a skeleton: Overview → Problem → Research → Process → Solution → Outcomes. Fill each section with your actual work.",
    "For your onboarding redesign: Problem = 34% drop-off. Research = user interviews or analytics. Process = wireframes → prototypes → testing. Outcome = improved completion rate.",
  ],
  t7: [
    "Template: 'Hi [Name], I came across your work at [Company] and was really impressed by [specific thing]. I'm transitioning into UX and would love to connect and learn from your journey.'",
    "Keep it under 3 sentences. Don't ask for anything in the first message — just connect. The conversation can grow from there.",
  ],
  t8: [
    "On ADPList, fill your profile completely — goals, background, what you're looking for. Mentors choose who to help based on your profile.",
    "Search for UX designers at companies you admire. Many offer free 30-min sessions. Book 2-3 to start — each conversation will teach you something different.",
  ],
  t9: [
    "On Mobbin, filter by category (Onboarding, Navigation, Cards, etc.) and platform (iOS/Android/Web). Screenshot patterns that solve problems similar to yours.",
    "Build a personal swipe file — a folder of UI patterns you love. Reference it when you're designing. The best designers steal (and improve) from the best.",
  ],
};

type FlowStep = "subtasks" | "learn" | "quiz" | "complete";

export default function TaskDetailPanel({
  taskId,
  taskText,
  stepTitle,
  stepColor,
  subTasks,
  onSubTaskToggle,
  onTaskComplete,
  onClose,
}: TaskDetailPanelProps) {
  const [flowStep, setFlowStep] = useState<FlowStep>("subtasks");
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answeredCorrect, setAnsweredCorrect] = useState<boolean | null>(null);
  const [tutorInput, setTutorInput] = useState("");
  const [tutorMessages, setTutorMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [tutorTyping, setTutorTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const explanations = AI_EXPLANATIONS[taskId] ?? ["Great task! Work through the sub-tasks step by step.", "Take your time and don't hesitate to ask the AI Tutor if you get stuck."];
  const questions = VERIFICATION_QUESTIONS[taskId] ?? [];
  const doneSubs = subTasks.filter((s) => s.done).length;
  const allSubsDone = doneSubs === subTasks.length;

  useEffect(() => {
    if (flowStep === "learn" && tutorMessages.length === 0) {
      const initialMessages: { role: "user" | "ai"; text: string }[] = explanations.map((exp) => ({
        role: "ai",
        text: exp,
      }));
      setTutorMessages(initialMessages);
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
    const q = questions[quizIdx];
    const correct = idx === q.correct;
    setAnsweredCorrect(correct);
  };

  const handleNextQuestion = () => {
    if (quizIdx < questions.length - 1) {
      setQuizIdx((p) => p + 1);
      setSelectedAnswer(null);
      setAnsweredCorrect(null);
    } else {
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
      const aiReply = explanations[Math.floor(Math.random() * explanations.length)];
      setTutorMessages((prev) => [...prev, { role: "ai", text: aiReply }]);
      setTutorTyping(false);
    }, 1000);
  };

  const accentBtn =
    stepColor === "violet"
      ? "bg-violet-600 hover:bg-violet-700"
      : stepColor === "emerald"
      ? "bg-emerald-600 hover:bg-emerald-700"
      : "bg-amber-500 hover:bg-amber-600";

  const barColor =
    stepColor === "violet"
      ? "bg-violet-500"
      : stepColor === "emerald"
      ? "bg-emerald-500"
      : "bg-amber-500";

  const FLOW_TABS: { id: FlowStep; label: string; icon: string }[] = [
    { id: "subtasks", label: "Sub-tasks", icon: "ri-list-check-2" },
    { id: "learn", label: "AI Tutor", icon: "ri-sparkling-2-fill" },
    { id: "quiz", label: "Verify", icon: "ri-question-answer-line" },
    { id: "complete", label: "Complete", icon: "ri-checkbox-circle-line" },
  ];

  const stepOrder: FlowStep[] = ["subtasks", "learn", "quiz", "complete"];
  const currentIdx = stepOrder.indexOf(flowStep);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div
        ref={panelRef}
        className="rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "var(--bg-surface)", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 border-b px-6 py-4 flex items-start gap-3"
          style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}
        >
          <div
            className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
            style={{
              backgroundColor:
                stepColor === "violet" ? "#7c3aed" : stepColor === "emerald" ? "#10b981" : "#f59e0b",
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{stepTitle}</p>
            <h2 className="text-base font-bold leading-snug mt-0.5" style={{ color: "var(--text-primary)" }}>{taskText}</h2>
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
        <div className="flex items-center gap-0 px-6 pt-4 pb-0 border-b" style={{ borderColor: "var(--border)" }}>
          {FLOW_TABS.map((tab, i) => {
            const isActive = flowStep === tab.id;
            const isPast = currentIdx > i;
            const isClickable = isPast || isActive;
            return (
              <div key={tab.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => { if (isClickable) setFlowStep(tab.id); }}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap -mb-px ${
                    isActive
                      ? "border-violet-500 text-violet-400"
                      : isClickable
                      ? "border-transparent cursor-pointer"
                      : "border-transparent cursor-not-allowed"
                  }`}
                  style={!isActive ? { color: isClickable ? "var(--text-muted)" : "var(--text-disabled)" } : {}}
                >
                  <i className={`${tab.icon} text-sm`} />
                  {tab.label}
                  {isPast && <i className="ri-check-line text-emerald-400 text-xs" />}
                </button>
                {i < 3 && (
                  <i className="ri-arrow-right-s-line text-sm" style={{ color: "var(--border)" }} />
                )}
              </div>
            );
          })}
        </div>

        <div className="px-6 py-5">

          {/* STEP 1: Sub-tasks */}
          {flowStep === "subtasks" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>Complete these steps first</p>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{doneSubs}/{subTasks.length} done</span>
              </div>

              <div className="flex flex-col gap-2 mb-5">
                {subTasks.map((sub, idx) => (
                  <div
                    key={sub.id}
                    className="flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer"
                    style={{
                      backgroundColor: sub.done ? "var(--bg-elevated)" : "var(--bg-surface)",
                      borderColor: "var(--border)",
                      opacity: sub.done ? 0.7 : 1,
                    }}
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
                    <p
                      className={`text-sm flex-1 ${sub.done ? "line-through" : ""}`}
                      style={{ color: sub.done ? "var(--text-muted)" : "var(--text-primary)" }}
                    >
                      {sub.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-elevated)" }}>
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                    style={{ width: `${subTasks.length > 0 ? Math.round((doneSubs / subTasks.length) * 100) : 0}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFlowStep("learn")}
                className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition-all cursor-pointer whitespace-nowrap ${accentBtn} ${!allSubsDone ? "opacity-60" : ""}`}
              >
                {allSubsDone ? "Ask AI Tutor →" : `Complete sub-tasks to continue (${doneSubs}/${subTasks.length})`}
              </button>
              {!allSubsDone && (
                <>
                  <p className="text-center text-xs mt-2" style={{ color: "var(--text-muted)" }}>You can still preview the AI Tutor below</p>
                  <button
                    type="button"
                    onClick={() => setFlowStep("learn")}
                    className="w-full mt-1 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Preview anyway →
                  </button>
                </>
              )}
            </div>
          )}

          {/* STEP 2: AI Tutor */}
          {flowStep === "learn" && (
            <div className="flex flex-col" style={{ minHeight: "420px" }}>
              {/* Chat header */}
              <div className="flex items-center gap-3 p-3 rounded-xl border mb-4 shrink-0" style={{ backgroundColor: "var(--accent-light)", borderColor: "var(--border)" }}>
                <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                  <i className="ri-sparkling-2-fill text-white text-sm" />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>AI Tutor</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Ask anything about this task</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFlowStep(questions.length > 0 ? "quiz" : "complete")}
                  className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${accentBtn}`}
                >
                  {questions.length > 0 ? "Take Quiz →" : "Complete →"}
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex flex-col gap-4 mb-4 overflow-y-auto flex-1" style={{ maxHeight: "320px" }}>
                {tutorMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: msg.role === "ai" ? "var(--accent-light)" : "var(--bg-elevated)" }}
                    >
                      <i
                        className={`${msg.role === "ai" ? "ri-sparkling-2-fill" : "ri-user-line"} text-sm`}
                        style={{ color: msg.role === "ai" ? "var(--accent-text)" : "var(--text-muted)" }}
                      />
                    </div>
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === "ai" ? "rounded-tl-sm border" : "rounded-tr-sm"}`}
                      style={
                        msg.role === "ai"
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
                      <i className="ri-sparkling-2-fill text-sm" style={{ color: "var(--accent-text)" }} />
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

              {/* Chat input */}
              <div className="flex items-center gap-2 pt-3 border-t shrink-0" style={{ borderColor: "var(--border)" }}>
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

          {/* STEP 3: Quiz */}
          {flowStep === "quiz" && questions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <i className="ri-question-answer-line" style={{ color: "var(--accent-text)" }} />
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Verification Check</p>
                </div>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Question {quizIdx + 1} of {questions.length}</span>
              </div>

              {/* Progress dots */}
              <div className="flex gap-1.5 mb-5">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                      i < quizIdx ? "bg-emerald-400" : i === quizIdx ? barColor : ""
                    }`}
                    style={i > quizIdx ? { backgroundColor: "var(--bg-elevated)" } : {}}
                  />
                ))}
              </div>

              <div className="mb-5">
                <p className="text-base font-semibold leading-snug mb-4" style={{ color: "var(--text-primary)" }}>
                  {questions[quizIdx].question}
                </p>
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
                        <div
                          className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold"
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

              {/* Explanation */}
              {answeredCorrect !== null && (
                <div
                  className="p-4 rounded-xl border mb-5"
                  style={{
                    backgroundColor: answeredCorrect ? "var(--success-light)" : "var(--warning-light)",
                    borderColor: answeredCorrect ? "var(--success)" : "var(--warning)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <i
                      className={`${answeredCorrect ? "ri-checkbox-circle-fill" : "ri-information-line"} text-base`}
                      style={{ color: answeredCorrect ? "var(--success)" : "var(--warning)" }}
                    />
                    <p className="text-xs font-semibold" style={{ color: answeredCorrect ? "var(--success)" : "var(--warning)" }}>
                      {answeredCorrect ? "Correct! Great job." : "Not quite — here's why:"}
                    </p>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{questions[quizIdx].explanation}</p>
                </div>
              )}

              {answeredCorrect !== null && (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition-all cursor-pointer whitespace-nowrap ${accentBtn}`}
                >
                  {quizIdx < questions.length - 1 ? "Next Question →" : "Finish Quiz →"}
                </button>
              )}
            </div>
          )}

          {/* STEP 4: Complete */}
          {flowStep === "complete" && (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "var(--success-light)" }}>
                <i className="ri-checkbox-circle-fill text-4xl" style={{ color: "var(--success)" }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Task Complete!</h3>
              <p className="text-sm mb-1 max-w-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                You&apos;ve finished all sub-tasks, reviewed the learning material, and passed the verification check.
              </p>
              <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>Keep the momentum going — your next task is waiting.</p>

              <div className="w-full p-4 rounded-xl border mb-6 text-left" style={{ backgroundColor: "var(--accent-light)", borderColor: "var(--border)" }}>
                <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>What you learned:</p>
                {explanations.map((exp, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1.5">
                    <i className="ri-check-line text-xs mt-0.5 shrink-0" style={{ color: "var(--success)" }} />
                    <p className="text-xs leading-snug" style={{ color: "var(--text-secondary)" }}>{exp.slice(0, 80)}...</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={() => { onTaskComplete(); onClose(); }}
                  className={`flex-1 py-3 rounded-xl text-white font-semibold text-sm transition-all cursor-pointer whitespace-nowrap ${accentBtn}`}
                >
                  <i className="ri-check-double-line mr-1.5" />
                  Mark Done &amp; Continue
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer whitespace-nowrap"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
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
