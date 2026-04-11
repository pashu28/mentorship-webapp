import { useState, useRef, useEffect } from "react";
import { domainOptions, roleOptions, expertiseOptions } from "@/mocks/mentors";

interface Filters {
  search: string;
  domain: string;
  role: string;
  expertise: string;
}

interface MentorSearchBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  totalCount: number;
  filteredCount: number;
}

function DropdownSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = value !== options[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
          isActive
            ? "border-gray-900 bg-gray-900 text-white"
            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
        }`}
      >
        <span>{isActive ? value : label}</span>
        <div className="w-4 h-4 flex items-center justify-center">
          <i className={`ri-arrow-down-s-line text-sm transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-sm z-20 min-w-[180px] py-1 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer whitespace-nowrap flex items-center justify-between gap-3 ${
                value === opt ? "text-gray-900 font-semibold bg-gray-50" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {opt}
              {value === opt && (
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-check-line text-gray-900 text-sm" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MentorSearchBar({ filters, onChange, totalCount, filteredCount }: MentorSearchBarProps) {
  const hasActiveFilters =
    filters.search !== "" ||
    filters.domain !== domainOptions[0] ||
    filters.role !== roleOptions[0] ||
    filters.expertise !== expertiseOptions[0];

  const clearAll = () =>
    onChange({ search: "", domain: domainOptions[0], role: roleOptions[0], expertise: expertiseOptions[0] });

  return (
    <div className="flex flex-col gap-3">
      {/* Search input */}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
          <i className="ri-search-line text-gray-400 text-sm" />
        </div>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search by name, role, company, or expertise..."
          className="w-full pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => onChange({ ...filters, search: "" })}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <i className="ri-close-line text-sm" />
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-2 flex-wrap">
        <DropdownSelect
          label="Domain"
          value={filters.domain}
          options={domainOptions}
          onChange={(v) => onChange({ ...filters, domain: v })}
        />
        <DropdownSelect
          label="Role"
          value={filters.role}
          options={roleOptions}
          onChange={(v) => onChange({ ...filters, role: v })}
        />
        <DropdownSelect
          label="Expertise"
          value={filters.expertise}
          options={expertiseOptions}
          onChange={(v) => onChange({ ...filters, expertise: v })}
        />

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all cursor-pointer whitespace-nowrap"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-close-circle-line text-sm" />
            </div>
            Clear
          </button>
        )}

        <div className="ml-auto text-xs text-gray-400 whitespace-nowrap">
          {filteredCount === totalCount
            ? `${totalCount} mentors`
            : `${filteredCount} of ${totalCount} mentors`}
        </div>
      </div>
    </div>
  );
}
