import { useState } from "react";

interface Props {
  onNext: (name: string, occupation: string) => void;
}

const occupations = [
  { id: "student", icon: "ri-graduation-cap-line", label: "Student", desc: "Currently studying, building skills" },
  { id: "career-switcher", icon: "ri-refresh-line", label: "Career Switcher", desc: "Pivoting into a new industry or role" },
  { id: "professional", icon: "ri-briefcase-line", label: "Professional", desc: "Employed and leveling up my skills" },
  { id: "recent-grad", icon: "ri-search-eye-line", label: "Recent Graduate", desc: "Degree in hand, hunting for my first role" },
];

export default function StepProfile({ onNext }: Props) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState("");
  const [nameError, setNameError] = useState("");

  const canProceed = name.trim().length > 0 && selected !== "";

  const handleSubmit = () => {
    if (!name.trim()) { setNameError("Tell us what to call you!"); return; }
    if (!selected) return;
    onNext(name.trim(), selected);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto lg:mx-0">
      <div className="flex items-center gap-2.5 mb-10 lg:hidden">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#7C3AED" }}>
          <i className="ri-sparkling-2-fill text-white" />
        </div>
        <span className="font-black text-xl tracking-tight" style={{ color: "var(--text-primary)" }}>GrowthFlow</span>
      </div>

      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--accent-text)" }}>Step 3 of 3</p>
        <h1 className="text-[1.85rem] font-black tracking-tight leading-tight mb-2" style={{ color: "var(--text-primary)" }}>
          Almost there!
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Just two quick things and you&apos;re in.
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
          What should we call you?
        </label>
        <div className="relative">
          <i className="ri-user-smile-line absolute left-3.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setNameError(""); }}
            placeholder="Your first name"
            autoFocus
            className="w-full pl-10 pr-4 py-3.5 rounded-xl border text-sm outline-none transition-all"
            style={{
              borderColor: nameError ? "#ef4444" : "var(--border)",
              backgroundColor: nameError ? "var(--danger-light)" : "var(--bg-elevated)",
              color: "var(--text-primary)",
            }}
            onFocus={(e) => { if (!nameError) e.currentTarget.style.borderColor = "#7C3AED"; }}
            onBlur={(e) => { if (!nameError) e.currentTarget.style.borderColor = "var(--border)"; }}
          />
        </div>
        {nameError && (
          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <i className="ri-error-warning-line" />
            {nameError}
          </p>
        )}
      </div>

      <div className="mb-7">
        <label className="block text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
          Which best describes you?
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {occupations.map((occ) => {
            const isActive = selected === occ.id;
            return (
              <button
                key={occ.id}
                type="button"
                onClick={() => setSelected(occ.id)}
                className="text-left p-4 rounded-xl border-2 transition-all duration-150 cursor-pointer"
                style={{
                  borderColor: isActive ? "#7C3AED" : "var(--border)",
                  backgroundColor: isActive ? "var(--accent-light)" : "var(--bg-elevated)",
                }}
              >
                <div
                  className="w-8 h-8 flex items-center justify-center rounded-lg mb-2.5"
                  style={{ background: isActive ? "#7C3AED" : "var(--bg-base)" }}
                >
                  <i className={`${occ.icon} text-sm`} style={{ color: isActive ? "#fff" : "var(--text-muted)" }} />
                </div>
                <p className="text-sm font-bold leading-tight mb-0.5" style={{ color: "var(--text-primary)" }}>{occ.label}</p>
                <p className="text-[11px] leading-snug" style={{ color: "var(--text-muted)" }}>{occ.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canProceed}
        className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: "#7C3AED" }}
      >
        Start my journey
        <i className="ri-arrow-right-line" />
      </button>
    </div>
  );
}
