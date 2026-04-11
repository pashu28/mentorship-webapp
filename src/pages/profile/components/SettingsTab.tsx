import { useState } from "react";

interface ToggleProps {
  label: string;
  description?: string;
  defaultOn?: boolean;
}

function Toggle({ label, description, defaultOn = false }: ToggleProps) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3.5">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer shrink-0 ${on ? "bg-violet-500" : "bg-gray-200"}`}
      >
        <span
          className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200"
          style={{ left: on ? "calc(100% - 20px)" : "4px" }}
        />
      </button>
    </div>
  );
}

export default function SettingsTab() {
  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState("Light");

  return (
    <div className="space-y-5">
      {/* Notifications */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Notifications</h3>
        <p className="text-xs text-gray-400 mb-4">Choose what you want to be notified about.</p>
        <div className="divide-y divide-gray-50">
          <Toggle label="Session Reminders"       description="Get reminded 30 min before a session"  defaultOn />
          <Toggle label="Task Deadlines"           description="Alerts when a task is due soon"         defaultOn />
          <Toggle label="Mentor Messages"          description="New messages from your mentors"         defaultOn />
          <Toggle label="AI Tutor Suggestions"     description="Weekly learning tips from the AI tutor" />
          <Toggle label="Platform Announcements"   description="Product updates and new features" />
          <Toggle label="Email Digest"             description="Weekly summary of your progress"        defaultOn />
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Preferences</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-violet-400 bg-white cursor-pointer"
            >
              {["English", "Spanish", "French", "German", "Hindi", "Japanese"].map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Theme</label>
            <div className="flex gap-2">
              {["Light", "Dark", "System"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    theme === t
                      ? "border-violet-400 bg-violet-50 text-violet-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Privacy</h3>
        <p className="text-xs text-gray-400 mb-4">Control who can see your information.</p>
        <div className="divide-y divide-gray-50">
          <Toggle label="Show Profile to Mentors"    description="Mentors can view your full profile"   defaultOn />
          <Toggle label="Show Progress to Mentors"   description="Share task and session progress"      defaultOn />
          <Toggle label="Allow AI Personalization"   description="Use your data to improve AI matching" defaultOn />
          <Toggle label="Public Leaderboard"         description="Appear in community rankings" />
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Account Actions</h3>
        <div className="flex flex-col gap-2">
          <button type="button" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer text-left whitespace-nowrap">
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <i className="ri-download-line text-gray-400" />
            </div>
            Download My Data
          </button>
          <button type="button" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-100 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer text-left whitespace-nowrap">
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <i className="ri-delete-bin-line text-red-400" />
            </div>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
