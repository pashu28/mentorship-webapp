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
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, starred: !r.starred } : r))
    );
  };

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.domain.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)) ||
        r.sharedBy.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q);

      const matchesCategory = activeCategory === "All" || r.category === activeCategory;
      const matchesFormat = activeFormat === "All" || r.format === activeFormat;
      const matchesStarred = !starredOnly || r.starred;

      return matchesSearch && matchesCategory && matchesFormat && matchesStarred;
    });
  }, [resources, searchQuery, activeCategory, activeFormat, starredOnly]);

  const starredCount = resources.filter((r) => r.starred).length;

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#F8F8FA] dark:bg-zinc-950">
        {/* Header */}
        <div className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-archive-drawer-line text-violet-500 text-base" />
                </div>
                <span className="text-xs font-semibold text-violet-500 uppercase tracking-widest">Resource Vault</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Saved Resources</h1>
              <p className="text-sm text-gray-400 mt-1">All links and materials shared by your mentors, in one place.</p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{resources.length}</p>
                <p className="text-xs text-gray-400">Total</p>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div className="text-center">
                <p className="text-xl font-bold text-amber-500">{starredCount}</p>
                <p className="text-xs text-gray-400">Starred</p>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div className="text-center">
                <p className="text-xl font-bold text-violet-600">5</p>
                <p className="text-xs text-gray-400">Sessions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6 flex flex-col gap-6">
          {/* Filters */}
          <ResourceFilters
            activeCategory={activeCategory}
            activeFormat={activeFormat}
            onCategoryChange={setActiveCategory}
            onFormatChange={setActiveFormat}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            starredOnly={starredOnly}
            onStarredToggle={() => setStarredOnly((v) => !v)}
            totalCount={resources.length}
            filteredCount={filtered.length}
          />

          {/* Content */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gray-100">
                <i className="ri-search-line text-gray-400 text-2xl" />
              </div>
              <p className="text-sm font-semibold text-gray-700">No resources found</p>
              <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                  setActiveFormat("All");
                  setStarredOnly(false);
                }}
                className="mt-2 px-4 py-2 text-xs font-medium text-violet-600 bg-violet-50 rounded-lg hover:bg-violet-100 transition-all cursor-pointer"
              >
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
