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
  currency: string;
  hydrated: boolean;
  setLanguage: (l: LanguageCode) => void;
  setTheme: (t: ThemeMode) => void;
  setMadhab: (m: MadhabId) => void;
  setCurrency: (c: string) => void;
}

const STORAGE_KEY = "meeras.settings.v1";

const SettingsContext = createContext<SettingsState | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [madhab, setMadhabState] = useState<MadhabId>("hanafi");
  const [currency, setCurrencyState] = useState<string>("SAR");
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
          if (data.currency) setCurrencyState(data.currency);
        }
      } catch {
        // ignore
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const persist = useCallback(
    (next: { language?: LanguageCode; theme?: ThemeMode; madhab?: MadhabId; currency?: string }) => {
      const merged = {
        language: next.language ?? language,
        theme: next.theme ?? theme,
        madhab: next.madhab ?? madhab,
        currency: next.currency ?? currency,
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged)).catch(() => {});
    },
    [language, theme, madhab, currency],
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

  const setCurrency = useCallback(
    (c: string) => {
      setCurrencyState(c);
      persist({ currency: c });
    },
    [persist],
  );

  return (
    <SettingsContext.Provider
      value={{ language, theme, madhab, currency, hydrated, setLanguage, setTheme, setMadhab, setCurrency }}
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
