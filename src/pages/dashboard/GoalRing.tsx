import { useEffect, useState } from "react";

interface GoalRingProps {
  label: string;
  percentage: number;
  color: string;
  bgColor: string;
  size?: number;
  /** Vibrant stroke color for dark mode (e.g. "#7C3AED") */
  darkColor?: string;
  /** Subtle track color for dark mode (e.g. "rgba(124,58,237,0.18)") */
  darkBgColor?: string;
}

export default function GoalRing({ label, percentage, color, bgColor, size = 100, darkColor, darkBgColor }: GoalRingProps) {
  const [animated, setAnimated] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(percentage), 300);
    return () => clearTimeout(t);
  }, [percentage]);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const trackStroke = isDark && darkBgColor ? undefined : undefined;
  const arcStroke = isDark && darkColor ? undefined : undefined;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Track ring */}
          {isDark && darkBgColor ? (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={10}
              stroke={darkBgColor}
            />
          ) : (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={10}
              className={bgColor}
            />
          )}
          {/* Progress arc */}
          {isDark && darkColor ? (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={10}
              stroke={darkColor}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
            />
          ) : (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={10}
              className={color}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
            />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{percentage}%</span>
        </div>
      </div>
      <span className="text-xs font-medium text-center" style={{ color: "var(--text-muted)" }}>{label}</span>
    </div>
  );
}
