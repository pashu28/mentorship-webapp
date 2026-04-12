import { useSearchParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/feature/AppLayout";
import AccountInfo from "@/pages/profile/components/AccountInfo";
import EditProfile from "@/pages/profile/components/EditProfile";
import SettingsTab from "@/pages/profile/components/SettingsTab";
import SubscriptionTab from "@/pages/profile/components/SubscriptionTab";
import FeedbackGiven from "@/pages/profile/components/FeedbackGiven";

const TABS = [
  { id: "account",      label: "Account Info",      icon: "ri-user-3-line" },
  { id: "edit",         label: "Edit Profile",       icon: "ri-edit-line" },
  { id: "settings",     label: "Settings",           icon: "ri-settings-3-line" },
  { id: "subscription", label: "Subscription",       icon: "ri-vip-crown-line" },
  { id: "feedback",     label: "Feedback Given",     icon: "ri-feedback-line" },
];

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get("tab") ?? "account";

  const setTab = (tab: string) => navigate(`/profile?tab=${tab}`, { replace: true });

  return (
    <AppLayout>
      <div className="px-6 py-8 w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-zinc-100">Profile &amp; Settings</h1>
          <p className="text-sm text-gray-400 dark:text-zinc-500 mt-1">Manage your account, preferences, and subscription</p>
        </div>

        <div className="flex gap-6 items-start max-w-5xl">
          {/* Sidebar tabs */}
          <aside className="w-48 shrink-0 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-2 sticky top-6">
            <nav className="flex flex-col gap-0.5">
              {TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setTab(tab.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap w-full text-left ${
                      active
                        ? "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300"
                        : "text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-800 dark:hover:text-zinc-200"
                    }`}
                  >
                    <div className="w-4 h-4 flex items-center justify-center shrink-0">
                      <i className={`${tab.icon} text-sm`} />
                    </div>
                    {tab.label}
                    {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />}
                  </button>
                );
              })}

              {/* Sign out */}
              <div className="border-t border-gray-100 dark:border-zinc-800 mt-1 pt-1">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer whitespace-nowrap w-full text-left"
                >
                  <div className="w-4 h-4 flex items-center justify-center shrink-0">
                    <i className="ri-logout-box-r-line text-sm" />
                  </div>
                  Sign Out
                </button>
              </div>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeTab === "account"      && <AccountInfo />}
            {activeTab === "edit"         && <EditProfile />}
            {activeTab === "settings"     && <SettingsTab />}
            {activeTab === "subscription" && <SubscriptionTab />}
            {activeTab === "feedback"     && <FeedbackGiven />}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
