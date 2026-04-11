import { VaultResource, sessionGroups } from "@/mocks/resources";
import ResourceCard from "./ResourceCard";

interface SessionGroupViewProps {
  resources: VaultResource[];
  onToggleStar: (id: string) => void;
}

export default function SessionGroupView({ resources, onToggleStar }: SessionGroupViewProps) {
  const grouped = sessionGroups
    .map((session) => ({
      session,
      items: resources.filter((r) => r.sessionId === session.id),
    }))
    .filter((g) => g.items.length > 0);

  const unlinked = resources.filter((r) => !r.sessionId);

  const totalCount = resources.length;
  const sessionCount = grouped.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Summary */}
      <p className="text-sm text-gray-400">
        {totalCount} resource{totalCount !== 1 ? "s" : ""} saved across {sessionCount} session{sessionCount !== 1 ? "s" : ""}
      </p>

      {grouped.map(({ session, items }) => (
        <div key={session.id}>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">{session.title}</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {items.map((r) => (
              <ResourceCard key={r.id} resource={r} onToggleStar={onToggleStar} view="session" />
            ))}
          </div>
        </div>
      ))}

      {unlinked.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Other Resources</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {unlinked.map((r) => (
              <ResourceCard key={r.id} resource={r} onToggleStar={onToggleStar} view="session" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
