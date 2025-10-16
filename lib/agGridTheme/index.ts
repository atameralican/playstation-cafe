import { themeQuartz } from "ag-grid-community";

/**
 * AgGrid için dark/light mode uyumlu tema döndürür
 * @param isDark - Dark mode aktif mi?
 * @returns AgGrid tema objesi
 */
export const getAgGridTheme = (isDark: boolean) => {
  return themeQuartz.withParams({
    accentColor: isDark ? "#818cf8" : "#6366f1",
    backgroundColor: isDark ? "#1e293b" : "#ffffff",
    foregroundColor: isDark ? "#f1f5f9" : "#0f172a",
    headerBackgroundColor: isDark ? "#334155" : "#f8fafc",
    headerTextColor: isDark ? "#f1f5f9" : "#0f172a",
    oddRowBackgroundColor: isDark ? "#1e293b" : "#ffffff",
    borderColor: isDark ? "#475569" : "#e2e8f0",
  });
};
