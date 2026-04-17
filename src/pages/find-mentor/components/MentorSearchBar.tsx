import { useState, useRef, useEffect } from "react";
import { domainOptions, roleOptions, expertiseOptions } from "@/mocks/mentors";

interface Filters { search: string; domain: string; role: string; expertise: string; }
interface MentorSearchBarProps { filters: Filters; onChange: (f: Filters) => void; totalCount: number; filteredCount: number; }

function DropdownSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void; }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = value !== options[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all cursor-pointer whitespace-nowrap"
        style={{
          backgroundColor: isActive ? "var(--accent)" : "var(--bg-surface)",
          borderColor: isActive ? "var(--accent)" : "var(--border)",
          color: isActive ? "#fff" : "var(--text-secondary)",
        }}>
        <span>{isActive ? value : label}</span>
        <i className={`ri-arrow-down-s-line text-sm transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 border rounded-xl z-20 min-w-[180px] py-1 overflow-hidden"
          style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
          {options.map((opt) => (
            <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer whitespace-nowrap flex items-center justify-between gap-3"
              style={{ color: value === opt ? "var(--text-primary)" : "var(--text-muted)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-elevated)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")}>
              <span style={{ fontWeight: value === opt ? 600 : 400 }}>{opt}</span>
              {value === opt && <i className="ri-check-line text-sm" style={{ color: "var(--accent)" }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MentorSearchBar({ filters, onChange, totalCount, filteredCount }: MentorSearchBarProps) {
  const hasActiveFilters = filters.search !== "" || filters.domain !== domainOptions[0] || filters.role !== roleOptions[0] || filters.expertise !== expertiseOptions[0];
  const clearAll = () => onChange({ search: "", domain: domainOptions[0], role: roleOptions[0], expertise: expertiseOptions[0] });

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
          <i className="ri-search-line text-sm" style={{ color: "var(--text-muted)" }} />
        </div>
        <input type="text" value={filters.search} onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search by name, role, company, or expertise..."
          className="w-full pl-9 pr-9 py-2.5 border rounded-xl text-sm focus:outline-none transition-colors"
          style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
        {filters.search && (
          <button type="button" onClick={() => onChange({ ...filters, search: "" })}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center cursor-pointer"
            style={{ color: "var(--text-muted)" }}>
            <i className="ri-close-line text-sm" />
          </button>
        )}
      </div>

      <div className="w-px h-6 shrink-0" style={{ backgroundColor: "var(--border)" }} />

      <DropdownSelect label="Domain"    value={filters.domain}    options={domainOptions}    onChange={(v) => onChange({ ...filters, domain: v })} />
      <DropdownSelect label="Role"      value={filters.role}      options={roleOptions}      onChange={(v) => onChange({ ...filters, role: v })} />
      <DropdownSelect label="Expertise" value={filters.expertise} options={expertiseOptions} onChange={(v) => onChange({ ...filters, expertise: v })} />

      {hasActiveFilters && (
        <button type="button" onClick={clearAll}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-all cursor-pointer whitespace-nowrap"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)", backgroundColor: "transparent" }}>
          <i className="ri-close-circle-line text-sm" />
          Clear
        </button>
      )}

      <div className="text-xs whitespace-nowrap shrink-0" style={{ color: "var(--text-muted)" }}>
        {filteredCount === totalCount ? `${totalCount} mentors` : `${filteredCount} of ${totalCount} mentors`}
      </div>
    </div>
  );
}
