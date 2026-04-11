interface Mentor {
  id: number;
  name: string;
  role: string;
  company: string;
  domain: string;
  expertise: string[];
  photo: string;
  matchScore: number;
  bio: string;
  sessions: number;
  rating: number;
  reviews: number;
  availability: string[];
  responseTime: string;
  sessionRate: string;
}

interface MentorCardProps {
  mentor: Mentor;
  rank: number;
  onSchedule: (mentor: Mentor) => void;
}

import { useState } from "react";

export default function MentorCard({ mentor, rank, onSchedule }: MentorCardProps) {
  const [clicked, setClicked] = useState(false);

  const handleSchedule = () => {
    setClicked(true);
    onSchedule(mentor);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-all duration-200 flex gap-4">
      {/* Rank */}
      <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-1">
        <span className="text-xs font-bold text-gray-300">#{rank}</span>
      </div>

      {/* Avatar */}
      <div className="w-12 h-12 flex items-center justify-center shrink-0">
        <img
          src={mentor.photo}
          alt={mentor.name}
          className="w-12 h-12 rounded-xl object-cover object-top"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">{mentor.name}</h3>
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">{mentor.domain}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {mentor.role} · {mentor.company}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-star-fill text-amber-400 text-xs" />
            </div>
            <span className="text-xs font-semibold text-gray-700">{mentor.rating}</span>
            <span className="text-xs text-gray-400">({mentor.reviews})</span>
          </div>
        </div>

        {/* Expertise */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {mentor.expertise.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 rounded-full border border-gray-100">
              {tag}
            </span>
          ))}
          {mentor.expertise.length > 3 && (
            <span className="text-xs px-2 py-0.5 text-gray-400">+{mentor.expertise.length - 3}</span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-3.5 h-3.5 flex items-center justify-center">
                <i className="ri-calendar-check-line text-gray-300 text-xs" />
              </div>
              <span className="text-xs text-gray-400">{mentor.sessions} sessions</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3.5 h-3.5 flex items-center justify-center">
                <i className="ri-time-line text-gray-300 text-xs" />
              </div>
              <span className="text-xs text-gray-400">{mentor.responseTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3.5 h-3.5 flex items-center justify-center">
                <i className="ri-bar-chart-fill text-gray-300 text-xs" />
              </div>
              <span className="text-xs text-gray-400">{mentor.matchScore}% match</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{mentor.sessionRate}</span>
            <button
              type="button"
              onClick={handleSchedule}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer whitespace-nowrap ${
                clicked
                  ? "bg-violet-600 border-violet-600 text-white"
                  : "bg-white border-gray-300 text-gray-700 hover:border-violet-400 hover:text-violet-600"
              }`}
            >
              <div className="w-3 h-3 flex items-center justify-center">
                <i className="ri-calendar-line text-xs" />
              </div>
              Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
