export default function AccountInfo() {
  const storedName = localStorage.getItem("mentorAI_userName") || "Alex Johnson";
  const storedEmail = localStorage.getItem("mentorAI_userEmail") || "alex.johnson@email.com";
  const storedOccupation = localStorage.getItem("mentorAI_userOccupation") || "professional";

  const occupationLabel: Record<string, string> = {
    student: "Student",
    "career-switcher": "Career Switcher",
    professional: "Professional",
    "recent-grad": "Recent Graduate",
  };

  const initials = storedName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Avatar + name */}
      <div className="border rounded-2xl p-6" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 flex items-center justify-center rounded-full text-white text-2xl font-bold shrink-0"
            style={{ backgroundColor: "var(--accent)" }}>
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{storedName}</h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
              {occupationLabel[storedOccupation] ?? "Mentee"} · Joined {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
            <span className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: "var(--accent-light)", color: "var(--accent-text)" }}>
              <i className="ri-vip-crown-line text-xs" />
              Free Plan
            </span>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="border rounded-2xl p-6 space-y-5" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Personal Information</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          {[
            { label: "Full Name",    value: storedName,  icon: "ri-user-3-line" },
            { label: "Email",        value: storedEmail, icon: "ri-mail-line" },
            { label: "Phone",        value: "—",         icon: "ri-phone-line" },
            { label: "Location",     value: "—",         icon: "ri-map-pin-line" },
            { label: "Time Zone",    value: "—",         icon: "ri-time-line" },
            { label: "Member Since", value: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), icon: "ri-calendar-line" },
          ].map((row) => (
            <div key={row.label} className="flex items-start gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg shrink-0 mt-0.5"
                style={{ backgroundColor: "var(--bg-elevated)" }}>
                <i className={`${row.icon} text-sm`} style={{ color: "var(--text-muted)" }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{row.label}</p>
                <p className="text-sm font-medium mt-0.5" style={{ color: "var(--text-secondary)" }}>{row.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Sessions Completed", value: "12", icon: "ri-video-line",           accentVar: "var(--accent)",  bgVar: "var(--accent-light)" },
          { label: "Tasks Finished",     value: "34", icon: "ri-checkbox-circle-line", accentVar: "var(--success)", bgVar: "var(--success-light)" },
          { label: "Mentors Connected",  value: "3",  icon: "ri-user-heart-line",      accentVar: "var(--warning)", bgVar: "var(--warning-light)" },
        ].map((s) => (
          <div key={s.label} className="border rounded-2xl p-5 flex items-center gap-4"
            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
            <div className="w-10 h-10 flex items-center justify-center rounded-xl shrink-0"
              style={{ backgroundColor: s.bgVar }}>
              <i className={`${s.icon} text-lg`} style={{ color: s.accentVar }} />
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
