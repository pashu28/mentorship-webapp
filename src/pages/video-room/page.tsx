import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { transcript, resourceVault } from "@/mocks/session";

// Dedicated full-screen video-call images — candid, realistic, landscape
const VIDEO_CALL_PHOTOS: Record<string, string> = {
  "Marcus Williams":
    "https://readdy.ai/api/search-image?query=close%20up%20front%20facing%20video%20call%20portrait%20of%20a%20white%20man%20engineer%20late%2030s%2C%20short%20brown%20hair%20light%20stubble%2C%20looking%20directly%20into%20camera%20with%20a%20relaxed%20confident%20smile%2C%20wearing%20a%20dark%20charcoal%20henley%2C%20face%20and%20upper%20chest%20filling%20the%20frame%2C%20soft%20warm%20natural%20window%20light%20from%20the%20side%2C%20blurred%20bokeh%20bookshelf%20background%20behind%20him%2C%20photorealistic%20zoom%20call%20screenshot%20style%2C%20shallow%20depth%20of%20field%2C%20cinematic%20portrait&width=1200&height=800&seq=marcus-white-vc-v1&orientation=landscape",
  "Sarah Chen":
    "https://readdy.ai/api/search-image?query=candid%20video%20call%20of%20an%20asian%20woman%20UX%20designer%20early%2030s%20in%20a%20bright%20creative%20home%20office%2C%20large%20window%20with%20soft%20daylight%20behind%20her%2C%20pastel%20wall%20with%20framed%20design%20prints%2C%20white%20linen%20blouse%2C%20warm%20genuine%20smile%20mid-conversation%2C%20upper%20body%20framing%2C%20shallow%20depth%20of%20field%2C%20photorealistic%20portrait%20lifestyle%20photo&width=1200&height=800&seq=sarah-vc-v2&orientation=landscape",
  "Priya Sharma":
    "https://readdy.ai/api/search-image?query=candid%20video%20call%20of%20an%20indian%20woman%20product%20manager%20mid%2030s%2C%20modern%20open-plan%20home%20workspace%2C%20whiteboard%20with%20sticky%20notes%20softly%20visible%20behind%2C%20wearing%20a%20sage%20green%20blazer%2C%20animated%20expression%20as%20if%20explaining%20something%2C%20natural%20daylight%20from%20window%2C%20realistic%20candid%20photo%20feel&width=1200&height=800&seq=priya-vc-v2&orientation=landscape",
  "James Okafor":
    "https://readdy.ai/api/search-image?query=candid%20video%20call%20of%20a%20tall%20african%20man%20engineering%20manager%20early%2040s%2C%20home%20office%20with%20neat%20shelving%20unit%20and%20a%20plant%2C%20warm%20evening%20lamp%20light%2C%20wearing%20a%20white%20oxford%20shirt%20open%20collar%2C%20calm%20confident%20gaze%20into%20camera%2C%20upper%20body%20visible%2C%20cinematic%20realism&width=1200&height=800&seq=james-vc-v2&orientation=landscape",
  "Yuki Tanaka":
    "https://readdy.ai/api/search-image?query=candid%20video%20call%20of%20a%20japanese%20woman%20data%20scientist%20late%2020s%2C%20minimal%20desk%20setup%20with%20a%20glowing%20monitor%20showing%20charts%2C%20cool%20blue%20evening%20window%20light%2C%20wearing%20a%20loose%20grey%20sweater%2C%20thoughtful%20slight%20smile%2C%20upper%20body%20shot%2C%20photorealistic%20lifestyle&width=1200&height=800&seq=yuki-vc-v2&orientation=landscape",
  "Carlos Rivera":
    "https://readdy.ai/api/search-image?query=candid%20video%20call%20of%20a%20hispanic%20man%20growth%20marketer%20early%2030s%2C%20energetic%20colorful%20home%20workspace%20with%20a%20cork%20board%20behind%20him%2C%20bright%20morning%20window%20light%2C%20casual%20shirt%2C%20big%20grin%20mid-sentence%2C%20upper%20body%20and%20hands%20visible%2C%20realistic%20candid%20photo&width=1200&height=800&seq=carlos-vc-v2&orientation=landscape",
  "Amara Osei":
    "https://readdy.ai/api/search-image?query=candid%20video%20call%20of%20an%20african%20woman%20UX%20researcher%2030s%2C%20cozy%20warm%20home%20office%20with%20a%20large%20trailing%20plant%20and%20earth-tone%20decor%2C%20soft%20warm%20lighting%2C%20wearing%20a%20terracotta%20blouse%2C%20warm%20friendly%20smile%20looking%20at%20camera%2C%20upper%20body%20composition%2C%20photorealistic&width=1200&height=800&seq=amara-vc-v2&orientation=landscape",
  "Daniel Park":
    "https://readdy.ai/api/search-image?query=candid%20video%20call%20of%20a%20korean%20man%20iOS%20engineer%20early%2030s%2C%20ultra-clean%20minimal%20desk%20with%20an%20iMac%20and%20small%20succulent%2C%20cool%20natural%20window%20light%2C%20white%20crewneck%2C%20focused%20relaxed%20expression%20looking%20at%20screen%2C%20cinematic%20shallow%20dof%2C%20realistic%20photo&width=1200&height=800&seq=daniel-vc-v2&orientation=landscape",
  "Fatima Al-Hassan":
    "https://readdy.ai/api/search-image?query=candid%20video%20call%20of%20a%20middle%20eastern%20woman%20startup%20founder%20early%2030s%2C%20stylish%20modern%20home%20office%20with%20a%20visible%20whiteboard%20covered%20in%20notes%20and%20a%20mood%20lamp%2C%20wearing%20a%20charcoal%20structured%20blazer%2C%20confident%20and%20animated%20expression%2C%20upper%20body%20shot%2C%20photorealistic%20lifestyle%20photo&width=1200&height=800&seq=fatima-vc-v2&orientation=landscape",
};

