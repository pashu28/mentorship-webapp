import { useState } from "react";
import { useTheme, ThemeMode } from "@/hooks/useTheme";

interface ToggleProps {
  label: string;
  description?: string;
  defaultOn?: boolean;
  isLast?: boolean;
}

function Toggle({ label, description, defaultOn = false, isLast = false }: ToggleProps) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div
      className="flex items-center justify-between py-3.5"
      style={!isLast ? { borderBottom: "1px solid var(--border)" } : undefined}
    >
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</p>
        {description && <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        className="relative w-11 h-6 rounded-full cursor-pointer shrink-0"
        style={{
          backgroundColor: on ? "var(--accent)" : "var(--bg-elevated)",
          transition: "background-color 0.2s ease",
        }}
      >
        <span
          className="absolute top-1 w-4 h-4 rounded-full bg-white"
          style={{
            left: on ? "calc(100% - 20px)" : "4px",
            transition: "left 0.2s ease",
          }}
        />
      </button>
    </div>
  );
}

const THEME_ICONS: Record<ThemeMode, string> = {
  Light: "ri-sun-line",
  Dark: "ri-moon-line",
  System: "ri-computer-line",
};

export default function SettingsTab() {
  const [language, setLanguage] = useState("English");
  const { theme, setTheme, isDark } = useTheme();

  return (
    <div className="space-y-5">
      {/* Notifications */}
      <div
        className="border rounded-2xl p-6"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}
      >
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
          Notifications
        </h3>
        <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
          Choose what you want to be notified about.
        </p>
        <div>
          <Toggle label="Session Reminders"       description="Get reminded 30 min before a session"  defaultOn />
          <Toggle label="Task Deadlines"           description="Alerts when a task is due soon"         defaultOn />
          <Toggle label="Mentor Messages"          description="New messages from your mentors"         defaultOn />
          <Toggle label="AI Tutor Suggestions"     description="Weekly learning tips from the AI tutor" />
          <Toggle label="Platform Announcements"   description="Product updates and new features" />
          <Toggle label="Email Digest"             description="Weekly summary of your progress"        defaultOn isLast />
        </div>
      </div>

      {/* Preferences */}
      <div
        className="border rounded-2xl p-6 space-y-4"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}
      >
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Preferences
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none cursor-pointer"
              style={{
                backgroundColor: "var(--bg-elevated)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            >
              {["English", "Spanish", "French", "German", "Hindi", "Japanese"].map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
              Theme
            </label>
            <div className="flex gap-2">
              {(["Light", "Dark", "System"] as ThemeMode[]).map((t) => {
                const active = theme === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium cursor-pointer whitespace-nowrap"
                    style={{
                      borderColor: active ? "var(--accent)" : "var(--border)",
                      backgroundColor: active ? "var(--accent-light)" : "var(--bg-elevated)",
                      color: active ? "var(--accent)" : "var(--text-secondary)",
                    }}
                  >
                    <i className={`${THEME_ICONS[t]} text-base`} />
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div
        className="border rounded-2xl p-6"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}
      >
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
          Privacy
        </h3>
        <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
          Control who can see your information.
        </p>
        <div>
          <Toggle label="Show Profile to Mentors"    description="Mentors can view your full profile"   defaultOn />
          <Toggle label="Show Progress to Mentors"   description="Share task and session progress"      defaultOn />
          <Toggle label="Allow AI Personalization"   description="Use your data to improve AI matching" defaultOn />
          <Toggle label="Public Leaderboard"         description="Appear in community rankings" isLast />
        </div>
      </div>

      {/* Account Actions */}
      <div
        className="border rounded-2xl p-6 space-y-3"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}
      >
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Account Actions
        </h3>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm cursor-pointer text-left whitespace-nowrap"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
              backgroundColor: "transparent",
            }}
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <i className="ri-download-line text-sm" style={{ color: "var(--text-muted)" }} />
            </div>
            Download My Data
          </button>
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm cursor-pointer text-left whitespace-nowrap"
            style={{
              borderColor: isDark ? "rgba(239,68,68,0.35)" : "#fecaca",
              color: isDark ? "#f87171" : "#ef4444",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = isDark
                ? "rgba(239,68,68,0.08)"
                : "#fef2f2";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            }}
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <i className="ri-delete-bin-line text-sm" style={{ color: isDark ? "#f87171" : "#f87171" }} />
            </div>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
