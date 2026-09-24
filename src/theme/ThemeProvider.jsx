
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "saaras-theme";

function getSavedTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (["light", "dark", "system"].includes(saved)) {
      return saved;
    }
  } catch {
    // Storage may be unavailable.
  }

  return "system";
}

function getResolvedTheme(mode) {
  if (mode !== "system") return mode;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(getSavedTheme);
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    getResolvedTheme(getSavedTheme())
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // The theme still works for this session.
    }

    const media = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const updateTheme = () => {
      const resolved = getResolvedTheme(mode);

      setResolvedTheme(resolved);

      document.documentElement.dataset.theme = resolved;
    };

    updateTheme();

    media.addEventListener("change", updateTheme);

    return () => {
      media.removeEventListener("change", updateTheme);
    };
  }, [mode]);

  return (
    <ThemeContext.Provider
      value={{ mode, setMode, resolvedTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}