// Synthesizes a plausible "source document" for the reference side panel.
// A real backend would return the actual document + character offset; here
// we deterministically build filler context around the exact quoted clause
// so the panel still demonstrates "jump straight to the referenced part."

const introLines = [
  "الجزء ده كان موجود في المادة اللي الدكتور حددها للوحدة دي.",
  "الفقرة الجاية بتمهّد للنقطة الأساسية اللي جاية بعدها.",
  "زي ما اتذكر قبل كده في المستند ده، الموضوع مبني على مادة سابقة.",
];

const outroLines = [
  "الجزء اللي بعده فيه أمثلة محلولة مبنية على النقطة دي.",
  "شوف السلايد اللي بعدها فيها رسم توضيحي بالتفصيل.",
  "ده مرتبط مباشرة بتمارين آخر الفصل.",
];

function seededPick<T>(arr: T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return arr[hash % arr.length];
}

export interface SourceDocument {
  title: string;
  paragraphs: string[];
  /** Index into paragraphs of the exact referenced clause */
  highlightIndex: number;
}

export function getSourceDocument(label: string, quote: string): SourceDocument {
  return {
    title: label,
    paragraphs: [seededPick(introLines, label), quote, seededPick(outroLines, label + quote)],
    highlightIndex: 1,
  };
}
