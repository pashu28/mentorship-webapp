import type { ChatMessage } from "@/pages/tutor/page";

interface TutorMessageBubbleProps { message: ChatMessage; }

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br />");
}

export default function TutorMessageBubble({ message }: TutorMessageBubbleProps) {
  const isAI = message.role === "ai";

  if (isAI) {
    return (
      <div className="flex gap-3 items-start">
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: "var(--bg-elevated)" }}>
          <i className="ri-sparkling-2-line text-sm" style={{ color: "var(--text-muted)" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>AI Tutor</span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{formatTime(message.timestamp)}</span>
          </div>
          <div className="border rounded-2xl rounded-tl-sm px-5 py-4 text-sm leading-relaxed"
            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
            <p dangerouslySetInnerHTML={{ __html: renderMarkdown(message.text) }}
              className="[&>p]:mb-3 [&>p:last-child]:mb-0" />
          </div>
          <div className="flex items-center gap-3 mt-2 pl-1">
            {[
              { icon: "ri-thumb-up-line",   label: "Helpful" },
              { icon: "ri-thumb-down-line", label: "Not helpful" },
              { icon: "ri-file-copy-line",  label: "Copy" },
            ].map((action) => (
              <button key={action.label} type="button"
                className="flex items-center gap-1 text-xs transition-colors cursor-pointer whitespace-nowrap"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)")}>
                <i className={`${action.icon} text-xs`} />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <div className="max-w-[80%]">
        <div className="flex items-center justify-end gap-2 mb-1.5">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{formatTime(message.timestamp)}</span>
          <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>You</span>
        </div>
        <div className="rounded-2xl rounded-tr-sm px-5 py-3.5 text-sm leading-relaxed"
          style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
          {message.text}
        </div>
      </div>
    </div>
  );
}
