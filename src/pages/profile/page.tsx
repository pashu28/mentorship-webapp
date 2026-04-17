import { useSearchParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/feature/AppLayout";
import AccountInfo from "@/pages/profile/components/AccountInfo";
import EditProfile from "@/pages/profile/components/EditProfile";
import SettingsTab from "@/pages/profile/components/SettingsTab";
import SubscriptionTab from "@/pages/profile/components/SubscriptionTab";
import FeedbackGiven from "@/pages/profile/components/FeedbackGiven";

const TABS = [
  { id: "account",      label: "Account Info",   icon: "ri-user-3-line" },
  { id: "edit",         label: "Edit Profile",    icon: "ri-edit-line" },
  { id: "settings",     label: "Settings",        icon: "ri-settings-3-line" },
  { id: "subscription", label: "Subscription",    icon: "ri-vip-crown-line" },
  { id: "feedback",     label: "Feedback Given",  icon: "ri-feedback-line" },
];

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get("tab") ?? "account";
  const setTab = (tab: string) => navigate(`/profile?tab=${tab}`, { replace: true });

  return (
    <AppLayout>
      <div className="px-6 py-8 w-full">
        <div className="mb-6">
          <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Profile &amp; Settings</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Manage your account, preferences, and subscription</p>
        </div>

        <div className="flex gap-6 items-start max-w-5xl">
          {/* Sidebar tabs */}
          <aside className="w-48 shrink-0 border rounded-2xl p-2 sticky top-6"
            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
            <nav className="flex flex-col gap-0.5">
              {TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button key={tab.id} type="button" onClick={() => setTab(tab.id)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap w-full text-left"
                    style={{
                      backgroundColor: active ? "var(--accent-light)" : "transparent",
                      color: active ? "var(--accent)" : "var(--text-muted)",
                    }}
                    onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-elevated)"; }}
                    onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}>
                    <div className="w-4 h-4 flex items-center justify-center shrink-0">
                      <i className={`${tab.icon} text-sm`} />
                    </div>
                    {tab.label}
                    {active && <span className="ml-auto w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--accent)" }} />}
                  </button>
                );
              })}

              <div className="border-t mt-1 pt-1" style={{ borderColor: "var(--border)" }}>
                <button type="button" onClick={() => navigate("/")}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all cursor-pointer whitespace-nowrap w-full text-left">
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
