import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface LobbyState {
  mentorName: string;
  mentorRole: string;
  mentorCompany: string;
  mentorPhoto: string;
  date: string;
  time: string;
}

const defaultState: LobbyState = {
  mentorName: "Sarah Chen",
  mentorRole: "Senior UX Designer",
  mentorCompany: "Figma",
  mentorPhoto:
    "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20asian%20woman%20smiling%20warmly%2C%20soft%20studio%20lighting%2C%20clean%20white%20background%2C%20business%20casual%20attire%2C%20confident%20expression%2C%20high%20quality%20portrait%20photography&width=400&height=400&seq=mentor1&orientation=squarish",
  date: "April 14, 2026",
  time: "10:00 AM",
};

export default function MeetingLobbyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const session: LobbyState = (location.state as LobbyState) || defaultState;

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [joining, setJoining] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [timeUntil, setTimeUntil] = useState("in 2 days, 4 hrs");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Try to get real camera feed
  useEffect(() => {
    if (camOn) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          // Camera not available — that's fine, we show placeholder
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [camOn]);

  const handleJoin = () => {
    setJoining(true);
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      navigate("/video-room");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => (c !== null ? c - 1 : null)), 1000);
    return () => clearTimeout(t);
  }, [countdown, navigate]);

  const agenda = [
    "Intro & goal alignment (5 min)",
    "Review your portfolio & current projects (20 min)",
    "Identify skill gaps for UX transition (15 min)",
    "Build a 30-day action plan together (15 min)",
    "Q&A and next steps (5 min)",
  ];

  const checklist = [
    { label: "Resume shared with mentor", done: true },
    { label: "Goal summary sent", done: true },
    { label: "AI Scribe enabled", done: true },
    { label: "Quiet environment", done: false },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <img
            src="https://public.readdy.ai/ai/img_res/c1296ba1-3a0e-4b18-b1f8-e3ff105a92d8.png"
            alt="MentorAI"
            className="w-8 h-8 object-contain"
          />
          <span className="font-bold text-gray-900 text-lg">MentorAI</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Session starting soon
        </div>
      </nav>

      <main className="flex-1 px-6 py-10 max-w-6xl mx-auto w-full">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your session is ready</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Check your setup below, then join when you're ready.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT — Camera preview + controls */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            {/* Camera preview */}
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video w-full">
              {camOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-700">
                    <i className="ri-user-line text-gray-400 text-3xl" />
                  </div>
                  <p className="text-gray-400 text-sm">Camera is off</p>
                </div>
              )}

              {/* Name tag overlay */}
              <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm">
                <p className="text-white text-xs font-medium">You (Mentee)</p>
              </div>

              {/* Mic indicator */}
              <div className="absolute top-4 right-4">
                {micOn ? (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-500/90 backdrop-blur-sm">
                    <i className="ri-mic-line text-white text-sm" />
                  </div>
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/90 backdrop-blur-sm">
                    <i className="ri-mic-off-line text-white text-sm" />
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-sm font-semibold text-gray-700 mb-4">Pre-join settings</p>
              <div className="flex items-center gap-4">
                {/* Mic toggle */}
                <button
                  type="button"
                  onClick={() => setMicOn((v) => !v)}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer whitespace-nowrap ${
                    micOn
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-600 border border-red-200"
                  }`}
                >
                  <i className={micOn ? "ri-mic-line" : "ri-mic-off-line"} />
                  {micOn ? "Mic On" : "Mic Off"}
                </button>

                {/* Camera toggle */}
                <button
                  type="button"
                  onClick={() => setCamOn((v) => !v)}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer whitespace-nowrap ${
                    camOn
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-600 border border-red-200"
                  }`}
                >
                  <i className={camOn ? "ri-video-line" : "ri-video-off-line"} />
                  {camOn ? "Camera On" : "Camera Off"}
                </button>

                {/* Speaker test */}
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl font-medium text-sm bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-volume-up-line" />
                  Test Audio
                </button>
              </div>
            </div>

            {/* Pre-session checklist */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-sm font-semibold text-gray-700 mb-4">Pre-session checklist</p>
              <div className="grid grid-cols-2 gap-3">
                {checklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div
                      className={`w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 ${
                        item.done ? "bg-emerald-500" : "border-2 border-gray-300"
                      }`}
                    >
                      {item.done && <i className="ri-check-line text-white text-xs" />}
                    </div>
                    <span className={`text-sm ${item.done ? "text-gray-700" : "text-gray-400"}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Session details */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Mentor card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Your Mentor
              </p>
              <div className="flex items-center gap-4 mb-5">
                <img
                  src={session.mentorPhoto}
                  alt={session.mentorName}
                  className="w-14 h-14 rounded-full object-cover object-top border-2 border-violet-100"
                />
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{session.mentorName}</h3>
                  <p className="text-sm text-gray-500">{session.mentorRole}</p>
                  <p className="text-sm font-medium text-violet-600">{session.mentorCompany}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <i key={s} className="ri-star-fill text-amber-400 text-sm" />
                ))}
                <span className="text-xs text-gray-500 ml-1">5.0 · 47 sessions</span>
              </div>
            </div>

            {/* Session info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Session Details
              </p>
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-violet-50">
                    <i className="ri-calendar-line text-violet-600 text-sm" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-sm font-semibold text-gray-800">{session.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-violet-50">
                    <i className="ri-time-line text-violet-600 text-sm" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Time</p>
                    <p className="text-sm font-semibold text-gray-800">{session.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-violet-50">
                    <i className="ri-timer-line text-violet-600 text-sm" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="text-sm font-semibold text-gray-800">60 minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-violet-50">
                    <i className="ri-video-line text-violet-600 text-sm" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Format</p>
                    <p className="text-sm font-semibold text-gray-800">Video Call (In-App)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Agenda */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Session Agenda
              </p>
              <ol className="space-y-2.5">
                {agenda.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Join button */}
            <button
              type="button"
              onClick={handleJoin}
              disabled={joining}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white font-bold text-base hover:from-violet-700 hover:to-violet-600 transition-all duration-200 hover:scale-[1.02] disabled:opacity-80 cursor-pointer whitespace-nowrap relative overflow-hidden"
            >
              {joining && countdown !== null && countdown > 0 ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white font-black text-lg">
                    {countdown}
                  </span>
                  Joining session...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <i className="ri-video-line text-lg" />
                  Join Session Now
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/session-dashboard")}
              className="w-full py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap"
            >
              Back to My Sessions
            </button>
          </div>
        </div>
      </main>

      {/* Countdown overlay */}
      {joining && countdown !== null && countdown > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="text-center">
            <div
              className="w-28 h-28 flex items-center justify-center rounded-full border-4 border-violet-400 mb-6 mx-auto"
              style={{
                animation: "ping-once 0.8s ease-out",
                background: "rgba(139,92,246,0.15)",
              }}
            >
              <span className="text-6xl font-black text-white">{countdown}</span>
            </div>
            <p className="text-white text-xl font-semibold">Joining your session...</p>
            <p className="text-violet-300 text-sm mt-2">
              Connecting with {session.mentorName}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
