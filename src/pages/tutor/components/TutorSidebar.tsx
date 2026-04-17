import { useState } from "react";
import type { Conversation } from "@/pages/tutor/page";

interface TutorSidebarProps {
  conversations: Conversation[]; activeConvId: string | null;
  onNewChat: () => void; onSelectConv: (id: string) => void; onDeleteConv: (id: string) => void;
}

function formatRelativeTime(date: Date): string {
  const diffHours = (new Date().getTime() - date.getTime()) / (1000 * 60 * 60);
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
  if (diffHours < 168) return `${Math.floor(diffHours / 24)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function groupConversations(conversations: Conversation[]) {
  const today: Conversation[] = [], yesterday: Conversation[] = [], older: Conversation[] = [];
  conversations.forEach((c) => {
    const h = (new Date().getTime() - c.createdAt.getTime()) / (1000 * 60 * 60);
    if (h < 24) today.push(c); else if (h < 48) yesterday.push(c); else older.push(c);
  });
  return { today, yesterday, older };
}

export default function TutorSidebar({ conversations, activeConvId, onNewChat, onSelectConv, onDeleteConv }: TutorSidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { today, yesterday, older } = groupConversations(conversations);

  const filterConvs = (list: Conversation[]) =>
    searchQuery ? list.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase())) : list;

  const renderGroup = (label: string, items: Conversation[]) => {
    const filtered = filterConvs(items);
    if (filtered.length === 0) return null;
    return (
      <div className="mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest px-3 mb-1.5" style={{ color: "var(--text-muted)" }}>{label}</p>
        <div className="flex flex-col gap-0.5">
          {filtered.map((conv) => {
            const isActive = conv.id === activeConvId;
            const isHovered = hoveredId === conv.id;
            return (
              <div key={conv.id}
                className="group relative flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all"
                style={{
                  backgroundColor: isActive ? "var(--accent-light)" : "transparent",
                  color: isActive ? "var(--accent)" : "var(--text-muted)",
                }}
                onClick={() => onSelectConv(conv.id)}
                onMouseEnter={(e) => { setHoveredId(conv.id); if (!isActive) (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--bg-elevated)"; }}
                onMouseLeave={(e) => { setHoveredId(null); if (!isActive) (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"; }}>
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  <i className="ri-message-3-line text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs truncate leading-snug" style={{ color: isActive ? "var(--accent-text)" : "var(--text-secondary)", fontWeight: isActive ? 500 : 400 }}>
                    {conv.title}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{formatRelativeTime(conv.createdAt)}</p>
                </div>
                {(isHovered || isActive) && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); onDeleteConv(conv.id); }}
                    className="w-5 h-5 flex items-center justify-center rounded-md transition-all cursor-pointer shrink-0"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-elevated)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")}>
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
    <aside className="w-[260px] shrink-0 border-r flex flex-col h-full overflow-hidden"
      style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between px-4 pt-5 pb-4 border-b shrink-0"
        style={{ borderColor: "var(--border)" }}>
        <span className="text-sm font-bold" style={{ color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif" }}>
          Conversations
        </span>
        <button type="button" onClick={onNewChat} title="New chat"
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-all cursor-pointer"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent-light)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}>
          <i className="ri-edit-line text-base" />
        </button>
      </div>

      <div className="px-3 pt-3 pb-2 shrink-0">
        <button type="button" onClick={onNewChat}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-dashed text-sm font-medium whitespace-nowrap cursor-pointer transition-all"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--accent-text)"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent-light)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}>
          <i className="ri-add-line text-base" />
          New conversation
        </button>
      </div>

      <div className="px-3 pb-3 shrink-0">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border"
          style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}>
          <i className="ri-search-line text-sm shrink-0" style={{ color: "var(--text-muted)" }} />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="flex-1 bg-transparent text-xs focus:outline-none"
            style={{ color: "var(--text-primary)" }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2 px-4">
            <div className="w-8 h-8 flex items-center justify-center rounded-full" style={{ backgroundColor: "var(--bg-elevated)" }}>
              <i className="ri-chat-3-line text-base" style={{ color: "var(--text-muted)" }} />
            </div>
            <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>No conversations yet.<br />Start a new chat!</p>
          </div>
        ) : (
          <>
            {renderGroup("Today", today)}
            {renderGroup("Yesterday", yesterday)}
            {renderGroup("Earlier", older)}
          </>
        )}
      </div>

      <div className="px-4 py-3 border-t shrink-0" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-start gap-2 p-2.5 rounded-xl border"
          style={{ backgroundColor: "var(--accent-light)", borderColor: "var(--accent-light)" }}>
          <i className="ri-information-line text-xs mt-0.5 shrink-0" style={{ color: "var(--accent-text)" }} />
          <p className="text-xs leading-relaxed" style={{ color: "var(--accent-text)" }}>
            Free learning space — ask anything, explore any topic.
          </p>
        </div>
      </div>
    </aside>
  );
}
