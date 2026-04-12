export default function AccountInfo() {
  return (
    <div className="space-y-6">
      {/* Avatar + name */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-violet-600 text-white text-2xl font-bold shrink-0">
            A
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Alex Johnson</h2>
            <p className="text-sm text-gray-400">Mentee · Joined March 2025</p>
            <span className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 text-xs font-medium">
              <i className="ri-vip-crown-line text-xs" />
              Free Plan
            </span>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-semibold text-gray-900">Personal Information</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          {[
            { label: "Full Name",     value: "Alex Johnson",              icon: "ri-user-3-line" },
            { label: "Email",         value: "alex.johnson@email.com",    icon: "ri-mail-line" },
            { label: "Phone",         value: "+1 (555) 234-5678",         icon: "ri-phone-line" },
            { label: "Location",      value: "San Francisco, CA",         icon: "ri-map-pin-line" },
            { label: "Time Zone",     value: "PST — UTC−8",               icon: "ri-time-line" },
            { label: "Member Since",  value: "March 12, 2025",            icon: "ri-calendar-line" },
          ].map((row) => (
            <div key={row.label} className="flex items-start gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 shrink-0 mt-0.5">
                <i className={`${row.icon} text-gray-400 text-sm`} />
              </div>
              <div>
                <p className="text-xs text-gray-400">{row.label}</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">{row.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Sessions Completed", value: "12", icon: "ri-video-line", color: "text-violet-600 bg-violet-50" },
          { label: "Tasks Finished",     value: "34", icon: "ri-checkbox-circle-line", color: "text-emerald-600 bg-emerald-50" },
          { label: "Mentors Connected",  value: "3",  icon: "ri-user-heart-line", color: "text-amber-600 bg-amber-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${s.color} shrink-0`}>
              <i className={`${s.icon} text-lg`} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
