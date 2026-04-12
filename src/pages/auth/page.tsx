import { useState } from "react";
import { useNavigate } from "react-router-dom";

const testimonials = [
  { text: "Landed my dream PM role at Spotify 3 months after my first session.", name: "Priya S.", role: "Product Manager" },
  { text: "My mentor helped me negotiate a 40% salary bump. Worth every minute.", name: "Marcus T.", role: "Software Engineer" },
  { text: "Switched from finance to UX design in 6 months. Couldn't have done it alone.", name: "Yuki L.", role: "UX Designer" },
];

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [activeT, setActiveT] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/intake");
  };

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL — full bleed image ── */}
      <div className="hidden lg:block lg:w-[55%] relative overflow-hidden">

        {/* Background image — AI workspace + mentorship */}
        <img
          src="https://readdy.ai/api/search-image?query=professional%20mentor%20and%20mentee%20in%20a%20modern%20tech%20office%2C%20senior%20expert%20pointing%20at%20a%20large%20screen%20showing%20data%20analytics%20dashboard%20and%20AI%20interface%20with%20glowing%20purple%20violet%20light%2C%20sleek%20contemporary%20workspace%20with%20floor%20to%20ceiling%20windows%2C%20city%20skyline%20at%20dusk%20in%20background%2C%20warm%20professional%20atmosphere%2C%20cinematic%20photography%2C%20sharp%20focus%2C%20no%20romance%2C%20career%20growth%20and%20knowledge%20sharing%20theme&width=1000&height=1100&seq=auth-split-v4&orientation=portrait"
          alt="MentorAI"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />

        {/* Gradient — light at top, heavy at bottom for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(8,4,20,0.45) 0%, rgba(8,4,20,0.1) 30%, rgba(8,4,20,0.15) 55%, rgba(8,4,20,0.92) 100%)",
          }}
        />

        {/* Top: Logo */}
        <div className="absolute top-10 left-10 z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(124,58,237,0.9)" }}>
            <i className="ri-sparkling-2-fill text-white text-base" />
          </div>
          <span className="text-white font-black text-xl tracking-tight">MentorAI</span>
        </div>

        {/* Bottom: Headline + testimonial — inspired by reference layout */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-10">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(124,58,237,0.35)", border: "1px solid rgba(167,139,250,0.45)" }}
          >
            <i className="ri-ai-generate text-violet-300 text-xs" />
            <span className="text-violet-200 text-xs font-semibold tracking-wide">AI-Powered Matching</span>
          </div>

          {/* Headline */}
          <h2 className="text-[2.6rem] font-black text-white leading-[1.1] tracking-tight mb-3">
            Accelerate your career<br />
            <span style={{ color: "#c4b5fd" }}>with the right mentor.</span>
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-[380px]">
            Get AI-matched to industry experts who've walked your exact path. Real sessions, real results.
          </p>

          {/* Testimonial card */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.13)",
              backdropFilter: "blur(20px)",
            }}
          >
            <p className="text-white/85 text-sm leading-relaxed italic mb-4">
              &ldquo;{testimonials[activeT].text}&rdquo;
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(124,58,237,0.5)" }}>
                  <i className="ri-user-line text-white text-xs" />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">{testimonials[activeT].name}</p>
                  <p className="text-white/45 text-[11px]">{testimonials[activeT].role}</p>
                </div>
              </div>
              {/* Dot nav */}
              <div className="flex items-center gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveT(i)}
                    className="cursor-pointer transition-all duration-200 rounded-full"
                    style={{
                      width: i === activeT ? "20px" : "6px",
                      height: "6px",
                      background: i === activeT ? "#7C3AED" : "rgba(255,255,255,0.3)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — clean white form ── */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 py-12 lg:px-12 bg-white dark:bg-zinc-950 min-h-screen">

        {/* Mobile logo */}
        <div className="flex items-center gap-2.5 mb-10 lg:hidden">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#7C3AED" }}>
            <i className="ri-sparkling-2-fill text-white" />
          </div>
          <span className="font-black text-xl text-gray-900 dark:text-zinc-100 tracking-tight">MentorAI</span>
        </div>

        <div className="w-full max-w-[380px] mx-auto lg:mx-0">

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-[1.75rem] font-black text-gray-900 dark:text-zinc-100 tracking-tight leading-tight mb-1.5">
              {mode === "signup" ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-gray-400 dark:text-zinc-500 text-sm">
              {mode === "signup"
                ? "Join 18,000+ learners growing with expert mentors."
                : "Sign in to continue your learning journey."}
            </p>
          </div>

          {/* Tab toggle */}
          <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-xl p-1 mb-6">
            {(["signup", "login"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer"
                style={mode === m ? { background: "#7C3AED", color: "#fff" } : { color: "#9ca3af" }}
              >
                {m === "signup" ? "Sign Up" : "Log In"}
              </button>
            ))}
          </div>

          {/* Social buttons */}
          <div className="flex gap-3 mb-5">
            {[
              { icon: "ri-google-fill", label: "Google", color: "#EA4335" },
              { icon: "ri-linkedin-fill", label: "LinkedIn", color: "#0A66C2" },
            ].map((s) => (
              <button
                key={s.label}
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-medium text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:border-gray-300 dark:hover:border-zinc-600 transition-all cursor-pointer"
              >
                <i className={`${s.icon} text-base`} style={{ color: s.color }} />
                {s.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-700" />
            <span className="text-xs text-gray-400 dark:text-zinc-500">or continue with email</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-700" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <i className="ri-user-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Johnson"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-300 dark:placeholder-zinc-600 outline-none transition-all"
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#7C3AED"; e.currentTarget.style.background = "#faf5ff"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#f9fafb"; }}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <i className="ri-mail-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-300 dark:placeholder-zinc-600 outline-none transition-all"
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#7C3AED"; e.currentTarget.style.background = "#faf5ff"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#f9fafb"; }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</label>
                {mode === "login" && (
                  <button type="button" className="text-xs font-semibold cursor-pointer hover:opacity-75 transition-opacity" style={{ color: "#7C3AED" }}>
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <i className="ri-lock-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-300 dark:placeholder-zinc-600 outline-none transition-all"
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#7C3AED"; e.currentTarget.style.background = "#faf5ff"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#f9fafb"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                >
                  <i className={showPass ? "ri-eye-off-line text-sm" : "ri-eye-line text-sm"} />
                </button>
              </div>
            </div>

            {/* CTA */}
            <button
              type="submit"
              className="w-full mt-1 py-3.5 rounded-xl text-white font-bold text-sm transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98]"
              style={{ background: "#7C3AED" }}
            >
              {mode === "signup" ? "Get Started — It's Free" : "Sign In to MentorAI"}
              <i className="ri-arrow-right-line" />
            </button>
          </form>

          {/* Switch mode */}
          <p className="text-center text-sm text-gray-400 dark:text-zinc-500 mt-5">
            {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
              className="font-semibold cursor-pointer hover:opacity-80 transition-opacity"
              style={{ color: "#7C3AED" }}
            >
              {mode === "signup" ? "Log in" : "Sign up free"}
            </button>
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-5 mt-7 pt-6 border-t border-gray-100 dark:border-zinc-800">
            {[
              { icon: "ri-shield-check-line", text: "Secure & Private" },
              { icon: "ri-star-fill", text: "4.9 / 5 Rating" },
              { icon: "ri-group-line", text: "18K+ Members" },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-1.5 text-gray-400 dark:text-zinc-500 text-[11px]">
                <i className={`${b.icon} text-xs`} />
                {b.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
