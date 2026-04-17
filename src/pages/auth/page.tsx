import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LeftPanel from "./components/LeftPanel";
import StepEmail from "./components/StepEmail";
import StepOTP from "./components/StepOTP";
import StepProfile from "./components/StepProfile";

type Step = "email" | "otp" | "profile";

const STEP_ORDER: Step[] = ["email", "otp", "profile"];

function stepIndex(s: Step) {
  return STEP_ORDER.indexOf(s);
}

export default function AuthPage() {
  const location = useLocation();
  const returnToProfile = (location.state as { returnToProfile?: boolean })?.returnToProfile;
  const [step, setStep] = useState<Step>(returnToProfile ? "profile" : "email");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleEmailNext = (submittedEmail: string) => {
    setEmail(submittedEmail);
    localStorage.setItem("mentorAI_userEmail", submittedEmail);
    setStep("otp");
  };

  const handleOTPVerified = () => setStep("profile");
  const handleChangeEmail = () => setStep("email");

  const handleProfileNext = (name: string, occupation: string) => {
    localStorage.setItem("mentorAI_userName", name);
    localStorage.setItem("mentorAI_userOccupation", occupation);
    navigate("/intake", { state: { name, occupation, isNew: true } });
  };

  const goToStep = (target: Step) => {
    if (stepIndex(target) < stepIndex(step)) setStep(target);
  };

  const currentIdx = stepIndex(step);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--bg-base)" }}>
      <LeftPanel />

      {/* Right panel */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center px-8 py-12 lg:px-12 min-h-screen" style={{ backgroundColor: "var(--bg-surface)" }}>
        {/* Progress stepper */}
        <div className="w-full max-w-[420px] mb-10">
          <div className="flex items-center gap-2">
            {STEP_ORDER.map((s, i) => {
              const isCompleted = i < currentIdx;
              const isActive = i === currentIdx;
              const canClick = i < currentIdx;
              return (
                <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
                  <button
                    type="button"
                    onClick={() => goToStep(s)}
                    disabled={!canClick}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap shrink-0"
                    style={{
                      background: isCompleted || isActive ? "#7C3AED" : "var(--bg-elevated)",
                      color: isCompleted || isActive ? "#fff" : "var(--text-muted)",
                      cursor: canClick ? "pointer" : "default",
                    }}
                  >
                    {isCompleted ? <i className="ri-check-line text-sm" /> : i + 1}
                  </button>
                  {i < STEP_ORDER.length - 1 && (
                    <div
                      className="flex-1 h-0.5 rounded-full transition-all duration-300"
                      style={{ background: i < currentIdx ? "#7C3AED" : "var(--border)" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="transition-all duration-300 w-full flex justify-center">
          {step === "email" && <StepEmail onNext={handleEmailNext} />}
          {step === "otp" && <StepOTP email={email} onVerified={handleOTPVerified} onChangeEmail={handleChangeEmail} />}
          {step === "profile" && <StepProfile onNext={handleProfileNext} />}
        </div>
      </div>
    </div>
  );
}
