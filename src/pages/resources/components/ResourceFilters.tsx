import { useState, useRef, useEffect } from "react";
import { ResourceFormat, ResourceCategory } from "@/mocks/resources";

type FilterCategory = "All" | ResourceCategory;
type FilterFormat = "All" | ResourceFormat;

interface ResourceFiltersProps {
  activeCategory: FilterCategory; activeFormat: FilterFormat;
  onCategoryChange: (c: FilterCategory) => void; onFormatChange: (f: FilterFormat) => void;
  searchQuery: string; onSearchChange: (q: string) => void;
  starredOnly: boolean; onStarredToggle: () => void;
  totalCount: number; filteredCount: number;
}

const CATEGORIES: FilterCategory[] = ["All", "Learning", "Portfolio", "Interview", "Research", "Tools"];
const FORMATS: FilterFormat[] = ["All", "PDF", "Doc", "Link", "eBook", "Video"];
const FORMAT_ICONS: Record<string, string> = { All: "ri-apps-line", PDF: "ri-file-pdf-2-line", Doc: "ri-file-text-line", Link: "ri-links-line", eBook: "ri-book-open-line", Video: "ri-play-circle-line" };
const CATEGORY_ICONS: Record<string, string> = { All: "ri-apps-line", Learning: "ri-graduation-cap-line", Portfolio: "ri-briefcase-line", Interview: "ri-question-answer-line", Research: "ri-microscope-line", Tools: "ri-tools-line" };

interface DropdownProps { label: string; icon: string; value: string; options: string[]; optionIcons?: Record<string, string>; onChange: (v: string) => void; active: boolean; }

function FilterDropdown({ label, icon, value, options, optionIcons, onChange, active }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer whitespace-nowrap"
        style={{
          backgroundColor: active ? "var(--accent-light)" : "var(--bg-surface)",
          borderColor: active ? "var(--accent-light)" : "var(--border)",
          color: active ? "var(--accent-text)" : "var(--text-secondary)",
        }}>
        <i className={`${icon} text-sm`} />
        <span>{label}:</span>
        <span style={{ fontWeight: 600 }}>{value}</span>
        <i className={`ri-arrow-down-s-line text-sm transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 border rounded-xl py-1.5 z-50 min-w-[160px]"
          style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
          {options.map((opt) => (
            <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm transition-colors cursor-pointer text-left"
              style={{ color: value === opt ? "var(--accent-text)" : "var(--text-muted)", fontWeight: value === opt ? 600 : 400 }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-elevated)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")}>
              {optionIcons && <i className={`${optionIcons[opt]} text-sm`} />}
              <span>{opt}</span>
              {value === opt && <i className="ri-check-line text-sm ml-auto" style={{ color: "var(--accent)" }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ResourceFilters({ activeCategory, activeFormat, onCategoryChange, onFormatChange, searchQuery, onSearchChange, starredOnly, onStarredToggle, totalCount, filteredCount }: ResourceFiltersProps) {
  const hasActiveFilters = activeCategory !== "All" || activeFormat !== "All" || starredOnly || !!searchQuery;

  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
          <i className="ri-search-line text-sm" style={{ color: "var(--text-muted)" }} />
        </div>
        <input type="text" placeholder="Search resources..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-8 py-2 text-sm border rounded-xl focus:outline-none transition-all w-56"
          style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
        {searchQuery && (
          <button type="button" onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center cursor-pointer"
            style={{ color: "var(--text-muted)" }}>
            <i className="ri-close-line text-sm" />
          </button>
        )}
      </div>

      <div className="w-px h-6" style={{ backgroundColor: "var(--border)" }} />

      <FilterDropdown label="Category" icon={CATEGORY_ICONS[activeCategory]} value={activeCategory} options={CATEGORIES} optionIcons={CATEGORY_ICONS} onChange={(v) => onCategoryChange(v as FilterCategory)} active={activeCategory !== "All"} />
      <FilterDropdown label="Format"   icon={FORMAT_ICONS[activeFormat]}    value={activeFormat}    options={FORMATS}     optionIcons={FORMAT_ICONS}    onChange={(v) => onFormatChange(v as FilterFormat)}   active={activeFormat !== "All"} />

      <button type="button" onClick={onStarredToggle}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer whitespace-nowrap"
        style={{
          backgroundColor: starredOnly ? "var(--warning-light)" : "var(--bg-surface)",
          borderColor: starredOnly ? "var(--warning-light)" : "var(--border)",
          color: starredOnly ? "var(--warning)" : "var(--text-secondary)",
        }}>
        <i className={`${starredOnly ? "ri-star-fill" : "ri-star-line"} text-sm`} />
        Starred
      </button>

      {hasActiveFilters && (
        <button type="button" onClick={() => { onCategoryChange("All"); onFormatChange("All"); onSearchChange(""); if (starredOnly) onStarredToggle(); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all cursor-pointer whitespace-nowrap"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-elevated)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")}>
          <i className="ri-close-circle-line text-sm" />
          Clear
        </button>
      )}

      <span className="text-xs whitespace-nowrap ml-auto" style={{ color: "var(--text-muted)" }}>
        {filteredCount} of {totalCount} resources
      </span>
    </div>
  );
}
