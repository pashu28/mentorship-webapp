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
          <i
            className={`ri-star-fill text-lg transition-colors ${
              s <= (hovered || value) ? "text-amber-400" : "text-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function SessionFeedbackModal({
  mentorName,
  mentorPhoto,
  sessionTopic,
  sessionDate,
  onSubmit,
  onSkip,
}: SessionFeedbackModalProps) {
  const [step, setStep] = useState<"rating" | "comments" | "done">("rating");
  const [overallRating, setOverallRating] = useState(0);
  const [criteria, setCriteria] = useState<Record<CriteriaKey, number>>({
    clarityOfGuidance: 0,
    relevanceOfAdvice: 0,
    communicationStyle: 0,
    helpfulnessOfResources: 0,
    overallSatisfaction: 0,
  });
  const [comments, setComments] = useState("");
  const [changeRequest, setChangeRequest] = useState("");

  const allCriteriaFilled = Object.values(criteria).every((v) => v > 0);
  const canProceed = overallRating > 0 && allCriteriaFilled;

  const handleCriteriaChange = (key: CriteriaKey, value: number) => {
    setCriteria((prev) => ({ ...prev, [key]: value }));
    // Auto-set overall if not set yet
    if (key === "overallSatisfaction") setOverallRating(value);
  };

  const handleSubmit = () => {
    onSubmit({ overallRating, criteria, comments, changeRequest });
    setStep("done");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {step === "done" ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-checkbox-circle-fill text-emerald-500 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Thanks for your feedback!</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Your rating helps {mentorName} grow as a mentor. It stays private and is used to improve future sessions.
            </p>
            <button
              type="button"
              onClick={onSkip}
              className="w-full py-3 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 transition-all cursor-pointer whitespace-nowrap"
            >
              Continue to Summary
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <img src={mentorPhoto} alt={mentorName} className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Rate your session with {mentorName}</p>
                  <p className="text-xs text-gray-400">{sessionTopic} · {sessionDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`flex-1 h-1 rounded-full ${step === "rating" ? "bg-gray-900" : "bg-emerald-400"}`} />
                <div className={`flex-1 h-1 rounded-full ${step === "comments" ? "bg-gray-900" : "bg-gray-200"}`} />
              </div>
            </div>

            {step === "rating" && (
              <div className="px-6 py-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Rate each area</p>
                <div className="flex flex-col gap-4">
                  {criteriaList.map((c) => (
                    <div key={c.key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50">
                          <i className={`${c.icon} text-gray-500 text-sm`} />
                        </div>
                        <span className="text-sm text-gray-700">{c.label}</span>
                      </div>
                      <StarPicker
                        value={criteria[c.key]}
                        onChange={(v) => handleCriteriaChange(c.key, v)}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <button
                    type="button"
                    onClick={onSkip}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("comments")}
                    disabled={!canProceed}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      canProceed
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === "comments" && (
              <div className="px-6 py-5">
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Any comments? <span className="text-gray-300 font-normal normal-case">(optional)</span>
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="What went well? What could be better?"
                    maxLength={300}
                    rows={3}
                    className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 placeholder-gray-300 transition-all"
                  />
                  <p className="text-xs text-gray-300 text-right mt-1">{comments.length}/300</p>
                </div>

                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Anything you&apos;d like changed next time? <span className="text-gray-300 font-normal normal-case">(optional)</span>
                  </label>
                  <textarea
                    value={changeRequest}
                    onChange={(e) => setChangeRequest(e.target.value)}
                    placeholder="e.g. More hands-on exercises, slower pace..."
                    maxLength={200}
                    rows={2}
                    className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 placeholder-gray-300 transition-all"
                  />
                  <p className="text-xs text-gray-300 text-right mt-1">{changeRequest.length}/200</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("rating")}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-all cursor-pointer whitespace-nowrap"
                  >
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
