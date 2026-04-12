import { useState, useRef, useEffect } from "react";
import { ResourceFormat, ResourceCategory } from "@/mocks/resources";

type FilterCategory = "All" | ResourceCategory;
type FilterFormat = "All" | ResourceFormat;

interface ResourceFiltersProps {
  activeCategory: FilterCategory;
  activeFormat: FilterFormat;
  onCategoryChange: (c: FilterCategory) => void;
  onFormatChange: (f: FilterFormat) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  starredOnly: boolean;
  onStarredToggle: () => void;
  totalCount: number;
  filteredCount: number;
}

const CATEGORIES: FilterCategory[] = ["All", "Learning", "Portfolio", "Interview", "Research", "Tools"];
const FORMATS: FilterFormat[] = ["All", "PDF", "Doc", "Link", "eBook", "Video"];

const FORMAT_ICONS: Record<string, string> = {
  All:   "ri-apps-line",
  PDF:   "ri-file-pdf-2-line",
  Doc:   "ri-file-text-line",
  Link:  "ri-links-line",
  eBook: "ri-book-open-line",
  Video: "ri-play-circle-line",
};

const CATEGORY_ICONS: Record<string, string> = {
  All:       "ri-apps-line",
  Learning:  "ri-graduation-cap-line",
  Portfolio: "ri-briefcase-line",
  Interview: "ri-question-answer-line",
  Research:  "ri-microscope-line",
  Tools:     "ri-tools-line",
};

interface DropdownProps {
  label: string;
  icon: string;
  value: string;
  options: string[];
  optionIcons?: Record<string, string>;
  onChange: (v: string) => void;
  active: boolean;
}

function FilterDropdown({ label, icon, value, options, optionIcons, onChange, active }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer whitespace-nowrap ${
          active
            ? "bg-violet-50 border-violet-300 text-violet-700"
            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-800"
        }`}
      >
        <div className="w-4 h-4 flex items-center justify-center">
          <i className={`${icon} text-sm`} />
        </div>
        <span>{label}:</span>
        <span className={`font-semibold ${active ? "text-violet-700" : "text-gray-900"}`}>{value}</span>
        <div className="w-4 h-4 flex items-center justify-center">
          <i className={`ri-arrow-down-s-line text-sm transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl py-1.5 z-50 min-w-[160px]"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`flex items-center gap-2.5 w-full px-3.5 py-2 text-sm transition-colors cursor-pointer text-left ${
                value === opt
                  ? "bg-violet-50 text-violet-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {optionIcons && (
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className={`${optionIcons[opt]} text-sm`} />
                </div>
              )}
              <span>{opt}</span>
              {value === opt && (
                <div className="w-4 h-4 flex items-center justify-center ml-auto">
                  <i className="ri-check-line text-sm text-violet-600" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ResourceFilters({
  activeCategory,
  activeFormat,
  onCategoryChange,
  onFormatChange,
  searchQuery,
  onSearchChange,
  starredOnly,
  onStarredToggle,
  totalCount,
  filteredCount,
}: ResourceFiltersProps) {
  const hasActiveFilters =
    activeCategory !== "All" || activeFormat !== "All" || starredOnly || !!searchQuery;

  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      {/* Search */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
          <i className="ri-search-line text-gray-400 text-sm" />
        </div>
        <input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-8 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all w-56"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <i className="ri-close-line text-sm" />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200" />

      {/* Category dropdown */}
      <FilterDropdown
        label="Category"
        icon={CATEGORY_ICONS[activeCategory]}
        value={activeCategory}
        options={CATEGORIES}
        optionIcons={CATEGORY_ICONS}
        onChange={(v) => onCategoryChange(v as FilterCategory)}
        active={activeCategory !== "All"}
      />

      {/* Format dropdown */}
      <FilterDropdown
        label="Format"
        icon={FORMAT_ICONS[activeFormat]}
        value={activeFormat}
        options={FORMATS}
        optionIcons={FORMAT_ICONS}
        onChange={(v) => onFormatChange(v as FilterFormat)}
        active={activeFormat !== "All"}
      />

      {/* Starred toggle */}
      <button
        type="button"
        onClick={onStarredToggle}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer whitespace-nowrap ${
          starredOnly
            ? "bg-amber-50 border-amber-300 text-amber-600"
            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-800"
        }`}
      >
        <div className="w-4 h-4 flex items-center justify-center">
          <i className={`${starredOnly ? "ri-star-fill" : "ri-star-line"} text-sm`} />
        </div>
        Starred
      </button>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => {
            onCategoryChange("All");
            onFormatChange("All");
            onSearchChange("");
            if (starredOnly) onStarredToggle();
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer whitespace-nowrap"
        >
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-close-circle-line text-sm" />
          </div>
          Clear
        </button>
      )}

      {/* Count */}
      <span className="text-xs text-gray-400 whitespace-nowrap ml-auto">
        {filteredCount} of {totalCount} resources
      </span>
    </div>
  );
}
