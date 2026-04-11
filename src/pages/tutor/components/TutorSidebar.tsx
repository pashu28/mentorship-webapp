import { useState } from "react";
import type { Conversation } from "@/pages/tutor/page";

interface TutorSidebarProps {
  conversations: Conversation[];
  activeConvId: string | null;
  onNewChat: () => void;
  onSelectConv: (id: string) => void;
  onDeleteConv: (id: string) => void;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
  if (diffDays < 7) return `${Math.floor(diffDays)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function groupConversations(conversations: Conversation[]) {
  const now = new Date();
  const today: Conversation[] = [];
  const yesterday: Conversation[] = [];
  const older: Conversation[] = [];

  conversations.forEach((c) => {
    const diffMs = now.getTime() - c.createdAt.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours < 24) today.push(c);
    else if (diffHours < 48) yesterday.push(c);
    else older.push(c);
  });

  return { today, yesterday, older };
}

export default function TutorSidebar({
  conversations,
  activeConvId,
  onNewChat,
  onSelectConv,
  onDeleteConv,
}: TutorSidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { today, yesterday, older } = groupConversations(conversations);

  const renderGroup = (label: string, items: Conversation[]) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1.5">{label}</p>
        <div className="flex flex-col gap-0.5">
          {items.map((conv) => {
            const isActive = conv.id === activeConvId;
            const isHovered = hoveredId === conv.id;
            return (
              <div
                key={conv.id}
                className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                  isActive ? "bg-gray-100 text-gray-900" : "hover:bg-gray-50 text-gray-600"
                }`}
                onClick={() => onSelectConv(conv.id)}
                onMouseEnter={() => setHoveredId(conv.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  <i className="ri-message-3-line text-sm text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate leading-snug ${isActive ? "text-gray-900" : "text-gray-700"}`}>
                    {conv.title}
                  </p>
                  <p className="text-xs text-gray-400">{formatRelativeTime(conv.createdAt)}</p>
                </div>
                {(isHovered || isActive) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConv(conv.id);
                    }}
                    className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-all cursor-pointer shrink-0"
                  >
                    <i className="ri-delete-bin-line text-xs" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <aside className="w-[260px] shrink-0 bg-white border-r border-gray-100 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-violet-600">
            <i className="ri-sparkling-2-fill text-white text-sm" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-none">AI Tutor</p>
            <p className="text-xs text-gray-400 mt-0.5">Free learning mode</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-gray-300 text-gray-500 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-all cursor-pointer text-sm font-medium whitespace-nowrap"
        >
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-add-line text-base" />
          </div>
          New conversation
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
              <i className="ri-chat-3-line text-gray-400 text-base" />
            </div>
            <p className="text-xs text-gray-400 text-center">No conversations yet.<br />Start a new chat!</p>
          </div>
        ) : (
          <>
            {renderGroup("Today", today)}
            {renderGroup("Yesterday", yesterday)}
            {renderGroup("Earlier", older)}
          </>
        )}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-3 border-t border-gray-100 shrink-0">
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-violet-50 border border-violet-100">
          <div className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
            <i className="ri-information-line text-violet-500 text-xs" />
          </div>
          <p className="text-xs text-violet-600 leading-relaxed">
            This is a free learning space — ask anything, explore any topic.
          </p>
        </div>
      </div>
    </aside>
  );
}
