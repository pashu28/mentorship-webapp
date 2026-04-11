import { useState } from "react";
import { aiTutorMessages } from "@/mocks/session";

interface AiTutorPanelProps {
  taskTitle: string;
  onClose: () => void;
  onComplete: () => void;
}

interface Message {
  id: number;
  role: "ai" | "user";
  text: string;
  time: string;
  code?: string;
}

export default function AiTutorPanel({ taskTitle, onClose, onComplete }: AiTutorPanelProps) {
  const [messages, setMessages] = useState<Message[]>(aiTutorMessages as Message[]);
  const [input, setInput] = useState("");
  const [completed, setCompleted] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", text: input, time: "now" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTimeout(() => {
      const aiReply: Message = {
        id: Date.now() + 1,
        role: "ai",
        text: "Great question! In Figma, Auto Layout works similarly to CSS Flexbox. You can set the direction (horizontal/vertical), spacing between items, and padding around the container. Try selecting a frame and pressing Shift+A to add Auto Layout instantly.",
        time: "now",
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1000);
  };

  const handleComplete = () => {
    setCompleted(true);
    setTimeout(() => {
      onComplete();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md flex flex-col h-full animate-slide-in-right">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-violet-500 p-4 flex items-center justify-between">
          <div className="flex-1 min-w-0 mr-3">
            <p className="text-white/70 text-xs mb-0.5">AI Tutor — Learning</p>
            <h3 className="text-white font-bold text-sm truncate">{taskTitle}</h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!completed ? (
              <button
                type="button"
                onClick={handleComplete}
                className="px-3 py-1.5 rounded-full bg-white text-violet-700 text-xs font-bold hover:bg-violet-50 transition-all cursor-pointer whitespace-nowrap"
              >
                Mark Complete ✓
              </button>
            ) : (
              <div className="px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center gap-1">
                <i className="ri-check-line" />
                Done!
              </div>
            )}
            <button type="button" onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 cursor-pointer">
              <i className="ri-close-line text-sm" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
              {msg.role === "ai" && (
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-violet-100">
                    <i className="ri-sparkling-2-fill text-violet-600 text-xs" />
                  </div>
                  <span className="text-xs font-medium text-gray-500">AI Tutor</span>
                </div>
              )}
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "ai"
                  ? "bg-gray-100 text-gray-800 rounded-tl-sm"
                  : "bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-tr-sm"
              }`}>
                {msg.text}
              </div>
              {msg.code && (
                <div className="w-full bg-gray-900 rounded-xl p-4 mt-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-xs">CSS</span>
                    <button type="button" className="text-gray-400 text-xs hover:text-white cursor-pointer">Copy</button>
                  </div>
                  <pre className="text-emerald-400 text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap">{msg.code}</pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Suggestions */}
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
          {["Explain again", "Show an example", "Related concepts"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setInput(s)}
              className="px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 text-xs font-medium whitespace-nowrap hover:bg-violet-100 transition-all cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask a follow-up question..."
            className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
          />
          <button
            type="button"
            onClick={sendMessage}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-700 hover:to-violet-600 transition-all cursor-pointer shrink-0"
          >
            <i className="ri-send-plane-fill text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
