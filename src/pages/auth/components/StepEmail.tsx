import { useState } from "react";

interface Props {
  onNext: (email: string) => void;
}

export default function StepEmail({ onNext }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) { setError("Please enter a valid email address."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); onNext(email); }, 900);
  };

  return (
    <div className="w-full max-w-[380px] mx-auto lg:mx-0">
      <div className="flex items-center gap-2.5 mb-10 lg:hidden">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#7C3AED" }}>
          <i className="ri-sparkling-2-fill text-white" />
        </div>
        <span className="font-black text-xl tracking-tight" style={{ color: "var(--text-primary)" }}>GrowthFlow</span>
      </div>

      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--accent-text)" }}>Step 1 of 3</p>
        <h1 className="text-[1.85rem] font-black tracking-tight leading-tight mb-2" style={{ color: "var(--text-primary)" }}>
          What&apos;s your email?
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          We&apos;ll send a quick code to verify it&apos;s you. No password needed.
        </p>
      </div>

      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer mb-5"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}
      >
        <i className="ri-google-fill text-base" style={{ color: "#EA4335" }} />
        Continue with Google
      </button>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>or use your email</span>
        <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <div className="relative">
            <i className="ri-mail-line absolute left-3.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--text-muted)" }} />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="you@example.com"
              autoFocus
              className="w-full pl-10 pr-4 py-3.5 rounded-xl border text-sm outline-none transition-all"
              style={{
                borderColor: error ? "#ef4444" : "var(--border)",
                backgroundColor: error ? "var(--danger-light)" : "var(--bg-elevated)",
                color: "var(--text-primary)",
              }}
              onFocus={(e) => { if (!error) { e.currentTarget.style.borderColor = "#7C3AED"; } }}
              onBlur={(e) => { if (!error) { e.currentTarget.style.borderColor = "var(--border)"; } }}
            />
          </div>
          {error && (
            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
              <i className="ri-error-warning-line" />
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] disabled:opacity-70"
          style={{ background: "#7C3AED" }}
        >
          {loading ? (
            <><i className="ri-loader-4-line animate-spin" />Sending code...</>
          ) : (
            <>Continue<i className="ri-arrow-right-line" /></>
          )}
        </button>
      </form>

      <div className="flex items-center justify-center gap-5 mt-8 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
        {[
          { icon: "ri-shield-check-line", text: "Secure & Private" },
          { icon: "ri-star-fill", text: "4.9 / 5 Rating" },
        ].map((b) => (
          <div key={b.text} className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-muted)" }}>
            <i className={`${b.icon} text-xs`} />
            {b.text}
          </div>
        ))}
      </div>
    </div>
  );
}
