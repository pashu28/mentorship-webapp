import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { label: "My Sessions",       icon: "ri-calendar-schedule-line", activeIcon: "ri-calendar-schedule-fill", path: "/session-dashboard" },
  { label: "My Assigned Tasks", icon: "ri-task-line",              activeIcon: "ri-task-fill",              path: "/task-dashboard" },
  { label: "Achievements",      icon: "ri-trophy-line",            activeIcon: "ri-trophy-fill",            path: "/achievements" },
  { label: "In-App Tutor",      icon: "ri-sparkling-2-line",      activeIcon: "ri-sparkling-2-fill",      path: "/tutor" },
  { label: "Resource Vault",    icon: "ri-archive-drawer-line",   activeIcon: "ri-archive-drawer-fill",   path: "/resources" },
  { label: "Find Mentor",       icon: "ri-user-search-line",      activeIcon: "ri-user-search-fill",      path: "/find-mentor" },
];

const PROFILE_MENU = [
  { label: "Account Info",       icon: "ri-user-3-line",         path: "/profile", tab: "account" },
  { label: "Edit Profile",       icon: "ri-edit-line",           path: "/profile", tab: "edit" },
  { label: "Settings",           icon: "ri-settings-3-line",     path: "/profile", tab: "settings" },
  { label: "Subscription Plan",  icon: "ri-vip-crown-line",      path: "/profile", tab: "subscription" },
  { label: "Feedback Given",     icon: "ri-feedback-line",       path: "/profile", tab: "feedback" },
];

