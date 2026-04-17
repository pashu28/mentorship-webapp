import { useState, useEffect } from "react";

const featureCards = [
  {
    icon: "ri-file-text-line",
    color: "#7C3AED",
    glowColor: "rgba(124,58,237,0.55)",
    bg: "linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(88,28,220,0.15) 100%)",
    border: "rgba(124,58,237,0.35)",
    label: "AI Summary",
    desc: "Auto-generates session notes, key takeaways, and action items instantly after every meeting.",
    star: true,
    delay: 0,
    animDuration: 3.5,
  },
  {
    icon: "ri-group-line",
    color: "#3B82F6",
    glowColor: "rgba(59,130,246,0.5)",
    bg: "linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(37,99,235,0.15) 100%)",
    border: "rgba(59,130,246,0.35)",
    label: "Smart Mentor Match",
    desc: "AI pairs you with the ideal mentor by analysing your goals, background, and learning style.",
    star: true,
    delay: 0.15,
    animDuration: 3.9,
  },
  {
    icon: "ri-align-left",
    color: "#06B6D4",
    glowColor: "rgba(6,182,212,0.5)",
    bg: "linear-gradient(135deg, rgba(6,182,212,0.25) 0%, rgba(8,145,178,0.15) 100%)",
    border: "rgba(6,182,212,0.35)",
    label: "AI Scribing & Arrange",
    desc: "Transcribes sessions and organises all content into structured prerequisite learning order.",
    star: true,
    delay: 0.3,
    animDuration: 4.3,
  },
  {
    icon: "ri-book-open-line",
    color: "#10B981",
    glowColor: "rgba(16,185,129,0.5)",
    bg: "linear-gradient(135deg, rgba(16,185,129,0.25) 0%, rgba(5,150,105,0.15) 100%)",
    border: "rgba(16,185,129,0.35)",
    label: "In-app Tutor",
    desc: "Your 24 / 7 AI tutor answers questions and keeps learning momentum between mentor sessions.",
    star: true,
    delay: 0.45,
    animDuration: 4.7,
  },
];

const bottomStats = [
  { dot: "#7C3AED", label: `© ${new Date().getFullYear()} GrowthFlow. All rights reserved.` },
  { dot: "#3B82F6", label: "4.9 ★ avg rating" },
  { dot: "#06B6D4", label: "SOC 2 secure" },
];

export default function LeftPanel() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col"
      style={{
        background: "linear-gradient(160deg, #0e0b1a 0%, #12102a 50%, #0a1020 100%)",
      }}
    >
      {/* Ambient glow blobs */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          top: -120,
          left: -120,
          background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 380,
          height: 380,
          bottom: 60,
          right: -80,
          background: "radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 65%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 280,
          height: 280,
          top: "45%",
          left: "20%",
          background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 65%)",
          filter: "blur(55px)",
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-2.5 px-10 pt-10 pb-0">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #7C3AED, #10B981)",
          }}
        >
          <i className="ri-sparkling-2-fill text-white text-lg" />
        </div>
        <span
          className="font-bold tracking-tight"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "2.5rem",
            background: "linear-gradient(90deg, #7C3AED 0%, #10B981 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          GrowthFlow
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col px-10 py-8">
        {/* Headline */}
        <div className="mb-8">
          <h2
            className="text-[2.4rem] font-black leading-[1.15] tracking-tight mb-4 text-left"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#ffffff" }}
          >
            Turn mentorship into structured progress with AI.
          </h2>
          <p
            className="text-sm leading-relaxed w-full font-normal"
            style={{ color: "rgba(200,200,220,0.55)", fontFamily: "'DM Sans', sans-serif" }}
          >
            Join thousands of professionals achieving their goals faster with AI-guided
            mentorship and real-time progress tracking.
          </p>
        </div>

        {/* Platform Features label */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
          <span
            className="text-[10px] font-bold tracking-[0.18em] uppercase"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Platform Features
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
        </div>

        {/* 2x2 Feature cards grid */}
        <div className="grid grid-cols-2 gap-3" style={{ gridTemplateRows: "1fr 1fr" }}>
          {featureCards.map((card, i) => (
            <div
              key={card.label}
              className="relative rounded-2xl p-5 flex flex-col cursor-default"
              style={{
                background: card.bg,
                border: `1px solid ${card.border}`,
                backdropFilter: "blur(20px)",
                opacity: visible ? 1 : 0,
                transition: `opacity 0.5s ease ${card.delay + 0.1}s`,
                animation: visible
                  ? `floatCard${i} ${card.animDuration}s ease-in-out ${card.delay}s infinite`
                  : "none",
              }}
            >
              {/* Animated glow underneath card — synced with float */}
              <div
                className="absolute pointer-events-none rounded-2xl"
                style={{
                  inset: 0,
                  background: `radial-gradient(ellipse at 50% 110%, ${card.glowColor} 0%, transparent 70%)`,
                  animation: visible
                    ? `glowPulse${i} ${card.animDuration}s ease-in-out ${card.delay}s infinite`
                    : "none",
                  zIndex: -1,
                  filter: "blur(8px)",
                }}
              />

              {/* Star badge — top right corner */}
              {card.star && (
                <div
                  className="absolute -top-3 -right-3 w-6 h-6 rounded-full flex items-center justify-center z-10"
                  style={{
                    background: card.color,
                    boxShadow: `0 0 8px 2px ${card.glowColor}`,
                  }}
                >
                  <i className="ri-star-fill text-white" style={{ fontSize: "10px" }} />
                </div>
              )}

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: `${card.color}33`,
                  boxShadow: `0 0 10px 2px ${card.glowColor}`,
                }}
              >
                <i className={`${card.icon} text-2xl`} style={{ color: "#ffffff" }} />
              </div>

              {/* Text */}
              <p className="text-white text-sm font-bold leading-tight mb-2">{card.label}</p>
              <p className="text-white/45 text-[11.5px] leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom stats bar */}
      <div
        className="relative z-10 flex items-center gap-6 px-10 py-5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        {bottomStats.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: s.dot, boxShadow: `0 0 6px 2px ${s.dot}` }}
            />
            <span className="text-white/40 text-[11px]">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Animations */}
      <style>{`
        /* Card 0 — violet */
        @keyframes floatCard0 {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-7px); }
          100% { transform: translateY(0px); }
        }
        @keyframes glowPulse0 {
          0%   { opacity: 0.5; }
          50%  { opacity: 1; }
          100% { opacity: 0.5; }
        }

        /* Card 1 — blue */
        @keyframes floatCard1 {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-7px); }
          100% { transform: translateY(0px); }
        }
        @keyframes glowPulse1 {
          0%   { opacity: 0.4; }
          50%  { opacity: 0.9; }
          100% { opacity: 0.4; }
        }

        /* Card 2 — cyan */
        @keyframes floatCard2 {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-7px); }
          100% { transform: translateY(0px); }
        }
        @keyframes glowPulse2 {
          0%   { opacity: 0.45; }
          50%  { opacity: 0.95; }
          100% { opacity: 0.45; }
        }

        /* Card 3 — green */
        @keyframes floatCard3 {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-7px); }
          100% { transform: translateY(0px); }
        }
        @keyframes glowPulse3 {
          0%   { opacity: 0.4; }
          50%  { opacity: 0.9; }
          100% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
