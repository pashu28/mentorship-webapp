import { useState, useMemo } from "react";
import AppLayout from "@/components/feature/AppLayout";
import { aiMatchedMentors, otherMentors, domainOptions, roleOptions, expertiseOptions } from "@/mocks/mentors";
import AIMatchCard from "./components/AIMatchCard";
import MentorCard from "./components/MentorCard";
import MentorSearchBar from "./components/MentorSearchBar";
import BookingModal from "@/pages/smart-match/BookingModal";

interface Filters { search: string; domain: string; role: string; expertise: string; }
const defaultFilters: Filters = { search: "", domain: domainOptions[0], role: roleOptions[0], expertise: expertiseOptions[0] };

function matchesMentor(mentor: { name: string; role: string; company: string; domain: string; expertise: string[] }, filters: Filters) {
  const q = filters.search.toLowerCase();
  const matchSearch = !q || mentor.name.toLowerCase().includes(q) || mentor.role.toLowerCase().includes(q) || mentor.company.toLowerCase().includes(q) || mentor.domain.toLowerCase().includes(q) || mentor.expertise.some((e) => e.toLowerCase().includes(q));
  const matchDomain = filters.domain === domainOptions[0] || mentor.domain === filters.domain;
  const matchRole = filters.role === roleOptions[0] || mentor.role.toLowerCase().includes(filters.role.toLowerCase().replace("all roles", "").trim());
  const matchExpertise = filters.expertise === expertiseOptions[0] || mentor.expertise.some((e) => e.toLowerCase().includes(filters.expertise.toLowerCase()));
  return matchSearch && matchDomain && matchRole && matchExpertise;
}

export default function FindMentorPage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [schedulingMentor, setSchedulingMentor] = useState<(typeof aiMatchedMentors)[0] | null>(null);

  const filteredAI = useMemo(() => aiMatchedMentors.filter((m) => matchesMentor(m, filters)), [filters]);
  const filteredOthers = useMemo(() => otherMentors.filter((m) => matchesMentor(m, filters)), [filters]);
  const totalCount = aiMatchedMentors.length + otherMentors.length;
  const filteredCount = filteredAI.length + filteredOthers.length;
  const hasFilters = filters.search !== "" || filters.domain !== domainOptions[0] || filters.role !== roleOptions[0] || filters.expertise !== expertiseOptions[0];

  return (
    <AppLayout>
      <div className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
        <div className="px-6 pt-8 pb-8 max-w-5xl mx-auto w-full flex flex-col gap-6">

          {/* Header */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Mentor Directory</h1>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>AI-matched mentors based on your goals, domain, and learning style.</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              {[
                { value: totalCount, label: "Total",      color: "var(--text-primary)" },
                { value: 3,          label: "AI Matched", color: "var(--warning)" },
                { value: 6,          label: "Domains",    color: "var(--accent)" },
              ].map((stat, i) => (
                <>
                  {i > 0 && <div key={`div-${i}`} className="w-px h-8" style={{ backgroundColor: "var(--border)" }} />}
                  <div key={stat.label} className="text-center">
                    <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
                  </div>
                </>
              ))}
            </div>
          </div>

          <MentorSearchBar filters={filters} onChange={setFilters} totalCount={totalCount} filteredCount={filteredCount} />

          {filteredCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl" style={{ backgroundColor: "var(--bg-elevated)" }}>
                <i className="ri-user-search-line text-2xl" style={{ color: "var(--text-muted)" }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>No mentors found</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Try adjusting your search or filters</p>
              <button type="button" onClick={() => setFilters(defaultFilters)}
                className="mt-2 px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap"
                style={{ backgroundColor: "var(--accent-light)", color: "var(--accent-text)" }}>
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredAI.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-sparkling-2-fill text-base" style={{ color: "var(--warning)" }} />
                    </div>
                    <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>AI-Matched for You</h2>
                    <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>Based on your profile, goals &amp; learning style</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {filteredAI.map((mentor, i) => (
                      <AIMatchCard key={mentor.id} mentor={mentor} rank={i + 1}
                        onSchedule={(m) => setSchedulingMentor(m as typeof aiMatchedMentors[0])} />
                    ))}
                  </div>
                </section>
              )}

              {filteredOthers.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-group-line text-base" style={{ color: "var(--text-muted)" }} />
                    </div>
                    <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                      {hasFilters ? "Matching Mentors" : "All Mentors"}
                    </h2>
                    <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>Ranked by compatibility score</span>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {filteredOthers.map((mentor, i) => (
                      <MentorCard key={mentor.id} mentor={mentor} rank={i + 1}
                        onSchedule={(m) => setSchedulingMentor(m as typeof aiMatchedMentors[0])} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>

      {schedulingMentor && (
        <BookingModal mentor={schedulingMentor} onClose={() => setSchedulingMentor(null)} onConfirm={() => setSchedulingMentor(null)} />
      )}
    </AppLayout>
  );
}
