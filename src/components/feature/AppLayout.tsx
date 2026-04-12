import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { label: "My Sessions",       icon: "ri-calendar-schedule-line", activeIcon: "ri-calendar-schedule-fill", path: "/session-dashboard" },
  { label: "My Assigned Tasks", icon: "ri-task-line",              activeIcon: "ri-task-fill",              path: "/task-dashboard" },
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
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50",
    title: "Session in 30 minutes",
    desc: "Your session with Sarah Chen starts at 10:00 AM.",
    time: "Just now",
    unread: true,
  },
  {
    id: 2,
    icon: "ri-task-line",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    title: "New task assigned",
    desc: "Sarah Chen assigned you \"Build a UX Case Study\".",
    time: "2h ago",
    unread: true,
  },
  {
    id: 3,
    icon: "ri-message-3-line",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    title: "New message from mentor",
    desc: "Sarah Chen: \"Great progress on your portfolio!\"",
    time: "Yesterday",
    unread: true,
  },
  {
    id: 4,
    icon: "ri-sparkling-2-line",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-50",
    title: "AI Tutor tip ready",
    desc: "Your weekly learning summary is available.",
    time: "2 days ago",
    unread: false,
  },
  {
    id: 5,
    icon: "ri-calendar-check-line",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
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
    <div className="min-h-screen bg-[#F8F8FA] dark:bg-zinc-950 flex">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 transition-all duration-300 shrink-0 ${
          collapsed ? "w-[68px]" : "w-[220px]"
        }`}
        style={{ minHeight: "100vh", position: "sticky", top: 0, height: "100vh" }}
      >
        {/* Logo */}
        <div className={`flex items-center gap-2.5 px-4 py-5 border-b border-gray-100 dark:border-zinc-800 ${collapsed ? "justify-center" : ""}`}>
          <img
            src="https://public.readdy.ai/ai/img_res/c1296ba1-3a0e-4b18-b1f8-e3ff105a92d8.png"
            alt="MentorAI"
            className="w-8 h-8 object-contain shrink-0"
          />
          {!collapsed && (
            <span className="font-bold text-gray-900 dark:text-zinc-100 text-base tracking-tight">MentorAI</span>
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer whitespace-nowrap w-full text-left ${
                  active
                    ? "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300"
                    : "text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/80 hover:text-gray-800 dark:hover:text-zinc-200"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <i className={`${active ? item.activeIcon : item.icon} text-base`} />
                </div>
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom: notifications + user card + collapse */}
        <div className={`flex flex-col gap-2 px-2 py-3 border-t border-gray-100 dark:border-zinc-800 ${collapsed ? "items-center" : ""}`}>

          {/* Notification bell */}
          <div ref={notifRef} className="relative">
            <button
              type="button"
              onClick={() => { setNotifOpen((o) => !o); setMenuOpen(false); }}
              title={collapsed ? "Notifications" : undefined}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer whitespace-nowrap w-full text-left ${
                notifOpen ? "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300" : "text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/80 hover:text-gray-800 dark:hover:text-zinc-200"
              } ${collapsed ? "justify-center" : ""}`}
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
                className="absolute z-50 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xl dark:shadow-black/40"
                style={{
                  bottom: "calc(100% + 8px)",
                  left: collapsed ? "calc(100% + 8px)" : "0",
                  right: collapsed ? "auto" : "0",
                  width: collapsed ? "300px" : "auto",
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Notifications</p>
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
                      className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 font-medium cursor-pointer whitespace-nowrap transition-colors"
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
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors cursor-pointer border-b border-gray-50 dark:border-zinc-800 last:border-0 ${
                        n.unread ? "bg-violet-50/40 dark:bg-violet-950/20 hover:bg-violet-50 dark:hover:bg-violet-950/35" : "hover:bg-gray-50 dark:hover:bg-zinc-800/60"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl ${n.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <i className={`${n.icon} ${n.iconColor} text-sm`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className={`text-xs font-semibold truncate ${n.unread ? "text-gray-900 dark:text-zinc-100" : "text-gray-600 dark:text-zinc-400"}`}>
                            {n.title}
                          </p>
                          {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5 leading-relaxed line-clamp-2">{n.desc}</p>
                        <p className="text-[10px] text-gray-300 dark:text-zinc-600 mt-1 font-medium">{n.time}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-gray-50 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => { setNotifOpen(false); navigate("/profile?tab=settings"); }}
                    className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-400 dark:text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors cursor-pointer py-1"
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
              className={`flex items-center gap-2.5 px-2 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/80 cursor-pointer transition-colors group ${
                collapsed ? "justify-center" : ""
              } ${isActive("/profile") ? "bg-violet-50 dark:bg-violet-950/40" : ""}`}
              onClick={() => collapsed ? navigate("/profile") : undefined}
            >
              {/* Avatar */}
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white text-sm font-bold shrink-0">
                A
              </div>

              {!collapsed && (
                <>
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => navigate("/profile?tab=account")}
                  >
                    <p className="text-xs font-semibold text-gray-900 dark:text-zinc-100 truncate">Alex Johnson</p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 truncate">Mentee · Free Plan</p>
                  </div>

                  {/* ··· button */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
                    className={`w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0 ${
                      menuOpen ? "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-200" : ""
                    }`}
                    title="More options"
                  >
                    <i className="ri-more-2-fill text-sm" />
                  </button>
                </>
              )}
            </div>

            {/* Popover menu */}
            {menuOpen && !collapsed && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-lg dark:shadow-black/40 overflow-hidden z-50">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-50 dark:border-zinc-800 flex items-center gap-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-violet-600 text-white text-sm font-bold shrink-0">
                    A
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate">Alex Johnson</p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 truncate">alex.johnson@email.com</p>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1.5">
                  {PROFILE_MENU.map((item) => (
                    <button
                      key={item.tab}
                      type="button"
                      onClick={() => handleMenuNav(item.path, item.tab)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left whitespace-nowrap"
                    >
                      <div className="w-4 h-4 flex items-center justify-center shrink-0">
                        <i className={`${item.icon} text-gray-400 dark:text-zinc-500 text-sm`} />
                      </div>
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Sign out */}
                <div className="border-t border-gray-50 dark:border-zinc-800 py-1.5">
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); navigate("/"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer text-left whitespace-nowrap"
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
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-400 dark:text-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-600 dark:hover:text-zinc-300 transition-all cursor-pointer whitespace-nowrap ${collapsed ? "justify-center" : ""}`}
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
