import { useState } from "react";

export default function EditProfile() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    timezone: "PST",
    bio: "Aspiring UX designer transitioning from a marketing background. Passionate about user research and building intuitive digital experiences.",
    linkedin: "linkedin.com/in/alexjohnson",
    github: "",
    portfolio: "alexjohnson.design",
    learningGoal: "Transition into UX Design",
    currentRole: "Marketing Specialist",
    experience: "2-4 years",
  });

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => setSaved(true);

  return (
    <div className="space-y-5">
      {/* Avatar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Profile Photo</h3>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-violet-600 text-white text-2xl font-bold shrink-0">
            A
          </div>
          <div className="flex gap-2">
            <button type="button" className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
              Upload Photo
            </button>
            <button type="button" className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer whitespace-nowrap">
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Basic info */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">First Name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-violet-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Last Name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-violet-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-violet-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-violet-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-violet-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Time Zone</label>
            <select
              value={form.timezone}
              onChange={(e) => handleChange("timezone", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-violet-400 transition-colors bg-white cursor-pointer"
            >
              {["PST", "MST", "CST", "EST", "GMT", "CET", "IST", "JST"].map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            rows={3}
            maxLength={500}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-violet-400 transition-colors resize-none"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{form.bio.length}/500</p>
        </div>
      </div>

      {/* Career info */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Career &amp; Learning</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Current Role</label>
            <input
              type="text"
              value={form.currentRole}
              onChange={(e) => handleChange("currentRole", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-violet-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Experience Level</label>
            <select
              value={form.experience}
              onChange={(e) => handleChange("experience", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-violet-400 transition-colors bg-white cursor-pointer"
            >
              {["0-1 years", "1-2 years", "2-4 years", "4-7 years", "7+ years"].map((x) => (
                <option key={x} value={x}>{x}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-gray-500 mb-1.5">Learning Goal</label>
            <input
              type="text"
              value={form.learningGoal}
              onChange={(e) => handleChange("learningGoal", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-violet-400 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Social links */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Links &amp; Social</h3>
        <div className="space-y-3">
          {[
            { field: "linkedin",  label: "LinkedIn",  icon: "ri-linkedin-line",  placeholder: "linkedin.com/in/username" },
            { field: "github",    label: "GitHub",    icon: "ri-github-line",    placeholder: "github.com/username" },
            { field: "portfolio", label: "Portfolio", icon: "ri-global-line",    placeholder: "yoursite.com" },
          ].map((link) => (
            <div key={link.field} className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 shrink-0">
                <i className={`${link.icon} text-gray-400 text-sm`} />
              </div>
              <input
                type="text"
                value={form[link.field as keyof typeof form]}
                onChange={(e) => handleChange(link.field, e.target.value)}
                placeholder={link.placeholder}
                className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-violet-400 transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600">
            <i className="ri-checkbox-circle-fill" /> Changes saved
          </span>
        )}
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
