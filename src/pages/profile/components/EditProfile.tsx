import { useState } from "react";

const inputStyle = {
  backgroundColor: "var(--bg-elevated)",
  borderColor: "var(--border)",
  color: "var(--text-primary)",
};

export default function EditProfile() {
  const storedName = localStorage.getItem("mentorAI_userName") || "Alex Johnson";
  const storedEmail = localStorage.getItem("mentorAI_userEmail") || "alex.johnson@email.com";
  const nameParts = storedName.trim().split(" ");
  const storedFirst = nameParts[0] ?? "Alex";
  const storedLast = nameParts.slice(1).join(" ") || "Johnson";

  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    firstName: storedFirst, lastName: storedLast, email: storedEmail,
    phone: "", location: "", timezone: "PST", bio: "",
    linkedin: "", github: "", portfolio: "", learningGoal: "", currentRole: "", experience: "2-4 years",
  });

  const handleChange = (field: string, value: string) => { setForm((f) => ({ ...f, [field]: value })); setSaved(false); };

  const handleSave = () => {
    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
    if (fullName) localStorage.setItem("mentorAI_userName", fullName);
    if (form.email) localStorage.setItem("mentorAI_userEmail", form.email);
    setSaved(true);
  };

  const labelStyle = { color: "var(--text-muted)" };
  const sectionStyle = { backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" };

  return (
    <div className="space-y-5">
      {/* Avatar */}
      <div className="border rounded-2xl p-6" style={sectionStyle}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Profile Photo</h3>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 flex items-center justify-center rounded-full text-white text-2xl font-bold shrink-0"
            style={{ backgroundColor: "var(--accent)" }}>
            {`${form.firstName[0] ?? ""}${form.lastName[0] ?? ""}`.toUpperCase() || "A"}
          </div>
          <div className="flex gap-2">
            <button type="button" className="px-4 py-2 rounded-lg border text-sm transition-colors cursor-pointer whitespace-nowrap"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)", backgroundColor: "transparent" }}>
              Upload Photo
            </button>
            <button type="button" className="px-4 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer whitespace-nowrap">
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Basic info */}
      <div className="border rounded-2xl p-6 space-y-4" style={sectionStyle}>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { field: "firstName", label: "First Name", type: "text" },
            { field: "lastName",  label: "Last Name",  type: "text" },
            { field: "email",     label: "Email",      type: "email" },
            { field: "phone",     label: "Phone",      type: "text" },
            { field: "location",  label: "Location",   type: "text" },
          ].map((f) => (
            <div key={f.field}>
              <label className="block text-xs mb-1.5" style={labelStyle}>{f.label}</label>
              <input type={f.type} value={form[f.field as keyof typeof form]}
                onChange={(e) => handleChange(f.field, e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors"
                style={inputStyle} />
            </div>
          ))}
          <div>
            <label className="block text-xs mb-1.5" style={labelStyle}>Time Zone</label>
            <select value={form.timezone} onChange={(e) => handleChange("timezone", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors cursor-pointer"
              style={inputStyle}>
              {["PST", "MST", "CST", "EST", "GMT", "CET", "IST", "JST"].map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs mb-1.5" style={labelStyle}>Bio</label>
          <textarea value={form.bio} onChange={(e) => handleChange("bio", e.target.value)}
            rows={3} maxLength={500}
            className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors resize-none"
            style={inputStyle} />
          <p className="text-xs mt-1 text-right" style={{ color: "var(--text-muted)" }}>{form.bio.length}/500</p>
        </div>
      </div>

      {/* Career info */}
      <div className="border rounded-2xl p-6 space-y-4" style={sectionStyle}>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Career &amp; Learning</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs mb-1.5" style={labelStyle}>Current Role</label>
            <input type="text" value={form.currentRole} onChange={(e) => handleChange("currentRole", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={labelStyle}>Experience Level</label>
            <select value={form.experience} onChange={(e) => handleChange("experience", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors cursor-pointer" style={inputStyle}>
              {["0-1 years", "1-2 years", "2-4 years", "4-7 years", "7+ years"].map((x) => (
                <option key={x} value={x}>{x}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs mb-1.5" style={labelStyle}>Learning Goal</label>
            <input type="text" value={form.learningGoal} onChange={(e) => handleChange("learningGoal", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors" style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Social links */}
      <div className="border rounded-2xl p-6 space-y-4" style={sectionStyle}>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Links &amp; Social</h3>
        <div className="space-y-3">
          {[
            { field: "linkedin",  label: "LinkedIn",  icon: "ri-linkedin-line",  placeholder: "linkedin.com/in/username" },
            { field: "github",    label: "GitHub",    icon: "ri-github-line",    placeholder: "github.com/username" },
            { field: "portfolio", label: "Portfolio", icon: "ri-global-line",    placeholder: "yoursite.com" },
          ].map((link) => (
            <div key={link.field} className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg shrink-0"
                style={{ backgroundColor: "var(--bg-elevated)" }}>
                <i className={`${link.icon} text-sm`} style={{ color: "var(--text-muted)" }} />
              </div>
              <input type="text" value={form[link.field as keyof typeof form]}
                onChange={(e) => handleChange(link.field, e.target.value)}
                placeholder={link.placeholder}
                className="flex-1 px-3 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors"
                style={inputStyle} />
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--success)" }}>
            <i className="ri-checkbox-circle-fill" /> Changes saved
          </span>
        )}
        <button type="button" onClick={handleSave}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
          style={{ backgroundColor: "var(--accent)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent-hover)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent)")}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
