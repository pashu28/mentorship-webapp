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
    if (!isValid) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      setLoading(false);
      onNext(email);
    }, 900);
  };

  return (
    <div className="w-full max-w-[380px] mx-auto lg:mx-0">
      {/* Mobile logo */}
      <div className="flex items-center gap-2.5 mb-10 lg:hidden">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#7C3AED" }}>
          <i className="ri-sparkling-2-fill text-white" />
        </div>
        <span className="font-black text-xl text-gray-900 tracking-tight">MentorAI</span>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-2">Step 1 of 3</p>
        <h1 className="text-[1.85rem] font-black text-gray-900 tracking-tight leading-tight mb-2">
          What's your email?
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          We'll send a quick code to verify it's you. No password needed.
        </p>
      </div>

      {/* Google button */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer mb-5"
      >
        <i className="ri-google-fill text-base" style={{ color: "#EA4335" }} />
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">or use your email</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Email form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <div className="relative">
            <i className="ri-mail-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="you@example.com"
              autoFocus
              className="w-full pl-10 pr-4 py-3.5 rounded-xl border text-sm text-gray-900 placeholder-gray-300 outline-none transition-all"
              style={{
                borderColor: error ? "#ef4444" : "#e5e7eb",
                background: error ? "#fff5f5" : "#f9fafb",
              }}
              onFocus={(e) => {
                if (!error) {
                  e.currentTarget.style.borderColor = "#7C3AED";
                  e.currentTarget.style.background = "#faf5ff";
                }
              }}
              onBlur={(e) => {
                if (!error) {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.background = "#f9fafb";
                }
              }}
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
            <>
              <i className="ri-loader-4-line animate-spin" />
              Sending code...
            </>
          ) : (
            <>
              Send my code
              <i className="ri-arrow-right-line" />
            </>
          )}
        </button>
      </form>

      {/* Trust */}
      <div className="flex items-center justify-center gap-5 mt-8 pt-6 border-t border-gray-100">
        {[
          { icon: "ri-shield-check-line", text: "Secure & Private" },
          { icon: "ri-star-fill", text: "4.9 / 5 Rating" },
        ].map((b) => (
          <div key={b.text} className="flex items-center gap-1.5 text-gray-400 text-[11px]">
            <i className={`${b.icon} text-xs`} />
            {b.text}
          </div>
        ))}
      </div>
    </div>
  );
}
