import { useState, useMemo } from "react";
import AppLayout from "@/components/feature/AppLayout";
import { vaultResources, VaultResource, ResourceFormat, ResourceCategory } from "@/mocks/resources";
import ResourceCard from "./components/ResourceCard";
import ResourceFilters from "./components/ResourceFilters";

type FilterCategory = "All" | ResourceCategory;
type FilterFormat = "All" | ResourceFormat;

export default function ResourcesPage() {
  const [resources, setResources] = useState<VaultResource[]>(vaultResources);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All");
  const [activeFormat, setActiveFormat] = useState<FilterFormat>("All");
  const [starredOnly, setStarredOnly] = useState(false);

  const handleToggleStar = (id: string) => {
    setResources((prev) => prev.map((r) => (r.id === id ? { ...r, starred: !r.starred } : r)));
  };

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || r.title.toLowerCase().includes(q) || r.domain.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q)) || r.sharedBy.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
      const matchesCategory = activeCategory === "All" || r.category === activeCategory;
      const matchesFormat = activeFormat === "All" || r.format === activeFormat;
      const matchesStarred = !starredOnly || r.starred;
      return matchesSearch && matchesCategory && matchesFormat && matchesStarred;
    });
  }, [resources, searchQuery, activeCategory, activeFormat, starredOnly]);

  const starredCount = resources.filter((r) => r.starred).length;

  return (
    <AppLayout>
      <div className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
        <div className="px-6 pt-8 pb-8 max-w-5xl mx-auto w-full flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Saved Resources</h1>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>All links and materials shared by your mentors, in one place.</p>
            </div>
            <div className="flex items-center gap-4">
              {[
                { value: resources.length, label: "Total",    color: "var(--text-primary)" },
                { value: starredCount,     label: "Starred",  color: "var(--warning)" },
                { value: 5,                label: "Sessions", color: "var(--accent)" },
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

          <ResourceFilters
            activeCategory={activeCategory} activeFormat={activeFormat}
            onCategoryChange={setActiveCategory} onFormatChange={setActiveFormat}
            searchQuery={searchQuery} onSearchChange={setSearchQuery}
            starredOnly={starredOnly} onStarredToggle={() => setStarredOnly((v) => !v)}
            totalCount={resources.length} filteredCount={filtered.length}
          />

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl" style={{ backgroundColor: "var(--bg-elevated)" }}>
                <i className="ri-search-line text-2xl" style={{ color: "var(--text-muted)" }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>No resources found</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Try adjusting your search or filters</p>
              <button type="button" onClick={() => { setSearchQuery(""); setActiveCategory("All"); setActiveFormat("All"); setStarredOnly(false); }}
                className="mt-2 px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer"
                style={{ backgroundColor: "var(--accent-light)", color: "var(--accent-text)" }}>
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((r) => (
                <ResourceCard key={r.id} resource={r} onToggleStar={handleToggleStar} view="list" />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
