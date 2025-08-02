import data from "./partiprogram-hierarkisk.json";
import Fuse from "fuse.js";

export interface SectionNode {
  number: string; // e.g. "1.1"
  title: string | null; // section title, may be null for intermediate nodes
  children: (SectionNode | ContentItem)[];
}

export type ContentItem =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "list_item";
      number: string;
      text: string;
    };
export const partiprogram = data as SectionNode[];

export type IndexedItem =
  | {
      type: "chapter";
      chapterNumber: string;
      text: string;
    }
  | {
      type: "section";
      chapterNumber: string;
      sectionNumber: string;
      text: string;
    }
  | {
      type: "numberedItem";
      chapterNumber: string;
      sectionNumber: string;
      itemNumber: string | undefined;
      text: string;
    }
  | {
      type: "unnumberedParagraph";
      chapterNumber: string;
      sectionNumber: string;
      index: number;
      text: string;
    };

const docs = indexProgram(partiprogram);
function indexProgram(partiprogram: SectionNode[]) {
  function indexSection(
    chapterNumber: string,
    { number: sectionNumber, title, children }: SectionNode,
  ) {
    result.push({
      type: "section",
      chapterNumber,
      sectionNumber,
      text: title || "missing!!",
    });
    let index = 0;
    for (const child of children) {
      if ("children" in child) {
        indexSection(chapterNumber, child);
      } else if (child.type === "list_item") {
        const { text, number: itemNumber } = child;
        result.push({
          type: "numberedItem",
          chapterNumber,
          sectionNumber,
          itemNumber,
          text,
        });
      } else {
        const { text } = child;
        result.push({
          type: "unnumberedParagraph",
          sectionNumber,
          chapterNumber,
          text,
          index: index++,
        });
      }
    }
  }

  const result: IndexedItem[] = [];
  for (const { number: chapterNumber, title, children } of partiprogram) {
    result.push({
      type: "chapter",
      chapterNumber,
      text: title || "missing title for " + chapterNumber,
    });
    for (const child of children) {
      if ("children" in child) indexSection(chapterNumber, child);
      else console.warn("unexpected child", child);
    }
  }
  return result;
}

console.log(docs.filter((i) => i.type === "unnumberedParagraph"));

function tokenizeWithOffsets(text: string) {
  const tokens = [];
  const wordRegex = /\b\w+\b/g;
  let match;

  while ((match = wordRegex.exec(text)) !== null) {
    tokens.push({
      word: match[0].toLowerCase(),
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return tokens;
}

export interface Words {
  word: string;
  start: number;
  end: number;
  doc: IndexedItem;
}

const words: Words[] = docs.flatMap((doc) =>
  tokenizeWithOffsets(doc.text).map((token) => ({ ...token, doc })),
);
const wordCount = new Map<string, number>();
for (const { word } of words) {
  wordCount.set(word, (wordCount.get(word) || 0) + 1);
}
const commonWords = new Set(
  [...wordCount.entries()].filter(([, c]) => c > 20).map(([w]) => w),
);

export const fuse = new Fuse(
  words.filter(({ word }) => !commonWords.has(word)),
  {
    keys: ["word"],
    includeScore: true,
    minMatchCharLength: 4,
    includeMatches: true,
    threshold: 0.3,
    useExtendedSearch: true,
  },
);
