import type { Major, University } from "@/types";

// Shared across universities for this demo — a real backend would return
// each university's actual college/major list.
export const majors: Major[] = [
  { id: "cs", name: "علوم الحاسب", years: 4 },
  { id: "engineering", name: "الهندسة", years: 5 },
  { id: "business", name: "إدارة الأعمال", years: 4 },
  { id: "medicine", name: "الطب", years: 6 },
  { id: "pharmacy", name: "الصيدلة", years: 5 },
  { id: "law", name: "الحقوق", years: 4 },
  { id: "arts", name: "الآداب والعلوم الإنسانية", years: 4 },
];

export const universities: University[] = [
  {
    id: "aou",
    name: "الجامعة العربية المفتوحة",
    shortName: "AOU",
    bg: "oklch(0.93 0.05 20)",
    text: "oklch(0.4 0.11 20)",
    majors,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj6cC17wZUyN_m_bzSPIJQ3huXMzK5rlgka6TsHaKAeLC981wudILQO-o&s=10",
  },
  {
    id: "ecu",
    name: "الجامعة المصرية الصينية",
    shortName: "ECU",
    bg: "oklch(0.93 0.05 50)",
    text: "oklch(0.42 0.1 50)",
    majors,
    logo: "https://ecu.edu.eg/wp-content/uploads/2022/05/ECU-Logo.png",
  },
  {
    id: "cu",
    name: "جامعة القاهرة",
    shortName: "CU",
    bg: "oklch(0.93 0.045 140)",
    text: "oklch(0.42 0.09 140)",
    majors,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjJs7CtpWuIhNeO5aD5BMX_Zw6nM7SUpV9eY3bKIGUXw&s=10",
  },
  {
    id: "alex",
    name: "جامعة الإسكندرية",
    shortName: "AU",
    bg: "oklch(0.93 0.045 300)",
    text: "oklch(0.44 0.09 300)",
    majors,
    logo: "https://upload.wikimedia.org/wikipedia/ar/5/58/%D8%B4%D8%B9%D8%A7%D8%B1_%D8%AC%D8%A7%D9%85%D8%B9%D8%A9_%D8%A7%D9%84%D8%A5%D8%B3%D9%83%D9%86%D8%AF%D8%B1%D9%8A%D8%A9.png",
  },
  {
    id: "asu",
    name: "جامعة عين شمس",
    shortName: "ASU",
    bg: "oklch(0.93 0.05 260)",
    text: "oklch(0.42 0.1 260)",
    majors,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxMu2iOY0nqLixdKeiR3YODXnFXStMdyaGeLC2e2wi-g&s",
  },
];

export function getUniversity(id: string | undefined | null) {
  return universities.find((u) => u.id === id);
}
