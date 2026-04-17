import { useState } from "react";

interface SessionFeedbackModalProps {
  mentorName: string;
  mentorPhoto: string;
  sessionTopic: string;
  sessionDate: string;
  onSubmit: (feedback: FeedbackData) => void;
  onSkip: () => void;
}

export interface FeedbackData {
  overallRating: number;
  criteria: {
    clarityOfGuidance: number;
    relevanceOfAdvice: number;
    communicationStyle: number;
    helpfulnessOfResources: number;
    overallSatisfaction: number;
  };
  comments: string;
  changeRequest: string;
}

const criteriaList = [
  { key: "clarityOfGuidance", label: "Clarity of guidance", icon: "ri-lightbulb-line" },
  { key: "relevanceOfAdvice", label: "Relevance of advice", icon: "ri-focus-3-line" },
  { key: "communicationStyle", label: "Communication style", icon: "ri-chat-smile-2-line" },
  { key: "helpfulnessOfResources", label: "Helpfulness of resources", icon: "ri-bookmark-line" },
  { key: "overallSatisfaction", label: "Overall satisfaction", icon: "ri-emotion-happy-line" },
] as const;

type CriteriaKey = typeof criteriaList[number]["key"];

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
          className="w-7 h-7 flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
        >
          <i className={`ri-star-fill text-lg transition-colors ${s <= (hovered || value) ? "text-amber-400" : ""}`}
            style={s > (hovered || value) ? { color: "var(--border)" } : {}} />
        </button>
      ))}
    </div>
  );
}

export default function SessionFeedbackModal({
  mentorName, mentorPhoto, sessionTopic, sessionDate, onSubmit, onSkip,
}: SessionFeedbackModalProps) {
  const [step, setStep] = useState<"rating" | "comments" | "done">("rating");
  const [overallRating, setOverallRating] = useState(0);
  const [criteria, setCriteria] = useState<Record<CriteriaKey, number>>({
    clarityOfGuidance: 0, relevanceOfAdvice: 0, communicationStyle: 0, helpfulnessOfResources: 0, overallSatisfaction: 0,
  });
  const [comments, setComments] = useState("");
  const [changeRequest, setChangeRequest] = useState("");

  const allCriteriaFilled = Object.values(criteria).every((v) => v > 0);
  const canProceed = overallRating > 0 && allCriteriaFilled;

  const handleCriteriaChange = (key: CriteriaKey, value: number) => {
    setCriteria((prev) => ({ ...prev, [key]: value }));
    if (key === "overallSatisfaction") setOverallRating(value);
  };

  const handleSubmit = () => {
    onSubmit({ overallRating, criteria, comments, changeRequest });
    setStep("done");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="rounded-3xl w-full max-w-md overflow-hidden" style={{ backgroundColor: "var(--bg-surface)" }}>
        {step === "done" ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "var(--success-light)" }}>
              <i className="ri-checkbox-circle-fill text-3xl" style={{ color: "var(--success)" }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Thanks for your feedback!</h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
              Your rating helps {mentorName} grow as a mentor. It stays private and is used to improve future sessions.
            </p>
            <button type="button" onClick={onSkip} className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all cursor-pointer whitespace-nowrap" style={{ backgroundColor: "var(--accent)" }}>
              Continue to Summary
            </button>
          </div>
        ) : (
          <>
            <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <img src={mentorPhoto} alt={mentorName} className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Rate your session with {mentorName}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{sessionTopic} · {sessionDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: step === "rating" ? "var(--accent)" : "var(--success)" }} />
                <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: step === "comments" ? "var(--accent)" : "var(--bg-elevated)" }} />
              </div>
            </div>

            {step === "rating" && (
              <div className="px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: "var(--text-muted)" }}>Rate each area</p>
                <div className="flex flex-col gap-4">
                  {criteriaList.map((c) => (
                    <div key={c.key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ backgroundColor: "var(--bg-elevated)" }}>
                          <i className={`${c.icon} text-sm`} style={{ color: "var(--text-muted)" }} />
                        </div>
                        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{c.label}</span>
                      </div>
                      <StarPicker value={criteria[c.key]} onChange={(v) => handleCriteriaChange(c.key, v)} />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <button type="button" onClick={onSkip} className="flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer whitespace-nowrap" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                    Skip
                  </button>
                  <button type="button" onClick={() => setStep("comments")} disabled={!canProceed}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap"
                    style={{ backgroundColor: canProceed ? "var(--accent)" : "var(--bg-elevated)", color: canProceed ? "#fff" : "var(--text-muted)", cursor: canProceed ? "pointer" : "not-allowed" }}>
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === "comments" && (
              <div className="px-6 py-5">
                <div className="mb-5">
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--text-muted)" }}>
                    Any comments? <span className="font-normal normal-case" style={{ color: "var(--text-disabled)" }}>(optional)</span>
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="What went well? What could be better?"
                    maxLength={300}
                    rows={3}
                    className="w-full text-sm rounded-xl px-4 py-3 resize-none focus:outline-none transition-all border"
                    style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                  />
                  <p className="text-xs text-right mt-1" style={{ color: "var(--text-muted)" }}>{comments.length}/300</p>
                </div>
                <div className="mb-5">
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--text-muted)" }}>
                    Anything you&apos;d like changed next time? <span className="font-normal normal-case" style={{ color: "var(--text-disabled)" }}>(optional)</span>
                  </label>
                  <textarea
                    value={changeRequest}
                    onChange={(e) => setChangeRequest(e.target.value)}
                    placeholder="e.g. More hands-on exercises, slower pace..."
                    maxLength={200}
                    rows={2}
                    className="w-full text-sm rounded-xl px-4 py-3 resize-none focus:outline-none transition-all border"
                    style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                  />
                  <p className="text-xs text-right mt-1" style={{ color: "var(--text-muted)" }}>{changeRequest.length}/200</p>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setStep("rating")} className="flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer whitespace-nowrap" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                    Back
                  </button>
                  <button type="button" onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all cursor-pointer whitespace-nowrap" style={{ backgroundColor: "var(--accent)" }}>
                    Submit Feedback
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
