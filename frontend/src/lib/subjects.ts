import type { Subject } from "@/types";

export function monogram(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function subjects(names: string[]): Subject[] {
  return names.map((name) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    monogram: monogram(name),
  }));
}

// [majorId][year - 1] -> subjects for that year. Demo curriculum, shared
// across universities — a real backend would map this per school.
const curriculum: Record<string, string[][]> = {
  cs: [
    ["Intro to Programming", "Discrete Math", "Calculus I", "Digital Logic"],
    ["Data Structures", "Object-Oriented Programming", "Linear Algebra", "Computer Architecture"],
    ["Algorithms", "Operating Systems", "Database Systems", "Probability & Statistics"],
    ["Software Engineering", "Computer Networks", "Artificial Intelligence", "Graduation Project"],
  ],
  engineering: [
    ["Calculus I", "Physics I", "Engineering Drawing", "Chemistry"],
    ["Calculus II", "Physics II", "Statics", "Electric Circuits"],
    ["Thermodynamics", "Fluid Mechanics", "Materials Science", "Numerical Methods"],
    ["Control Systems", "Machine Design", "Signals & Systems", "Engineering Economics"],
    ["Senior Design Project", "Industrial Management", "Elective I", "Elective II"],
  ],
  business: [
    ["Principles of Management", "Microeconomics", "Business Math", "Financial Accounting"],
    ["Macroeconomics", "Marketing Principles", "Managerial Accounting", "Business Statistics"],
    ["Corporate Finance", "Operations Management", "Organizational Behavior", "Business Law"],
    ["Strategic Management", "Entrepreneurship", "International Business", "Capstone Project"],
  ],
  medicine: [
    ["Human Anatomy I", "Biochemistry", "Medical Physics", "Histology"],
    ["Human Anatomy II", "Physiology", "Genetics", "Embryology"],
    ["Pathology", "Microbiology", "Pharmacology I", "Immunology"],
    ["Pharmacology II", "Internal Medicine I", "Surgery I", "Community Medicine"],
    ["Internal Medicine II", "Surgery II", "Pediatrics", "Obstetrics & Gynecology"],
    ["Clinical Rotations", "Psychiatry", "Emergency Medicine", "Graduation Thesis"],
  ],
  pharmacy: [
    ["General Chemistry", "Human Anatomy", "Biology", "Math for Pharmacy"],
    ["Organic Chemistry", "Physiology", "Analytical Chemistry", "Microbiology"],
    ["Pharmaceutics I", "Medicinal Chemistry I", "Pharmacology I", "Biochemistry"],
    ["Pharmaceutics II", "Medicinal Chemistry II", "Pharmacology II", "Clinical Pharmacy I"],
    ["Industrial Pharmacy", "Clinical Pharmacy II", "Pharmacy Practice", "Graduation Project"],
  ],
  law: [
    ["Introduction to Law", "Constitutional Law", "Roman Law", "Legal History"],
    ["Civil Law", "Criminal Law", "Administrative Law", "International Law"],
    ["Commercial Law", "Labor Law", "Criminal Procedure", "Civil Procedure"],
    ["Evidence Law", "Public International Law", "Legal Drafting", "Moot Court"],
  ],
  arts: [
    ["Introduction to Philosophy", "World History", "English Literature I", "Sociology"],
    ["Linguistics", "English Literature II", "Cultural Studies", "Psychology"],
    ["Comparative Literature", "Media Studies", "Research Methods", "Anthropology"],
    ["Modern Criticism", "Translation Studies", "Thesis Seminar", "Elective"],
  ],
};

export function subjectsFor(majorId: string, year: number): Subject[] {
  const years = curriculum[majorId];
  if (!years) return subjects(["Core Subject 1", "Core Subject 2", "Core Subject 3", "Core Subject 4"]);
  const names = years[Math.min(Math.max(year, 1), years.length) - 1] ?? years[years.length - 1];
  return subjects(names);
}