function resolveMentorVideoPhoto(mentorName: string): string {
  if (VIDEO_CALL_PHOTOS[mentorName]) return VIDEO_CALL_PHOTOS[mentorName];
  // Generic fallback — gender-neutral candid
  return "https://readdy.ai/api/search-image?query=candid%20video%20call%20of%20a%20professional%20mentor%20in%20a%20warm%20cozy%20home%20office%20with%20bookshelves%20and%20ambient%20lighting%2C%20upper%20body%20visible%2C%20engaged%20smile%2C%20realistic%20lifestyle%20photo&width=1200&height=800&seq=mentor-vc-generic&orientation=landscape";
}

interface MentorState {
  mentorName: string;
  mentorRole: string;
  mentorCompany: string;
  mentorPhoto: string;
}

function getBookedMentor(): MentorState {
  try {
    const raw = localStorage.getItem("mentorAI_bookedMentor");
    if (raw) {
      const m = JSON.parse(raw) as {
        name?: string; mentorName?: string;
        role?: string; mentorRole?: string;
        company?: string; mentorCompany?: string;
        photo?: string; mentorPhoto?: string;
      };
      const resolvedName = m.name ?? m.mentorName ?? "";
      if (resolvedName) {
        return {
          mentorName: resolvedName,
          mentorRole: m.role ?? m.mentorRole ?? "Mentor",
          mentorCompany: m.company ?? m.mentorCompany ?? "",
          mentorPhoto: m.photo ?? m.mentorPhoto ?? "",
        };
      }
    }
  } catch (_) { /* ignore */ }
  return { mentorName: "Your Mentor", mentorRole: "Mentor", mentorCompany: "", mentorPhoto: "" };
}

type ChatMessage = {
  id: number;
  sender: "you" | "mentor";
  text: string;
  time: string;
  savedResource?: { title: string; url: string };
};

type SideTab = "scribe" | "resources" | "chat";
type ShareItem = { icon: string; label: string; placeholder: string; type: "link" | "doc" };

