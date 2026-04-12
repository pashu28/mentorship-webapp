import { useState, useRef, useEffect } from "react";
import type { Conversation, ChatMessage } from "@/pages/tutor/page";
import TutorMessageBubble from "@/pages/tutor/components/TutorMessageBubble";

interface SuggestedTopic {
  icon: string;
  label: string;
  prompt: string;
}

interface TutorChatProps {
  conversation: Conversation | null;
  isTyping: boolean;
  suggestedTopics: SuggestedTopic[];
  onSendMessage: (text: string) => void;
}

export default function TutorChat({ conversation, isTyping, suggestedTopics, onSendMessage }: TutorChatProps) {
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages, isTyping]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;
    onSendMessage(trimmed);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const handleTopicClick = (prompt: string) => {
    onSendMessage(prompt);
  };

  const isEmptyState = !conversation;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8F8FA]">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 shrink-0">
          <i className="ri-sparkling-2-fill text-white text-sm" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">
            {conversation ? conversation.title : "AI Tutor"}
          </p>
          <p className="text-xs text-gray-400">
            {conversation
              ? `${conversation.messages.length} messages`
              : "Ask me anything about UX, design, or your learning journey"}
          </p>
        </div>
        {conversation && (
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-gray-400">Online</span>
          </div>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {isEmptyState ? (
          /* ── Empty / Welcome State ── */
          <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto">
            <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-violet-600 mb-5">
              <i className="ri-sparkling-2-fill text-white text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">What do you want to learn today?</h2>
            <p className="text-sm text-gray-500 text-center mb-8 max-w-md leading-relaxed">
              I&apos;m your personal AI Tutor — ask me anything about UX design, Figma, portfolios, research methods, or anything else on your mind.
            </p>

            {/* Suggested topics grid */}
            <div className="w-full grid grid-cols-2 gap-3 mb-6">
              {suggestedTopics.map((topic) => (
                <button
                  key={topic.label}
                  type="button"
                  onClick={() => handleTopicClick(topic.prompt)}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-all cursor-pointer text-left group"
                >
                  <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 group-hover:bg-violet-100 transition-colors shrink-0">
                    <i className={`${topic.icon} text-gray-500 group-hover:text-violet-600 text-base transition-colors`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-violet-700 transition-colors leading-snug">{topic.label}</p>
                    <p className="text-xs text-gray-400 truncate leading-snug mt-0.5">{topic.prompt.slice(0, 38)}…</p>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-400">Or type your own question below</p>
          </div>
        ) : (
          /* ── Conversation Messages ── */
          <div className="max-w-2xl mx-auto flex flex-col gap-6">
            {conversation.messages.map((msg: ChatMessage) => (
              <TutorMessageBubble key={msg.id} message={msg} />
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3 items-start" style={{ animation: "fadeSlideIn 0.3s ease-out" }}>
                <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                  <i className="ri-sparkling-2-fill text-white text-sm" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white border border-gray-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="px-6 py-4 bg-white border-t border-gray-100 shrink-0">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-3 p-3 rounded-2xl border border-gray-200 bg-white focus-within:border-violet-400 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything — concepts, doubts, how-tos..."
              rows={1}
              className="flex-1 resize-none text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none leading-relaxed min-h-[24px] max-h-[160px]"
              style={{ height: "24px" }}
            />
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-gray-300 hidden sm:block">⏎ Send</span>
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer shrink-0 ${
                  input.trim() && !isTyping
                    ? "bg-violet-600 hover:bg-violet-700 text-white"
                    : "bg-gray-100 text-gray-300 cursor-not-allowed"
                }`}
              >
                <i className="ri-send-plane-fill text-sm" />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            AI Tutor can make mistakes — always verify important information.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
