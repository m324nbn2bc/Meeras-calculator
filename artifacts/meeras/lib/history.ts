import AsyncStorage from "@react-native-async-storage/async-storage";

import { LanguageCode, MadhabId } from "./i18n";

const STORAGE_KEY = "meeras.history.v1";
const MAX_ENTRIES = 50;

export interface SavedCalc {
  id: string;
  savedAt: number;
  label: string;
  madhab: MadhabId;
  state: string;
  estate: number;
  currency?: string;
}

export async function listCalculations(): Promise<SavedCalc[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as SavedCalc[];
    return list.sort((a, b) => b.savedAt - a.savedAt);
  } catch {
    return [];
  }
}

export async function saveCalculation(
  entry: Omit<SavedCalc, "id" | "savedAt" | "currency">,
): Promise<SavedCalc> {
  const list = await listCalculations();
  const newEntry: SavedCalc = {
    ...entry,
    id: `calc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    savedAt: Date.now(),
  };
  const updated = [newEntry, ...list].slice(0, MAX_ENTRIES);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newEntry;
}

export async function deleteCalculation(id: string): Promise<void> {
  const list = await listCalculations();
  const updated = list.filter((c) => c.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function formatSavedDate(savedAt: number, lang: LanguageCode): string {
  const locale =
    lang === "ar" ? "ar-SA" : lang === "ur" ? "ur-PK" : "en-GB";
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(savedAt));
  } catch {
    return new Date(savedAt).toLocaleString();
  }
}
