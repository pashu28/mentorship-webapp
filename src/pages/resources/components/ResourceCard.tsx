import { VaultResource, ResourceFormat, ResourceCategory } from "@/mocks/resources";

interface ResourceCardProps { resource: VaultResource; onToggleStar: (id: string) => void; view: "list" | "session"; }

/* ─── Light-theme values (unchanged) + dark-theme overrides via CSS vars ─── */
const FORMAT_CONFIG: Record<ResourceFormat, {
  icon: string;
  lightBg: string; lightColor: string; lightBorder: string;
  darkBg: string;  darkColor: string;  darkBorder: string;
}> = {
  PDF:   { icon: "ri-file-pdf-2-line",   lightBg: "#fee2e2", lightColor: "#e11d48", lightBorder: "#fecdd3", darkBg: "rgba(244,63,94,0.15)",  darkColor: "#fb7185", darkBorder: "rgba(244,63,94,0.3)" },
  Doc:   { icon: "ri-file-text-line",    lightBg: "#e0f2fe", lightColor: "#0284c7", lightBorder: "#bae6fd", darkBg: "rgba(14,165,233,0.15)", darkColor: "#38bdf8", darkBorder: "rgba(14,165,233,0.3)" },
  Link:  { icon: "ri-links-line",        lightBg: "#ede9fe", lightColor: "#7c3aed", lightBorder: "#ddd6fe", darkBg: "rgba(124,58,237,0.2)",  darkColor: "#a78bfa", darkBorder: "rgba(124,58,237,0.35)" },
  eBook: { icon: "ri-book-open-line",    lightBg: "#fef3c7", lightColor: "#d97706", lightBorder: "#fde68a", darkBg: "rgba(245,158,11,0.15)", darkColor: "#fbbf24", darkBorder: "rgba(245,158,11,0.3)" },
  Video: { icon: "ri-play-circle-line",  lightBg: "#d1fae5", lightColor: "#059669", lightBorder: "#a7f3d0", darkBg: "rgba(16,185,129,0.15)", darkColor: "#34d399", darkBorder: "rgba(16,185,129,0.3)" },
};

const CATEGORY_CONFIG: Record<ResourceCategory, {
  lightBg: string; lightColor: string; lightBorder: string;
  darkBg: string;  darkColor: string;  darkBorder: string;
}> = {
  Learning:  { lightBg: "#ede9fe", lightColor: "#6d28d9", lightBorder: "#ddd6fe", darkBg: "rgba(124,58,237,0.2)",  darkColor: "#c4b5fd", darkBorder: "rgba(124,58,237,0.35)" },
  Portfolio: { lightBg: "#e0f2fe", lightColor: "#0369a1", lightBorder: "#bae6fd", darkBg: "rgba(14,165,233,0.15)", darkColor: "#7dd3fc", darkBorder: "rgba(14,165,233,0.3)" },
  Interview: { lightBg: "#fef3c7", lightColor: "#b45309", lightBorder: "#fde68a", darkBg: "rgba(245,158,11,0.15)", darkColor: "#fcd34d", darkBorder: "rgba(245,158,11,0.3)" },
  Research:  { lightBg: "#d1fae5", lightColor: "#047857", lightBorder: "#a7f3d0", darkBg: "rgba(16,185,129,0.15)", darkColor: "#6ee7b7", darkBorder: "rgba(16,185,129,0.3)" },
  Tools:     { lightBg: "#fee2e2", lightColor: "#be123c", lightBorder: "#fecdd3", darkBg: "rgba(244,63,94,0.15)",  darkColor: "#fda4af", darkBorder: "rgba(244,63,94,0.3)" },
};

function useIsDark() {
  return document.documentElement.classList.contains("dark");
}

function FormatIcon({ format }: { format: ResourceFormat }) {
  const cfg = FORMAT_CONFIG[format];
  const dark = useIsDark();
  return (
    <div
      className="w-10 h-10 flex items-center justify-center rounded-xl shrink-0"
      style={{ backgroundColor: dark ? cfg.darkBg : cfg.lightBg }}
    >
      <i className={`${cfg.icon} text-lg`} style={{ color: dark ? cfg.darkColor : cfg.lightColor }} />
    </div>
  );
}

function FormatIconSmall({ format }: { format: ResourceFormat }) {
  const cfg = FORMAT_CONFIG[format];
  const dark = useIsDark();
  return (
    <div
      className="w-9 h-9 flex items-center justify-center rounded-lg shrink-0"
      style={{ backgroundColor: dark ? cfg.darkBg : cfg.lightBg }}
    >
      <i className={`${cfg.icon} text-base`} style={{ color: dark ? cfg.darkColor : cfg.lightColor }} />
    </div>
  );
}

function CategoryTag({ category }: { category: ResourceCategory }) {
  const cfg = CATEGORY_CONFIG[category];
  const dark = useIsDark();
  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded-full border"
      style={{
        backgroundColor: dark ? cfg.darkBg : cfg.lightBg,
        color: dark ? cfg.darkColor : cfg.lightColor,
        borderColor: dark ? cfg.darkBorder : cfg.lightBorder,
      }}
    >
      {category}
    </span>
  );
}

function FormatTag({ format }: { format: ResourceFormat }) {
  const cfg = FORMAT_CONFIG[format];
  const dark = useIsDark();
  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded-full border"
      style={{
        backgroundColor: dark ? cfg.darkBg : cfg.lightBg,
        color: dark ? cfg.darkColor : cfg.lightColor,
        borderColor: dark ? cfg.darkBorder : cfg.lightBorder,
      }}
    >
      {format}
    </span>
  );
}

export default function ResourceCard({ resource, onToggleStar, view }: ResourceCardProps) {
  if (view === "session") {
    return (
      <div
        className="flex items-start gap-3 p-4 rounded-xl border transition-all group"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}
      >
        <FormatIconSmall format={resource.format} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{resource.title}</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{resource.domain}</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{resource.sharedDate}</p>
        </div>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-all cursor-pointer opacity-0 group-hover:opacity-100"
          style={{ color: "var(--text-muted)" }}
        >
          <i className="ri-external-link-line text-sm" />
        </a>
      </div>
    );
  }

  return (
    <div
      className="flex items-start gap-4 px-5 py-4 rounded-2xl border transition-all group"
      style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}
    >
      {/* Format icon */}
      <FormatIcon format={resource.format} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{resource.title}</span>
          <CategoryTag category={resource.category} />
        </div>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{resource.domain}</p>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {resource.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
              <i className="ri-price-tag-3-line text-xs" />
              {tag}
            </span>
          ))}
          <span className="ml-auto text-xs whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
            Shared by {resource.sharedBy} &middot; {resource.sharedDate}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onToggleStar(resource.id)}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer"
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-elevated)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")}
        >
          <i
            className={`${resource.starred ? "ri-star-fill" : "ri-star-line"} text-base`}
            style={{ color: resource.starred ? "var(--warning)" : "var(--text-muted)" }}
          />
        </button>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--bg-elevated)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent")}
        >
          <i className="ri-external-link-line text-base" />
        </a>
      </div>
    </div>
  );
}
