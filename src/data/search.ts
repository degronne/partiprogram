import {
  DocChapter,
  DocDocument,
  DocDocumentFragment,
  DocHeadline,
  DocParagraph,
  DocSection,
  appDocument,
} from "./document";
import Fuse from "fuse.js";
import { DocWord, tokenizeWithOffset } from "./tokenizeWithOffset";

export type SearchMatch = {
  score: number;
  word: string;
  start: number;
  end: number;
  wordInContext: string;
};

function flattenDocument(doc: DocDocument): DocDocumentFragment[] {
  function flattenChapterChild(
    child: DocSection | DocParagraph | DocHeadline,
  ): DocDocumentFragment[] {
    if (child.type === "section") {
      return [child, ...child.children];
    }
    return [child];
  }

  function flattenChapter(chapter: DocChapter): DocDocumentFragment[] {
    return [chapter, ...chapter.children.flatMap(flattenChapterChild)];
  }

  return doc.chapters.flatMap(flattenChapter);
}

type IndexEntry = { word: DocWord; fragment: DocDocumentFragment };
const fragments = flattenDocument(appDocument).filter(
  (f) => f.type !== "proposalsStart" && f.type !== "listHeader",
);
const index: IndexEntry[] = fragments.flatMap((fragment) => {
  return tokenizeWithOffset(fragment.text).map((word) => ({
    word,
    fragment,
  })) as IndexEntry[];
});
const fuse = new Fuse(index, {
  keys: ["word.word"],
  threshold: 0.02,
  includeScore: true,
  minMatchCharLength: 3,
});

function searchForWord(query: string) {
  let result = fuse.search(query);

  const exactResults = result.filter(
    (r) => r.item.word.word.indexOf(query.toLowerCase()) != -1,
  );
  if (exactResults.length > 1) {
    result = exactResults;
  } else if (result.filter((r) => r.score! < 0.002).length > 10) {
    result = result.filter((r) => r.score! < 0.01);
  }
  const collected = new Map<DocDocumentFragment, SearchMatch[]>();
  for (const r of result) {
    const score = r.score!;
    const {
      item: {
        fragment,
        word: { word, start, end },
      },
    } = r;
    const { text } = fragment;
    if (!collected.has(fragment)) collected.set(fragment, []);
    const wordInContext = `${text.substring(Math.max(0, start - 20), start)}[${text.substring(start, end)}]${text.substring(end, Math.min(text.length, end + 20))}`;
    collected.get(fragment)!.push({ score, word, start, end, wordInContext });
  }
  return collected;
}

export function search(query: string): Map<DocDocumentFragment, SearchMatch[]> {
  const terms = query.split(/\s+/);
  const allResults = terms
    .filter((s) => s.length > 3)
    .map((q) => searchForWord(q));

  const combined = new Map<DocDocumentFragment, SearchMatch[]>();

  for (const result of allResults) {
    for (const key of result.keys()) {
      if (allResults.every((r) => r.has(key))) {
        combined.set(key, []);
      }
    }
  }
  for (const key of combined.keys()) {
    for (const result of allResults) {
      result.get(key)!.forEach((v) => combined.get(key)?.push(v));
    }
  }

  return combined;
}
