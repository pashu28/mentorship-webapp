import { VaultResource, ResourceFormat } from "@/mocks/resources";

interface ResourceCardProps {
  resource: VaultResource;
  onToggleStar: (id: string) => void;
  view: "list" | "session";
}

const FORMAT_CONFIG: Record<ResourceFormat, { icon: string; color: string; bg: string }> = {
  PDF:   { icon: "ri-file-pdf-2-line",   color: "text-violet-600", bg: "bg-violet-50" },
  Doc:   { icon: "ri-file-text-line",    color: "text-violet-600", bg: "bg-violet-50" },
  Link:  { icon: "ri-links-line",        color: "text-violet-500", bg: "bg-violet-50" },
  eBook: { icon: "ri-book-open-line",    color: "text-violet-600", bg: "bg-violet-50" },
  Video: { icon: "ri-play-circle-line",  color: "text-violet-500", bg: "bg-violet-50" },
};

const CATEGORY_COLORS: Record<string, string> = {
  Learning:  "bg-violet-50 text-violet-700 border border-violet-200",
  Portfolio: "bg-sky-50 text-sky-700 border border-sky-200",
  Interview: "bg-amber-50 text-amber-700 border border-amber-200",
  Research:  "bg-teal-50 text-teal-700 border border-teal-200",
  Tools:     "bg-gray-100 text-gray-600 border border-gray-200",
};

export default function ResourceCard({ resource, onToggleStar, view }: ResourceCardProps) {
  const fmt = FORMAT_CONFIG[resource.format];

  if (view === "session") {
    return (
      <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all group">
        <div className={`w-9 h-9 flex items-center justify-center rounded-lg shrink-0 ${fmt.bg}`}>
          <i className={`${fmt.icon} ${fmt.color} text-base`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{resource.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{resource.domain}</p>
          <p className="text-xs text-gray-400 mt-0.5">{resource.sharedDate}</p>
        </div>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-50 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
        >
          <i className="ri-external-link-line text-sm" />
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 px-5 py-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-all group">
      {/* Format icon */}
      <div className={`w-10 h-10 flex items-center justify-center rounded-xl shrink-0 ${fmt.bg}`}>
        <i className={`${fmt.icon} ${fmt.color} text-lg`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-900">{resource.title}</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[resource.category] ?? "bg-gray-100 text-gray-600"}`}>
            {resource.category}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{resource.domain}</p>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {resource.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 text-xs text-gray-400">
              <i className="ri-price-tag-3-line text-xs" />
              {tag}
            </span>
          ))}
          <span className="ml-auto text-xs text-gray-400 whitespace-nowrap">
            Shared by {resource.sharedBy} &middot; {resource.sharedDate}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onToggleStar(resource.id)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
        >
          <i className={`${resource.starred ? "ri-star-fill text-amber-400" : "ri-star-line text-gray-300 group-hover:text-gray-400"} text-base`} />
        </button>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
        >
          <i className="ri-external-link-line text-base" />
        </a>
      </div>
    </div>
  );
}
