import { useState, useRef, useEffect } from "react";
import type { Conversation, ChatMessage } from "@/pages/tutor/page";
import TutorMessageBubble from "@/pages/tutor/components/TutorMessageBubble";

interface SuggestedTopic { icon: string; label: string; prompt: string; }
interface TutorChatProps { conversation: Conversation | null; isTyping: boolean; suggestedTopics: SuggestedTopic[]; onSendMessage: (text: string) => void; }

export default function TutorChat({ conversation, isTyping, suggestedTopics, onSendMessage }: TutorChatProps) {
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [conversation?.messages, isTyping]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;
    onSendMessage(trimmed);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const isEmptyState = !conversation;
  const quickTopics = suggestedTopics.slice(0, 4);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden" style={{ backgroundColor: "var(--bg-base)" }}>
      {conversation && (
        <div className="flex items-center justify-between px-8 py-3.5 border-b shrink-0"
          style={{ backgroundColor: "var(--bg-base)", borderColor: "var(--border)" }}>
          <p className="text-sm font-semibold truncate max-w-lg" style={{ color: "var(--text-primary)" }}>{conversation.title}</p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--success)" }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Online</span>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {isEmptyState ? (
          <div className="flex flex-col items-center justify-center h-full px-6">
            <div className="w-full max-w-2xl flex flex-col items-center">
              <h2 className="text-3xl font-bold mb-2 text-center tracking-tight" style={{ color: "var(--text-primary)" }}>
                What do you want to learn?
              </h2>
              <p className="text-sm text-center mb-10 max-w-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Ask me anything about UX, design, Figma, portfolios, or your learning journey.
              </p>

              <div className="w-full mb-5">
                <div className="flex flex-col gap-0 rounded-2xl border overflow-hidden transition-colors"
                  style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
                  <textarea ref={textareaRef} value={input} onChange={handleTextareaChange} onKeyDown={handleKeyDown}
                    placeholder="Ask anything..." rows={3}
                    className="w-full resize-none text-sm focus:outline-none leading-relaxed px-5 pt-4 pb-2 min-h-[80px] max-h-[160px] bg-transparent"
                    style={{ color: "var(--text-primary)" }} />
                  <div className="flex items-center justify-between px-4 py-3 border-t"
                    style={{ borderColor: "var(--border)" }}>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>⏎ to send, Shift+⏎ for new line</span>
                    <button type="button" onClick={handleSend} disabled={!input.trim() || isTyping}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                      style={{
                        backgroundColor: input.trim() && !isTyping ? "var(--accent)" : "var(--bg-elevated)",
                        color: input.trim() && !isTyping ? "#fff" : "var(--text-muted)",
                        cursor: input.trim() && !isTyping ? "pointer" : "not-allowed",
                      }}>
                      <i className="ri-send-plane-fill text-xs" />
                      Send
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {quickTopics.map((topic) => (
                  <button key={topic.label} type="button" onClick={() => onSendMessage(topic.prompt)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm whitespace-nowrap cursor-pointer transition-all"
                    style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-secondary)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--accent-text)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"; }}>
                    <i className={`${topic.icon} text-sm`} />
                    {topic.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto w-full flex flex-col gap-6 px-6 py-8">
            {conversation.messages.map((msg: ChatMessage) => (
              <TutorMessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "var(--bg-elevated)" }}>
                  <i className="ri-sparkling-2-line text-sm" style={{ color: "var(--text-muted)" }} />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm border flex items-center gap-1.5"
                  style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "var(--text-muted)", animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "var(--text-muted)", animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "var(--text-muted)", animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {!isEmptyState && (
        <div className="px-6 py-4 border-t shrink-0" style={{ backgroundColor: "var(--bg-base)", borderColor: "var(--border)" }}>
          <div className="max-w-2xl mx-auto">
            <div className="flex items-end gap-3 px-4 py-3 rounded-2xl border transition-colors"
              style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
              <textarea ref={textareaRef} value={input} onChange={handleTextareaChange} onKeyDown={handleKeyDown}
                placeholder="Reply..." rows={1}
                className="flex-1 resize-none text-sm focus:outline-none leading-relaxed min-h-[24px] max-h-[160px] bg-transparent"
                style={{ height: "24px", color: "var(--text-primary)" }} />
              <button type="button" onClick={handleSend} disabled={!input.trim() || isTyping}
                className="w-8 h-8 flex items-center justify-center rounded-xl transition-all cursor-pointer shrink-0"
                style={{
                  backgroundColor: input.trim() && !isTyping ? "var(--accent)" : "var(--bg-elevated)",
                  color: input.trim() && !isTyping ? "#fff" : "var(--text-muted)",
                  cursor: input.trim() && !isTyping ? "pointer" : "not-allowed",
                }}>
                <i className="ri-send-plane-fill text-sm" />
              </button>
            </div>
            <p className="text-xs text-center mt-2" style={{ color: "var(--text-muted)" }}>
              AI Tutor can make mistakes — always verify important information.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
