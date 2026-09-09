// Synthesizes a plausible "source document" for the reference side panel.
// A real backend would return the actual document + character offset; here
// we deterministically build filler context around the exact quoted clause
// so the panel still demonstrates "jump straight to the referenced part."

const introLines = [
  "This section was covered in the material your instructor assigned for this unit.",
  "The following passage sets up the context before the key point below.",
  "As introduced earlier in this document, the topic builds on prior material.",
];

const outroLines = [
  "The next section continues with worked examples building on this point.",
  "See the following slide for a diagram illustrating this in more detail.",
  "This connects directly to the practice problems at the end of the chapter.",
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
