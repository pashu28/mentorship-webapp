import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

interface Step {
  label: string;
  path: string;
}

const STEPS: Step[] = [
  { label: "Your Info", path: "/intake" },
  { label: "AI Profile", path: "/profile-summary" },
  { label: "Find Mentor", path: "/smart-match" },
];

interface Props {
  currentStep: 0 | 1 | 2; // 0-indexed
  /** Steps the user has already completed (can navigate to) */
  unlockedUpTo: number;
}

export default function OnboardingNav({ currentStep, unlockedUpTo }: Props) {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const inactiveBubbleBg = isDark ? "var(--bg-elevated)" : "#e5e7eb";
  const inactiveBubbleColor = isDark ? "var(--text-muted)" : "#9ca3af";
  const connectorInactive = isDark ? "var(--border)" : "#e5e7eb";
  const labelMuted = isDark ? "var(--text-muted)" : "#9ca3af";

  return (
    <nav
      className="flex items-center justify-between px-8 py-5 border-b"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "#7C3AED" }}
        >
          <i className="ri-sparkling-2-fill text-white text-sm" />
        </div>
        <span
          className="font-bold tracking-tight text-lg"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--accent)" }}
        >
          GrowthFlow
        </span>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-1">
        {STEPS.map((step, i) => {
          const isCompleted = i < currentStep;
          const isActive = i === currentStep;
          const isClickable = i !== currentStep && i <= unlockedUpTo;

          return (
            <div key={step.path} className="flex items-center gap-1">
              {/* Step bubble */}
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => isClickable && navigate(step.path)}
                  disabled={!isClickable}
                  title={isClickable ? `Go to ${step.label}` : undefined}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap"
                  style={{
                    background: isCompleted || isActive ? "#7C3AED" : inactiveBubbleBg,
                    color: isCompleted || isActive ? "#fff" : inactiveBubbleColor,
                    cursor: isClickable ? "pointer" : "default",
                  }}
                  onMouseEnter={(e) => {
                    if (isClickable)
                      (e.currentTarget as HTMLButtonElement).style.background = "#6D28D9";
                  }}
                  onMouseLeave={(e) => {
                    if (isClickable || isCompleted || isActive)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        isCompleted || isActive ? "#7C3AED" : inactiveBubbleBg;
                  }}
                >
                  {isCompleted ? (
                    <i className="ri-check-line text-sm" />
                  ) : (
                    i + 1
                  )}
                </button>
                <span
                  className="text-[10px] font-medium whitespace-nowrap"
                  style={{
                    color: isActive
                      ? "var(--accent)"
                      : isCompleted
                      ? "var(--accent)"
                      : labelMuted,
                  }}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div
                  className="w-14 h-0.5 rounded-full mb-4 transition-all duration-300"
                  style={{
                    background: i < currentStep ? "#7C3AED" : connectorInactive,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
