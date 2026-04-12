import { useState, useEffect } from "react";

const testimonials = [
  { text: "Landed my dream PM role at Spotify 3 months after my first session.", name: "Priya S.", role: "Product Manager" },
  { text: "My mentor helped me negotiate a 40% salary bump. Worth every minute.", name: "Marcus T.", role: "Software Engineer" },
  { text: "Switched from finance to UX design in 6 months. Couldn't have done it alone.", name: "Yuki L.", role: "UX Designer" },
];

export default function LeftPanel() {
  const [activeT, setActiveT] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveT((p) => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden lg:block lg:w-[55%] relative overflow-hidden">
      <img
        src="https://readdy.ai/api/search-image?query=abstract%20artistic%20visualization%20of%20human%20connection%20and%20knowledge%20transfer%2C%20glowing%20neural%20network%20nodes%20forming%20two%20silhouettes%20facing%20each%20other%2C%20deep%20indigo%20and%20violet%20gradient%20background%20with%20soft%20golden%20light%20particles%20flowing%20between%20figures%2C%20minimalist%20futuristic%20digital%20art%20style%2C%20no%20text%2C%20no%20faces%2C%20elegant%20and%20inspiring%2C%20high%20contrast%20dark%20background%20with%20luminous%20violet%20and%20warm%20amber%20accents&width=1000&height=1100&seq=auth-left-v9&orientation=portrait"
        alt="MentorAI"
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(8,4,20,0.55) 0%, rgba(8,4,20,0.15) 35%, rgba(8,4,20,0.2) 55%, rgba(8,4,20,0.94) 100%)",
        }}
      />

      {/* Logo */}
      <div className="absolute top-10 left-10 z-10 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(124,58,237,0.9)" }}>
          <i className="ri-sparkling-2-fill text-white text-base" />
        </div>
        <span className="text-white font-black text-xl tracking-tight">MentorAI</span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-10">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
          style={{ background: "rgba(124,58,237,0.35)", border: "1px solid rgba(167,139,250,0.45)" }}
        >
          <i className="ri-ai-generate text-violet-300 text-xs" />
          <span className="text-violet-200 text-xs font-semibold tracking-wide">AI-Powered Matching</span>
        </div>

        <h2 className="text-[2.6rem] font-black text-white leading-[1.1] tracking-tight mb-3">
          The right mentor<br />
          <span style={{ color: "#c4b5fd" }}>changes everything.</span>
        </h2>
        <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-[380px]">
          One conversation with the right person can save you years of trial and error. We find that person for you.
        </p>

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
  );
}
