import { useState, useRef, useEffect, useCallback } from "react";

interface Props {
  email: string;
  onVerified: () => void;
  onChangeEmail: () => void;
}

const OTP_LENGTH = 6;

export default function StepOTP({ email, onVerified, onChangeEmail }: Props) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(30);
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const submitOTP = useCallback((_code: string[]) => {
    setVerifying(true);
    setError("");
    setTimeout(() => { setVerifying(false); onVerified(); }, 1000);
  }, [onVerified]);

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setError("");
    if (char && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    if (char && index === OTP_LENGTH - 1 && next.every((d) => d !== "")) submitOTP(next);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) { const next = [...digits]; next[index] = ""; setDigits(next); }
      else if (index > 0) { inputRefs.current[index - 1]?.focus(); const next = [...digits]; next[index - 1] = ""; setDigits(next); }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((c, i) => { next[i] = c; });
    setDigits(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
    if (pasted.length === OTP_LENGTH) submitOTP(next);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setDigits(Array(OTP_LENGTH).fill(""));
    setError("");
    setResendCooldown(30);
    inputRefs.current[0]?.focus();
  };

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(Math.min(b.length, 4)) + c);

  return (
    <div className="w-full max-w-[380px] mx-auto lg:mx-0">
      <div className="flex items-center gap-2.5 mb-10 lg:hidden">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#7C3AED" }}>
          <i className="ri-sparkling-2-fill text-white" />
        </div>
        <span className="font-black text-xl tracking-tight" style={{ color: "var(--text-primary)" }}>GrowthFlow</span>
      </div>

      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--accent-text)" }}>Step 2 of 3</p>
        <h1 className="text-[1.85rem] font-black tracking-tight leading-tight mb-2" style={{ color: "var(--text-primary)" }}>
          Check your inbox
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          We sent a 6-digit code to{" "}
          <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>{maskedEmail}</span>
        </p>
      </div>

      <div className="flex gap-1.5 mb-3" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={verifying}
            className="w-0 flex-1 h-11 text-center text-lg font-black rounded-lg border-2 outline-none transition-all duration-150 cursor-text disabled:opacity-50 min-w-0"
            style={{
              borderColor: error ? "#ef4444" : d ? "#7C3AED" : "var(--border)",
              backgroundColor: error ? "var(--danger-light)" : d ? "var(--accent-light)" : "var(--bg-elevated)",
              color: "var(--text-primary)",
            }}
          />
        ))}
      </div>

      {error && (
        <p className="text-xs text-red-500 mb-3 flex items-center gap-1">
          <i className="ri-error-warning-line" />
          {error}
        </p>
      )}

      {verifying && (
        <div className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: "var(--accent-text)" }}>
          <i className="ri-loader-4-line animate-spin" />
          Verifying...
        </div>
      )}

      <div className="flex items-center justify-between mt-5">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendCooldown > 0}
          className="text-sm font-semibold transition-opacity cursor-pointer disabled:cursor-default"
          style={{ color: resendCooldown > 0 ? "var(--text-muted)" : "#7C3AED" }}
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
        </button>
        <button
          type="button"
          onClick={onChangeEmail}
          className="text-sm transition-colors cursor-pointer"
          style={{ color: "var(--text-muted)" }}
        >
          Change email
        </button>
      </div>

      <p className="text-xs mt-6 text-center" style={{ color: "var(--text-muted)" }}>
        Didn&apos;t get it? Check your spam folder or try resending.
      </p>
    </div>
  );
}
