import { useState, useMemo } from "react";
import AppLayout from "@/components/feature/AppLayout";
import { aiMatchedMentors, otherMentors, domainOptions, roleOptions, expertiseOptions } from "@/mocks/mentors";
import AIMatchCard from "./components/AIMatchCard";
import MentorCard from "./components/MentorCard";
import MentorSearchBar from "./components/MentorSearchBar";
import BookingModal from "@/pages/smart-match/BookingModal";

interface Filters {
  search: string;
  domain: string;
  role: string;
  expertise: string;
}

const defaultFilters: Filters = {
  search: "",
  domain: domainOptions[0],
  role: roleOptions[0],
  expertise: expertiseOptions[0],
};

function matchesMentor(mentor: { name: string; role: string; company: string; domain: string; expertise: string[] }, filters: Filters) {
  const q = filters.search.toLowerCase();
  const matchSearch =
    !q ||
    mentor.name.toLowerCase().includes(q) ||
    mentor.role.toLowerCase().includes(q) ||
    mentor.company.toLowerCase().includes(q) ||
    mentor.domain.toLowerCase().includes(q) ||
    mentor.expertise.some((e) => e.toLowerCase().includes(q));

  const matchDomain = filters.domain === domainOptions[0] || mentor.domain === filters.domain;

  const matchRole =
    filters.role === roleOptions[0] ||
    mentor.role.toLowerCase().includes(filters.role.toLowerCase().replace("all roles", "").trim());

  const matchExpertise =
    filters.expertise === expertiseOptions[0] ||
    mentor.expertise.some((e) => e.toLowerCase().includes(filters.expertise.toLowerCase()));

  return matchSearch && matchDomain && matchRole && matchExpertise;
}

export default function FindMentorPage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [schedulingMentor, setSchedulingMentor] = useState<(typeof aiMatchedMentors)[0] | null>(null);

  const filteredAI = useMemo(() => aiMatchedMentors.filter((m) => matchesMentor(m, filters)), [filters]);
  const filteredOthers = useMemo(() => otherMentors.filter((m) => matchesMentor(m, filters)), [filters]);

  const totalCount = aiMatchedMentors.length + otherMentors.length;
  const filteredCount = filteredAI.length + filteredOthers.length;

  const hasFilters =
    filters.search !== "" ||
    filters.domain !== domainOptions[0] ||
    filters.role !== roleOptions[0] ||
    filters.expertise !== expertiseOptions[0];

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#F8F8FA] dark:bg-zinc-950">
        {/* Header */}
        <div className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 px-6 py-6">
          <div className="max-w-5xl mx-auto w-full">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-user-search-fill text-gray-700 text-base" />
                  </div>
                  <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Find Mentor</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Mentor Directory</h1>
                <p className="text-sm text-gray-400 mt-1">AI-matched mentors based on your goals, domain, and learning style.</p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 shrink-0">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{totalCount}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Total Mentors</p>
                </div>
                <div className="w-px h-8 bg-gray-100" />
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">3</p>
                  <p className="text-xs text-gray-400 mt-0.5">AI Matched</p>
                </div>
                <div className="w-px h-8 bg-gray-100" />
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">6</p>
                  <p className="text-xs text-gray-400 mt-0.5">Domains</p>
                </div>
              </div>
            </div>

            {/* Search + Filters */}
            <div className="mt-5">
              <MentorSearchBar
                filters={filters}
                onChange={setFilters}
                totalCount={totalCount}
                filteredCount={filteredCount}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8 max-w-5xl mx-auto w-full">
          {filteredCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gray-100">
                <i className="ri-user-search-line text-gray-400 text-2xl" />
              </div>
              <p className="text-sm font-semibold text-gray-700">No mentors found</p>
              <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
              <button
                type="button"
                onClick={() => setFilters(defaultFilters)}
                className="mt-2 px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all cursor-pointer whitespace-nowrap"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {/* AI Matched Section */}
              {filteredAI.length > 0 && (
                <section className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-sparkling-2-fill text-amber-400 text-base" />
                    </div>
                    <h2 className="text-sm font-bold text-gray-800">AI-Matched for You</h2>
                    <span className="text-xs text-gray-400 ml-1">Based on your profile, goals &amp; learning style</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {filteredAI.map((mentor, i) => (
                      <AIMatchCard
                        key={mentor.id}
                        mentor={mentor}
                        rank={i + 1}
                        onSchedule={(m) => setSchedulingMentor(m as typeof aiMatchedMentors[0])}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Other Mentors Section */}
              {filteredOthers.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-group-line text-gray-500 text-base" />
                    </div>
                    <h2 className="text-sm font-bold text-gray-800">
                      {hasFilters ? "Matching Mentors" : "All Mentors"}
                    </h2>
                    <span className="text-xs text-gray-400 ml-1">Ranked by compatibility score</span>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {filteredOthers.map((mentor, i) => (
                      <MentorCard
                        key={mentor.id}
                        mentor={mentor}
                        rank={i + 1}
                        onSchedule={(m) => setSchedulingMentor(m as typeof aiMatchedMentors[0])}
                      />
                    ))}
                  </div>
                </section>
              )}

              {filteredAI.length > 0 && filteredOthers.length === 0 && hasFilters && (
                <p className="text-xs text-gray-400 mt-2">No other mentors match your current filters.</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {schedulingMentor && (
        <BookingModal
          mentor={schedulingMentor}
          onClose={() => setSchedulingMentor(null)}
          onConfirm={() => setSchedulingMentor(null)}
        />
      )}
    </AppLayout>
  );
}
