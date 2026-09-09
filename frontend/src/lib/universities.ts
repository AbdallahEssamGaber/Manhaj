import type { Major, University } from "@/types";

// Shared across universities for this demo — a real backend would return
// each university's actual college/major list.
export const majors: Major[] = [
  { id: "cs", name: "Computer Science", years: 4 },
  { id: "engineering", name: "Engineering", years: 5 },
  { id: "business", name: "Business Administration", years: 4 },
  { id: "medicine", name: "Medicine", years: 6 },
  { id: "pharmacy", name: "Pharmacy", years: 5 },
  { id: "law", name: "Law", years: 4 },
  { id: "arts", name: "Arts & Humanities", years: 4 },
];

export const universities: University[] = [
  { id: "cu", name: "Cairo University", shortName: "CU", bg: "oklch(0.93 0.05 20)", text: "oklch(0.4 0.11 20)", majors },
  { id: "asu", name: "Ain Shams University", shortName: "ASU", bg: "oklch(0.93 0.05 50)", text: "oklch(0.42 0.1 50)", majors },
  { id: "alex", name: "Alexandria University", shortName: "AU", bg: "oklch(0.93 0.045 300)", text: "oklch(0.44 0.09 300)", majors },
  { id: "auc", name: "American University in Cairo", shortName: "AUC", bg: "oklch(0.93 0.045 20)", text: "oklch(0.42 0.1 20)", majors },
  { id: "guc", name: "German University in Cairo", shortName: "GUC", bg: "oklch(0.93 0.055 80)", text: "oklch(0.42 0.09 80)", majors },
  { id: "nu", name: "Nile University", shortName: "NU", bg: "oklch(0.93 0.045 140)", text: "oklch(0.42 0.09 140)", majors },
  { id: "hu", name: "Helwan University", shortName: "HU", bg: "oklch(0.93 0.045 330)", text: "oklch(0.44 0.1 330)", majors },
  { id: "mu", name: "Mansoura University", shortName: "MU", bg: "oklch(0.93 0.05 10)", text: "oklch(0.42 0.11 10)", majors },
  { id: "zu", name: "Zagazig University", shortName: "ZU", bg: "oklch(0.93 0.05 100)", text: "oklch(0.4 0.08 100)", majors },
  { id: "bue", name: "British University in Egypt", shortName: "BUE", bg: "oklch(0.93 0.04 300)", text: "oklch(0.44 0.07 300)", majors },
  { id: "other", name: "Another university", shortName: "…", bg: "oklch(0.93 0.006 55)", text: "oklch(0.45 0.012 55)", majors },
];

export function getUniversity(id: string | undefined | null) {
  return universities.find((u) => u.id === id);
}