interface Notification {
  id: number;
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    icon: "ri-video-line",
    iconColor: "text-violet-500",
    iconBg: "bg-[var(--accent-light)]",
    title: "Session in 30 minutes",
    desc: "Your session with Sarah Chen starts at 10:00 AM.",
    time: "Just now",
    unread: true,
  },
  {
    id: 2,
    icon: "ri-task-line",
    iconColor: "text-emerald-500",
    iconBg: "bg-[var(--success-light)]",
    title: "New task assigned",
    desc: "Sarah Chen assigned you \"Build a UX Case Study\".",
    time: "2h ago",
    unread: true,
  },
  {
    id: 3,
    icon: "ri-message-3-line",
    iconColor: "text-amber-500",
    iconBg: "bg-[var(--warning-light)]",
    title: "New message from mentor",
    desc: "Sarah Chen: \"Great progress on your portfolio!\"",
    time: "Yesterday",
    unread: true,
  },
  {
    id: 4,
    icon: "ri-sparkling-2-line",
    iconColor: "text-violet-500",
    iconBg: "bg-[var(--accent-light)]",
    title: "AI Tutor tip ready",
    desc: "Your weekly learning summary is available.",
    time: "2 days ago",
    unread: false,
  },
  {
    id: 5,
    icon: "ri-calendar-check-line",
    iconColor: "text-emerald-500",
    iconBg: "bg-[var(--success-light)]",
    title: "Session completed",
    desc: "Your session with Marcus Lee has been recorded.",
    time: "3 days ago",
    unread: false,
  },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const storedName = localStorage.getItem("mentorAI_userName") || "Alex Johnson";
  const displayName = storedName;
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isActive = (path: string) => location.pathname === path;
  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuNav = (path: string, tab: string) => {
    setMenuOpen(false);
    navigate(`${path}?tab=${tab}`);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, unread: false } : n));
  };

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      {/* Sidebar */}
      <aside
        className={`flex flex-col border-r transition-all duration-300 shrink-0 h-screen ${
          collapsed ? "w-[68px]" : "w-[220px]"
        }`}
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border)",
        }}
      >
        {/* Logo */}
        <div
          className={`flex items-center gap-2.5 px-4 py-5 border-b ${collapsed ? "justify-center" : ""}`}
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "var(--accent)" }}
          >
            <i className="ri-sparkling-2-fill text-white text-base" />
          </div>
          {!collapsed && (
            <span
              className="font-bold tracking-tight text-[15px]"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--accent)" }}
            >
              GrowthFlow
            </span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-1 px-2 py-4">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer whitespace-nowrap w-full text-left ${
                  collapsed ? "justify-center" : ""
                }`}
                style={{
                  backgroundColor: active ? "var(--accent-light)" : "transparent",
                  color: active ? "var(--accent)" : "var(--text-secondary)",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-elevated)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                  }
                }}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <i className={`${active ? item.activeIcon : item.icon} text-base`} />
                </div>
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && active && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom: notifications + user card + collapse */}
        <div
          className={`flex flex-col gap-2 px-2 py-3 border-t ${collapsed ? "items-center" : ""}`}
          style={{ borderColor: "var(--border)" }}
        >
          {/* Notification bell */}
          <div ref={notifRef} className="relative">
            <button
              type="button"
              onClick={() => { setNotifOpen((o) => !o); setMenuOpen(false); }}
              title={collapsed ? "Notifications" : undefined}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer whitespace-nowrap w-full text-left ${
                collapsed ? "justify-center" : ""
              }`}
              style={{
                backgroundColor: notifOpen ? "var(--accent-light)" : "transparent",
                color: notifOpen ? "var(--accent)" : "var(--text-secondary)",
              }}
            >
              <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
                <i className={`${notifOpen ? "ri-notification-3-fill" : "ri-notification-3-line"} text-base`} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              {!collapsed && <span>Notifications</span>}
              {!collapsed && unreadCount > 0 && (
                <span className="ml-auto px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none shrink-0">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications panel */}
            {notifOpen && (
              <div
                className="absolute z-50 rounded-2xl overflow-hidden border animate-fade-in"
                style={{
                  bottom: "calc(100% + 8px)",
                  left: collapsed ? "calc(100% + 8px)" : "0",
                  right: collapsed ? "auto" : "0",
                  width: collapsed ? "300px" : "auto",
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border)",
                }}
              >
                {/* Header */}
                <div
                  className="flex items-center justify-between px-4 py-3 border-b"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      Notifications
                    </p>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="text-xs font-medium cursor-pointer whitespace-nowrap"
                      style={{ color: "var(--accent)" }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* List */}
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => markRead(n.id)}
                      className="w-full flex items-start gap-3 px-4 py-3 text-left cursor-pointer border-b last:border-0"
                      style={{
                        backgroundColor: n.unread ? "var(--accent-light)" : "transparent",
                        borderColor: "var(--border-subtle)",
                      }}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${n.iconBg}`}
                      >
                        <i className={`${n.icon} ${n.iconColor} text-sm`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p
                            className="text-xs font-semibold truncate"
                            style={{ color: n.unread ? "var(--text-primary)" : "var(--text-secondary)" }}
                          >
                            {n.title}
                          </p>
                          {n.unread && (
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: "var(--accent)" }}
                            />
                          )}
                        </div>
                        <p className="text-xs mt-0.5 leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>
                          {n.desc}
                        </p>
                        <p className="text-[10px] mt-1 font-medium" style={{ color: "var(--text-muted)" }}>
                          {n.time}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                  <button
                    type="button"
                    onClick={() => { setNotifOpen(false); navigate("/profile?tab=settings"); }}
                    className="w-full flex items-center justify-center gap-1.5 text-xs cursor-pointer py-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <i className="ri-settings-3-line text-xs" />
                    Manage notification settings
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User card */}
          <div ref={menuRef} className="relative">
            <div
              className={`flex items-center gap-2.5 px-2 py-2.5 rounded-xl cursor-pointer group ${
                collapsed ? "justify-center" : ""
              }`}
              style={{
                backgroundColor: isActive("/profile") ? "var(--accent-light)" : "transparent",
              }}
              onClick={() => collapsed ? navigate("/profile") : undefined}
            >
              {/* Avatar */}
              <div
                className="w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold shrink-0"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {initials}
              </div>

              {!collapsed && (
                <>
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => navigate("/profile?tab=account")}
                  >
                    <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                      {displayName}
                    </p>
                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                      Mentee · Free Plan
                    </p>
                  </div>

                  {/* ··· button */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
                    className={`w-6 h-6 flex items-center justify-center rounded-lg cursor-pointer shrink-0`}
                    style={{ color: "var(--text-muted)" }}
                    title="More options"
                  >
                    <i className="ri-more-2-fill text-sm" />
                  </button>
                </>
              )}
            </div>

            {/* Popover menu */}
            {menuOpen && !collapsed && (
              <div
                className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl overflow-hidden z-50 border animate-fade-in"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border)",
                }}
              >
                {/* Header */}
                <div
                  className="px-4 py-3 border-b flex items-center gap-3"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <div
                    className="w-9 h-9 flex items-center justify-center rounded-full text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                      {displayName}
                    </p>
                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                      mentee@mentorai.com
                    </p>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1.5">
                  {PROFILE_MENU.map((item) => (
                    <button
                      key={item.tab}
                      type="button"
                      onClick={() => handleMenuNav(item.path, item.tab)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer text-left whitespace-nowrap"
                      style={{ color: "var(--text-secondary)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-elevated)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                      }}
                    >
                      <div className="w-4 h-4 flex items-center justify-center shrink-0">
                        <i className={`${item.icon} text-sm`} style={{ color: "var(--text-muted)" }} />
                      </div>
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Sign out */}
                <div className="border-t py-1.5" style={{ borderColor: "var(--border-subtle)" }}>
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); navigate("/"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 cursor-pointer text-left whitespace-nowrap"
                  >
                    <div className="w-4 h-4 flex items-center justify-center shrink-0">
                      <i className="ri-logout-box-r-line text-sm" />
                    </div>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Collapse toggle */}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs cursor-pointer whitespace-nowrap ${collapsed ? "justify-center" : ""}`}
            style={{ color: "var(--text-muted)" }}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className={`${collapsed ? "ri-arrow-right-s-line" : "ri-arrow-left-s-line"} text-base`} />
            </div>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
