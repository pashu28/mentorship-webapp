import { useState } from "react";

interface AIMatchMentor {
  id: number;
  name: string;
  role: string;
  company: string;
  domain: string;
  expertise: string[];
  photo: string;
  matchScore: number;
  matchReasons: string[];
  bio: string;
  sessions: number;
  rating: number;
  reviews: number;
  availability: string[];
  responseTime: string;
  sessionRate: string;
}

interface AIMatchCardProps {
  mentor: AIMatchMentor;
  rank: number;
  onSchedule: (mentor: AIMatchMentor) => void;
}

export default function AIMatchCard({ mentor, rank, onSchedule }: AIMatchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleSchedule = () => {
    setClicked(true);
    onSchedule(mentor);
  };

  const scoreColor =
    mentor.matchScore >= 95
      ? "text-emerald-600 bg-emerald-50"
      : mentor.matchScore >= 90
      ? "text-teal-600 bg-teal-50"
      : "text-gray-600 bg-gray-100";

  const rankLabel = rank === 1 ? "Best Match" : rank === 2 ? "2nd Match" : "3rd Match";

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden hover:border-gray-200 transition-all duration-200">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-sparkling-2-fill text-amber-400 text-sm" />
          </div>
          <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">AI Match #{rank} — {rankLabel}</span>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${scoreColor}`}>
          {mentor.matchScore}% match
        </span>
      </div>

      {/* Main content */}
      <div className="p-5">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 flex items-center justify-center shrink-0">
            <img
              src={mentor.photo}
              alt={mentor.name}
              className="w-16 h-16 rounded-xl object-cover object-top"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">{mentor.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {mentor.role} <span className="text-gray-300 mx-1">·</span> {mentor.company}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-star-fill text-amber-400 text-sm" />
                </div>
                <span className="text-sm font-semibold text-gray-800">{mentor.rating}</span>
                <span className="text-xs text-gray-400">({mentor.reviews})</span>
              </div>
            </div>

            {/* Expertise tags */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {mentor.expertise.slice(0, 4).map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Match reasons */}
        <div className="mt-4 flex flex-col gap-1.5">
          {mentor.matchReasons.map((reason) => (
            <div key={reason} className="flex items-center gap-2">
              <div className="w-4 h-4 flex items-center justify-center shrink-0">
                <i className="ri-check-line text-emerald-500 text-sm" />
              </div>
              <span className="text-xs text-gray-500">{reason}</span>
            </div>
          ))}
        </div>

        {/* Expandable bio */}
        {expanded && (
          <p className="mt-3 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
            {mentor.bio}
          </p>
        )}

        {/* Footer row */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-calendar-check-line text-gray-400 text-sm" />
              </div>
              <span className="text-xs text-gray-400">{mentor.sessions} sessions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-time-line text-gray-400 text-sm" />
              </div>
              <span className="text-xs text-gray-400">Responds {mentor.responseTime}</span>
            </div>
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              {expanded ? "Less" : "More info"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">{mentor.sessionRate}</span>
            <button
              type="button"
              onClick={handleSchedule}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer whitespace-nowrap ${
                clicked
                  ? "bg-violet-600 border-violet-600 text-white"
                  : "bg-white border-gray-300 text-gray-700 hover:border-violet-400 hover:text-violet-600"
              }`}
            >
              <div className="w-3.5 h-3.5 flex items-center justify-center">
                <i className="ri-calendar-line text-xs" />
              </div>
              Schedule Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
