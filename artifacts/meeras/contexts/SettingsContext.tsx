import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { LanguageCode, MadhabId } from "@/lib/i18n";

export type ThemeMode = "system" | "light" | "dark";

interface SettingsState {
  language: LanguageCode;
  theme: ThemeMode;
  madhab: MadhabId;
  hydrated: boolean;
  setLanguage: (l: LanguageCode) => void;
  setTheme: (t: ThemeMode) => void;
  setMadhab: (m: MadhabId) => void;
}

const STORAGE_KEY = "meeras.settings.v1";

const SettingsContext = createContext<SettingsState | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [madhab, setMadhabState] = useState<MadhabId>("hanafi");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          if (data.language) setLanguageState(data.language);
          if (data.theme) setThemeState(data.theme);
          if (data.madhab) setMadhabState(data.madhab);
        }
      } catch {
        // ignore
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const persist = useCallback(
    (next: { language?: LanguageCode; theme?: ThemeMode; madhab?: MadhabId }) => {
      const merged = {
        language: next.language ?? language,
        theme: next.theme ?? theme,
        madhab: next.madhab ?? madhab,
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged)).catch(() => {});
    },
    [language, theme, madhab],
  );

  const setLanguage = useCallback(
    (l: LanguageCode) => {
      setLanguageState(l);
      persist({ language: l });
    },
    [persist],
  );

  const setTheme = useCallback(
    (t: ThemeMode) => {
      setThemeState(t);
      persist({ theme: t });
    },
    [persist],
  );

  const setMadhab = useCallback(
    (m: MadhabId) => {
      setMadhabState(m);
      persist({ madhab: m });
    },
    [persist],
  );

  return (
    <SettingsContext.Provider
      value={{ language, theme, madhab, hydrated, setLanguage, setTheme, setMadhab }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsState {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