const INITIAL_CHAT: ChatMessage[] = [
  { id: 1, sender: "mentor", text: "Hey! Ready to dive in? I've reviewed your portfolio — really solid work on the onboarding redesign.", time: "0:12" },
  { id: 2, sender: "you", text: "Thanks! I have a few questions about case study structure too.", time: "0:28" },
];

function extractUrl(text: string): string | null {
  const match = text.match(/https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.(com|org|io|net|co)[^\s]*/);
  return match ? match[0] : null;
}

export default function VideoRoomPage() {
  const location = useLocation();
  const mentor: MentorState = (location.state as MentorState) || getBookedMentor();
  const mentorFirstName = mentor.mentorName.split(" ")[0];
  const mentorVideoPhoto = resolveMentorVideoPhoto(mentor.mentorName);

  // Self camera
  const selfVideoRef = useRef<HTMLVideoElement>(null);
  const selfStreamRef = useRef<MediaStream | null>(null);

  // User identity for the PiP fallback
  const userName = localStorage.getItem("mentorAI_userName") || "You";
  const userInitials = userName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [activeTab, setActiveTab] = useState<SideTab>("scribe");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [chatInput, setChatInput] = useState("");
  const [chatUnread, setChatUnread] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [visibleTranscript, setVisibleTranscript] = useState<typeof transcript>([]);
  const [savedResources, setSavedResources] = useState<typeof resourceVault>([]);
  const [newResourceId, setNewResourceId] = useState<number | null>(null);
  const [resourceToast, setResourceToast] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [shareModalType, setShareModalType] = useState<ShareItem | null>(null);
  const [shareInput, setShareInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const transcriptRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const SHARE_OPTIONS: ShareItem[] = [
    { icon: "ri-link-m", label: "Share a Link", placeholder: "Paste URL here (e.g. https://...)", type: "link" },
    { icon: "ri-file-text-line", label: "Share a Doc", placeholder: "Paste Google Doc / Notion / Figma link...", type: "doc" },
    { icon: "ri-image-line", label: "Share an Image URL", placeholder: "Paste image URL...", type: "link" },
  ];

  const TABS: { id: SideTab; label: string; icon: string }[] = [
    { id: "scribe", label: "AI Scribe", icon: "ri-quill-pen-line" },
    { id: "resources", label: "Resources", icon: "ri-archive-line" },
    { id: "chat", label: "Chat", icon: "ri-chat-3-line" },
  ];

  // Close share menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target as Node)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setSessionTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-stream transcript
  useEffect(() => {
    let i = 0;
    let cancelled = false;
    const addMessage = () => {
      if (cancelled || i >= transcript.length) return;
      const msg = transcript[i];
      setVisibleTranscript((prev) => [...prev, msg]);
      const resourceIndex = [2, 3, 5, 6].indexOf(i);
      if (resourceIndex !== -1 && resourceIndex < resourceVault.length) {
        setTimeout(() => {
          if (cancelled) return;
          const res = resourceVault[resourceIndex];
          setSavedResources((prev) => {
            if (prev.find((r) => r.id === res.id)) return prev;
            setNewResourceId(res.id);
            setResourceToast(res.title);
            setTimeout(() => { setNewResourceId(null); setResourceToast(null); }, 3000);
            return [...prev, res];
          });
        }, 800);
      }
      i++;
      setTimeout(addMessage, 3000);
    };
    const delay = setTimeout(addMessage, 1500);
    return () => { cancelled = true; clearTimeout(delay); };
  }, []);

  // Scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [visibleTranscript]);

  // Scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Start camera on mount, stop it on unmount
  useEffect(() => {
    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        selfStreamRef.current = stream;
        if (selfVideoRef.current) {
          selfVideoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        // No camera or permission denied — PiP stays on initials fallback
      });
    return () => {
      cancelled = true;
      if (selfStreamRef.current) {
        selfStreamRef.current.getTracks().forEach((t) => t.stop());
        selfStreamRef.current = null;
      }
    };
  }, []); // runs once on mount

  // When user toggles video off, pause the stream visually but keep it alive for quick re-enable
  // (stream stays active so toggling back on is instant — no re-permission needed)
  useEffect(() => {
    if (selfStreamRef.current) {
      selfStreamRef.current.getVideoTracks().forEach((t) => {
        t.enabled = !isVideoOff;
      });
    }
  }, [isVideoOff]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const sendChat = useCallback(() => {
    const text = chatInput.trim();
    if (!text) return;
    const now = formatTime(sessionTime);
    const url = extractUrl(text);
    const newMsg: ChatMessage = { id: Date.now(), sender: "you", text, time: now };
    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput("");

    if (url) {
      const res = {
        id: Date.now(),
        title: "Link shared in chat",
        url,
        icon: "ri-link-m",
        color: "bg-violet-50 text-violet-600",
      };
      setSavedResources((prev) => [...prev, res]);
      setResourceToast("Link saved to Resource Vault");
      setTimeout(() => setResourceToast(null), 3000);
    }

    if (text.toLowerCase().includes("figma") || text.toLowerCase().includes("resource")) {
      setTimeout(() => {
        const reply: ChatMessage = {
          id: Date.now() + 1,
          sender: "mentor",
          text: "Sure! Check this out: figma.com/community — tons of free templates there.",
          time: formatTime(sessionTime + 5),
          savedResource: { title: "Figma Community Templates", url: "figma.com/community" },
        };
        setChatMessages((prev) => [...prev, reply]);
        if (activeTab !== "chat") setChatUnread((n) => n + 1);
        const res = {
          id: Date.now() + 2,
          title: "Figma Community Templates",
          url: "figma.com/community",
          icon: "ri-layout-line",
          color: "bg-violet-50 text-violet-600",
        };
        setSavedResources((prev) => {
          if (prev.find((r) => r.url === res.url)) return prev;
          setResourceToast("Mentor link saved to Resource Vault");
          setTimeout(() => setResourceToast(null), 3000);
          return [...prev, res];
        });
      }, 2500);
    }
  }, [chatInput, sessionTime, activeTab]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChat();
    }
  };

  const switchTab = (tab: SideTab) => {
    setActiveTab(tab);
    if (tab === "chat") setChatUnread(0);
  };

  const handleShareSubmit = () => {
    if (!shareInput.trim() || !shareModalType) return;
    const url = shareInput.trim();
    const title = shareModalType.type === "doc" ? "Shared document" : "Shared link";
    const newMsg: ChatMessage = { id: Date.now(), sender: "you", text: url, time: formatTime(sessionTime) };
    setChatMessages((prev) => [...prev, newMsg]);
    const res = {
      id: Date.now() + 1,
      title,
      url,
      icon: shareModalType.icon,
      color: shareModalType.type === "doc" ? "bg-emerald-50 text-emerald-600" : "bg-violet-50 text-violet-600",
    };
    setSavedResources((prev) => [...prev, res]);
    setResourceToast(`${title} saved to Resource Vault`);
    setTimeout(() => setResourceToast(null), 3000);
    setShareInput("");
    setShareModalType(null);
  };

  return (
    <div className="h-screen bg-gray-950 flex flex-col overflow-hidden relative">

      {/* Resource saved toast */}
      {resourceToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-500 text-white text-sm font-medium shadow-lg">
          <i className="ri-archive-line" />
          {resourceToast}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">

        {/* ── Video Stage ── */}
        <div className="flex-1 relative overflow-hidden">
          {/* Mentor video */}
          <div className="absolute inset-0">
            <img
              src={mentorVideoPhoto}
              alt={`${mentor.mentorName} video`}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-gray-950/20" />
          </div>

          {/* ── Top bar ── */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
            {/* Timer + live dot */}
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
              <div className="relative w-2 h-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-60" />
              </div>
              <span className="text-white text-xs font-medium">{formatTime(sessionTime)}</span>
            </div>

            {/* Mentor name */}
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5">
              <span className="text-white text-xs font-medium">{mentor.mentorName}{mentor.mentorRole ? ` · ${mentor.mentorRole}` : ""}</span>
            </div>

            {/* AI Scribe pill — click to slide panel in/out */}
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              title={sidebarOpen ? "Hide panel" : "Show panel"}
              className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 cursor-pointer hover:bg-black/70 transition-colors"
            >
              <div className="relative w-1.5 h-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
              </div>
              <span className="text-emerald-300 text-xs font-medium">AI Scribe active</span>
              <i
                className={`ri-layout-right-2-line text-xs text-emerald-400/80 ml-0.5 transition-transform duration-300 ${
                  sidebarOpen ? "rotate-0" : "rotate-180"
                }`}
              />
            </button>
          </div>

          {/* Self video PiP */}
          <div className="absolute bottom-24 right-4 w-36 h-24 rounded-xl overflow-hidden border-2 border-white/20 z-10">
            {/* Live camera feed */}
            <video
              ref={selfVideoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover scale-x-[-1] ${isVideoOff ? "hidden" : "block"}`}
            />
            {/* Camera off — show initials */}
            {isVideoOff && (
              <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center gap-1">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-violet-700 text-white font-bold text-sm">
                  {userInitials}
                </div>
                <span className="text-gray-400 text-xs">Camera off</span>
              </div>
            )}
            <div className="absolute bottom-1.5 left-2">
              <span className="text-white text-xs font-medium bg-black/40 px-1.5 py-0.5 rounded">You</span>
            </div>
          </div>

          {/* ── Bottom controls ── */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-4 py-5 bg-gradient-to-t from-gray-950 to-transparent z-10">
            {[
              { icon: isMuted ? "ri-mic-off-line" : "ri-mic-line", label: "Mute", action: () => setIsMuted(!isMuted), active: isMuted },
              { icon: isVideoOff ? "ri-video-off-line" : "ri-video-line", label: "Video", action: () => setIsVideoOff(!isVideoOff), active: isVideoOff },
              { icon: "ri-computer-line", label: "Share", action: () => {}, active: false },
              { icon: "ri-settings-3-line", label: "Settings", action: () => {}, active: false },
            ].map((ctrl) => (
              <button
                key={ctrl.label}
                type="button"
                onClick={ctrl.action}
                title={ctrl.label}
                className={`w-12 h-12 flex items-center justify-center rounded-full transition-all cursor-pointer ${
                  ctrl.active ? "bg-red-500/80 text-white" : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <i className={`${ctrl.icon} text-xl`} />
              </button>
            ))}
            <button
              type="button"
              onClick={() => navigate("/session-summary")}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition-all cursor-pointer"
              title="End Call"
            >
              <i className="ri-phone-fill text-xl rotate-[135deg]" />
            </button>
          </div>
        </div>

        {/* ── Right Sidebar wrapper — slides in/out ── */}
        <div
          className="relative shrink-0 flex"
          style={{
            width: sidebarOpen ? "320px" : "0px",
            transition: "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            overflow: "hidden",
          }}
        >
          {/* Inner panel — fixed width so content doesn't squish during animation */}
          <div className="w-80 h-full bg-gray-900 border-l border-gray-800 flex flex-col overflow-hidden shrink-0">

            {/* Tab bar */}
            <div className="flex border-b border-gray-800 shrink-0">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => switchTab(tab.id)}
                  className={`relative flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? "text-white border-b-2 border-violet-500"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <i className={`${tab.icon} text-base`} />
                  <span>{tab.label}</span>
                  {tab.id === "chat" && chatUnread > 0 && (
                    <span className="absolute top-2 right-4 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                      {chatUnread}
                    </span>
                  )}
                  {tab.id === "resources" && savedResources.length > 0 && (
                    <span className="absolute top-2 right-4 w-4 h-4 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">
                      {savedResources.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ── AI Scribe Tab ── */}
            {activeTab === "scribe" && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-800 shrink-0 flex items-center gap-2">
                  <div className="relative w-2 h-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-50" />
                  </div>
                  <span className="text-white text-xs font-semibold">Live Transcript</span>
                  <span className="ml-auto text-gray-500 text-xs">{visibleTranscript.length} lines</span>
                </div>
                <div ref={transcriptRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                  {visibleTranscript.length === 0 && (
                    <div className="text-center text-gray-600 text-xs mt-10">
                      <i className="ri-quill-pen-line text-3xl mb-2 block text-gray-700" />
                      Transcript will appear here as the session progresses...
                    </div>
                  )}
                  {visibleTranscript.map((msg) => (
                    <div key={msg.id} className={`flex flex-col gap-1 ${msg.role === "mentee" ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-medium ${msg.role === "mentor" ? "text-violet-400" : "text-emerald-400"}`}>
                          {msg.speaker}
                        </span>
                        <span className="text-gray-600 text-xs">{msg.time}</span>
                      </div>
                      <div className={`max-w-[90%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                        msg.role === "mentor"
                          ? "bg-gray-800 text-gray-200 rounded-tl-sm"
                          : "bg-violet-900/50 text-gray-200 rounded-tr-sm"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-gray-800 shrink-0">
                  <p className="text-gray-600 text-xs flex items-center gap-1.5">
                    <i className="ri-information-line" />
                    Full transcript saved automatically after session ends
                  </p>
                </div>
              </div>
            )}

            {/* ── Resources Tab ── */}
            {activeTab === "resources" && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-800 shrink-0 flex items-center gap-2">
                  <i className="ri-archive-line text-amber-400 text-sm" />
                  <span className="text-white text-xs font-semibold">Resource Vault</span>
                  <span className="ml-auto text-gray-500 text-xs">{savedResources.length} saved</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                  {savedResources.length === 0 && (
                    <div className="text-center text-gray-600 text-xs mt-10">
                      <i className="ri-archive-line text-3xl mb-2 block text-gray-700" />
                      Links and resources mentioned during the session will be saved here automatically.
                    </div>
                  )}
                  {savedResources.map((r) => (
                    <div
                      key={r.id}
                      className={`flex items-center gap-3 p-3 rounded-xl bg-gray-800 transition-all duration-500 ${
                        newResourceId === r.id ? "ring-1 ring-amber-500" : ""
                      }`}
                    >
                      <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${r.color} shrink-0`}>
                        <i className={`${r.icon} text-sm`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-xs font-medium truncate">{r.title}</p>
                        <p className="text-gray-500 text-xs truncate">{r.url}</p>
                      </div>
                      {newResourceId === r.id && (
                        <span className="text-amber-400 text-xs shrink-0 font-medium">New!</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-gray-800 shrink-0">
                  <p className="text-gray-600 text-xs flex items-center gap-1.5">
                    <i className="ri-information-line" />
                    Links shared in chat are also auto-saved here
                  </p>
                </div>
              </div>
            )}

            {/* ── Chat Tab ── */}
            {activeTab === "chat" && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div ref={chatRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col gap-1 ${msg.sender === "you" ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-medium ${msg.sender === "mentor" ? "text-violet-400" : "text-emerald-400"}`}>
                          {msg.sender === "mentor" ? mentorFirstName : "You"}
                        </span>
                        <span className="text-gray-600 text-xs">{msg.time}</span>
                      </div>
                      <div className={`max-w-[90%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                        msg.sender === "mentor"
                          ? "bg-gray-800 text-gray-200 rounded-tl-sm"
                          : "bg-violet-700/60 text-gray-100 rounded-tr-sm"
                      }`}>
                        {msg.text}
                      </div>
                      {msg.savedResource && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 max-w-[90%]">
                          <i className="ri-archive-line text-amber-400 text-xs" />
                          <span className="text-amber-300 text-xs">Saved: {msg.savedResource.title}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Chat input */}
                <div className="border-t border-gray-800 p-3 shrink-0">
                  <p className="text-gray-600 text-xs mb-2 flex items-center gap-1">
                    <i className="ri-information-line" />
                    Links shared here are auto-saved to Resources
                  </p>
                  <div className="flex items-end gap-2">
                    {/* Plus / Share button */}
                    <div className="relative shrink-0" ref={shareMenuRef}>
                      <button
                        type="button"
                        onClick={() => setShowShareMenu((v) => !v)}
                        title="Share a doc or link"
                        className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer border ${
                          showShareMenu
                            ? "bg-violet-600 border-violet-500 text-white"
                            : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
                        }`}
                      >
                        <i className={`text-base transition-transform duration-200 ${showShareMenu ? "ri-close-line" : "ri-add-line"}`} />
                      </button>

                      {/* Share popup menu */}
                      {showShareMenu && (
                        <div className="absolute bottom-11 left-0 w-52 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-30">
                          <p className="text-gray-500 text-xs px-3 pt-2.5 pb-1.5 font-medium uppercase tracking-wide">Share with mentor</p>
                          {SHARE_OPTIONS.map((opt) => (
                            <button
                              key={opt.label}
                              type="button"
                              onClick={() => { setShareModalType(opt); setShowShareMenu(false); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
                            >
                              <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-gray-700">
                                <i className={`${opt.icon} text-violet-400 text-sm`} />
                              </div>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message or paste a link..."
                      rows={2}
                      className="flex-1 bg-gray-800 text-white text-xs rounded-xl px-3 py-2.5 resize-none outline-none border border-gray-700 focus:border-violet-500 transition-colors placeholder-gray-600"
                    />
                    <button
                      type="button"
                      onClick={sendChat}
                      disabled={!chatInput.trim()}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 transition-all cursor-pointer shrink-0"
                    >
                      <i className="ri-send-plane-fill text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Collapse / expand tab — sits on the left edge of the sidebar area */}
        <button
          type="button"
          onClick={() => setSidebarOpen((v) => !v)}
          title={sidebarOpen ? "Collapse panel" : "Expand panel"}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors"
          style={{
            right: sidebarOpen ? "320px" : "0px",
            transition: "right 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            width: "20px",
            height: "48px",
            background: "#1f2937",
            borderRadius: "8px 0 0 8px",
            border: "1px solid #374151",
            borderRight: "none",
          }}
        >
          <i
            className={`ri-arrow-right-s-line text-gray-400 text-sm transition-transform duration-300 ${
              sidebarOpen ? "rotate-0" : "rotate-180"
            }`}
          />
        </button>

      </div>

      {/* Share doc/link modal */}
      {shareModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-[420px] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-violet-600/20">
                <i className={`${shareModalType.icon} text-violet-400 text-base`} />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{shareModalType.label}</p>
                <p className="text-gray-500 text-xs">Shared with mentor &amp; auto-saved to Resource Vault</p>
              </div>
              <button
                type="button"
                onClick={() => { setShareModalType(null); setShareInput(""); }}
                className="ml-auto w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-base" />
              </button>
            </div>
            <div className="p-5">
              <input
                type="url"
                value={shareInput}
                onChange={(e) => setShareInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleShareSubmit(); }}
                placeholder={shareModalType.placeholder}
                autoFocus
                className="w-full bg-gray-800 text-white text-sm rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-violet-500 transition-colors placeholder-gray-600"
              />
              <p className="text-gray-600 text-xs mt-2 flex items-center gap-1">
                <i className="ri-shield-check-line text-emerald-500" />
                This will appear in chat and be saved to the Resource Vault
              </p>
            </div>
            <div className="flex items-center gap-2 px-5 pb-5">
              <button
                type="button"
                onClick={() => { setShareModalType(null); setShareInput(""); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-400 text-sm hover:text-white hover:border-gray-600 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleShareSubmit}
                disabled={!shareInput.trim()}
                className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-40 transition-colors cursor-pointer"
              >
                Share &amp; Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
