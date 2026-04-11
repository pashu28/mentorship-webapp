import type { ChatMessage } from "@/pages/tutor/page";

interface TutorMessageBubbleProps {
  message: ChatMessage;
}

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
      <div className="flex gap-3 items-start" style={{ animation: "fadeSlideIn 0.35s ease-out" }}>
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center shrink-0 mt-0.5">
          <i className="ri-sparkling-2-fill text-white text-sm" />
        </div>

        {/* Bubble */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-gray-700">AI Tutor</span>
            <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-5 py-4 text-sm text-gray-800 leading-relaxed">
            <p
              dangerouslySetInnerHTML={{ __html: renderMarkdown(message.text) }}
              className="[&>p]:mb-3 [&>p:last-child]:mb-0"
            />
          </div>

          {/* Action row */}
          <div className="flex items-center gap-3 mt-2 pl-1">
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-thumb-up-line text-xs" />
              </div>
              Helpful
            </button>
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-thumb-down-line text-xs" />
              </div>
              Not helpful
            </button>
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-file-copy-line text-xs" />
              </div>
              Copy
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User message
  return (
    <div className="flex gap-3 items-start flex-row-reverse" style={{ animation: "fadeSlideIn 0.3s ease-out" }}>
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-white text-xs font-bold">A</span>
      </div>

      {/* Bubble */}
      <div className="flex-1 min-w-0 flex flex-col items-end">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
          <span className="text-xs font-semibold text-gray-700">You</span>
        </div>
        <div className="bg-gray-900 text-white rounded-2xl rounded-tr-sm px-5 py-4 text-sm leading-relaxed max-w-[85%]">
          {message.text}
        </div>
      </div>
    </div>
  );
}
