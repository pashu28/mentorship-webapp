import { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "Light" | "Dark" | "System";

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "Light",
  setTheme: () => {},
  isDark: false,
});

function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === "Dark") return true;
  if (mode === "Light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(isDark: boolean) {
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("mentorAI_theme") as ThemeMode | null;
    return saved ?? "Light";
  });

  const isDark = resolveIsDark(theme);

  useEffect(() => {
    applyTheme(isDark);
  }, [isDark]);

  // Listen for system preference changes when in "System" mode
  useEffect(() => {
    if (theme !== "System") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    localStorage.setItem("mentorAI_theme", t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
