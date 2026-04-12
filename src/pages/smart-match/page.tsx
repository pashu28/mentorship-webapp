import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mentors } from "@/mocks/mentors";
import BookingModal from "./BookingModal";

export default function SmartMatchPage() {
  const [selectedMentor, setSelectedMentor] = useState<typeof mentors[0] | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-zinc-950 flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <img src="https://public.readdy.ai/ai/img_res/c1296ba1-3a0e-4b18-b1f8-e3ff105a92d8.png" alt="MentorAI" className="w-8 h-8 object-contain" />
          <span className="font-bold text-gray-900 text-lg">MentorAI</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-violet-600 text-white text-xs font-bold">1</div>
          <div className="w-16 h-0.5 bg-violet-300" />
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-violet-600 text-white text-xs font-bold">2</div>
          <div className="w-16 h-0.5 bg-violet-300" />
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-violet-600 text-white text-xs font-bold">3</div>
        </div>
      </nav>

      <main className="flex-1 px-6 py-14 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 text-violet-600 text-xs font-medium mb-4">
            <i className="ri-sparkling-2-fill" />
            AI-Powered Matching
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Here are your{" "}
            <span className="bg-gradient-to-r from-violet-600 to-emerald-500 bg-clip-text text-transparent">
              best matches
            </span>
          </h1>
          <p className="text-gray-500 text-lg">Based on your goals, background, and career trajectory.</p>
        </div>

        {/* Mentor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mentors.map((mentor, idx) => (
            <div
              key={mentor.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Match Score Badge */}
              <div className="relative">
                <div className="h-32 bg-gradient-to-br from-violet-100 to-emerald-50 flex items-end justify-center pb-0">
                  <img
                    src={mentor.photo}
                    alt={mentor.name}
                    className="w-24 h-24 rounded-full object-cover object-top border-4 border-white translate-y-12"
                  />
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white text-xs font-bold text-violet-700 border border-violet-100">
                  {mentor.matchScore}% match
                </div>
              </div>

              {/* Content */}
              <div className="pt-14 pb-6 px-6 flex flex-col flex-1">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{mentor.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{mentor.role}</p>
                  <p className="text-sm font-medium text-gray-700">{mentor.company}</p>
                </div>

                {/* Match Reason */}
                <div className="bg-gradient-to-r from-violet-50 to-emerald-50 rounded-xl px-4 py-3 mb-4 text-center">
                  <p className="text-xs font-semibold text-violet-700">
                    ✨ {mentor.matchReason}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                  {mentor.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-gray-500 text-center leading-relaxed mb-5 flex-1">{mentor.bio}</p>

                {/* Availability */}
                <div className="flex items-center justify-center gap-1.5 mb-5">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <span
                      key={day}
                      className={`text-xs px-2 py-1 rounded-md font-medium ${
                        mentor.availability.includes(day)
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-300"
                      }`}
                    >
                      {day}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedMentor(mentor)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold text-sm hover:from-violet-700 hover:to-violet-600 transition-all duration-200 hover:scale-[1.02] whitespace-nowrap cursor-pointer"
                >
                  Schedule First Session
                </button>
              </div>
            </div>
          ))}
        </div>


      </main>

      {selectedMentor && (
        <BookingModal
          mentor={selectedMentor}
          onClose={() => setSelectedMentor(null)}
          onConfirm={(_date, _time) => {
            setSelectedMentor(null);
            navigate("/session-dashboard");
          }}
        />
      )}
    </div>
  );
}
