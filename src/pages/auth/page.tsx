import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LeftPanel from "./components/LeftPanel";
import StepEmail from "./components/StepEmail";
import StepOTP from "./components/StepOTP";
import StepProfile from "./components/StepProfile";

type Step = "email" | "otp" | "profile";

export default function AuthPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleEmailNext = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep("otp");
  };

  const handleOTPVerified = () => {
    setStep("profile");
  };

  const handleChangeEmail = () => {
    setStep("email");
  };

  const handleProfileNext = (name: string, occupation: string) => {
    // Pass name + occupation to intake via state
    navigate("/intake", { state: { name, occupation, isNew: true } });
  };

  return (
    <div className="min-h-screen flex">
      <LeftPanel />

      {/* Right panel */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center px-8 py-12 lg:px-12 bg-white min-h-screen">
        {/* Step content */}
        <div className="transition-all duration-300 w-full flex justify-center">
          {step === "email" && (
            <StepEmail onNext={handleEmailNext} />
          )}
          {step === "otp" && (
            <StepOTP
              email={email}
              onVerified={handleOTPVerified}
              onChangeEmail={handleChangeEmail}
            />
          )}
          {step === "profile" && (
            <StepProfile onNext={handleProfileNext} />
          )}
        </div>
      </div>
    </div>
  );
}
