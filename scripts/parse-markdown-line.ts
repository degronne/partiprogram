export type InputItem =
  | { type: "unknown"; original: string }
  | { type: "empty"; original: string }
  | { type: "listHeader"; text: string }
  | { type: "numberedItem"; itemId: string; text: string; original: string }
  | { type: "paragraph"; text: string }
  | { type: "chapter"; chapterId: string; title: string; original: string }
  | { type: "proposalsStart"; sectionId: string; original: string }
  | { type: "headline"; text: string; original: string }
  | { type: "section"; sectionId: string; title: string; original: string }
  | { type: "tableOfContentsEntry"; original: string }
  | { type: "tableOfContentsHeader"; original: string };

export function parseMarkdownLine(original: string): InputItem {
  return (
    (original.match(/^\s*$/) && { type: "empty", original }) ||
    parseNumberedItem(original) ||
    parseListHeader(original) ||
    parseSectionHeader(original) ||
    parseChapter(original) ||
    parseSubChapter(original) ||
    parseProposalStart(original) ||
    parseHeadline(original) ||
    parseParagraph(original) ||
    (original.match(/^# \*\*INNHOLDSFORTEGNELSE\*\*$/) && {
      type: "tableOfContentsHeader",
      original,
    }) ||
    parseTableOfContentEntry(original) ||
    unmatched(original)
  );
}

function parseNumberedItem(original: string): InputItem | void {
  const matcher = original.match(/^(\d+)\. +([a-zæøåéôöüä0-9 ,:./()“”%₂-]+)$/i);
  if (matcher) {
    const [, itemId, text] = matcher;
    return { type: "numberedItem", itemId, text, original };
  }
}

function parseParagraph(original: string): InputItem | void {
  const matcher = original.match(/^_?([a-zæøåéôü0-9 ,:./()“”%-]+)_?$/i);
  if (matcher && original.match(/[a-z]+/i)) {
    const [, text] = matcher;
    return { type: "paragraph", text };
  }
}

function parseTableOfContentEntry(original: string): InputItem | void {
  const matcher = original.match(
    /^\[\d+((\.\d+)*|\.) [A-ZÆØÅÜ0-9, -]+]\(#[a-zæøåü0-9,.-]+\)$/,
  );
  if (matcher) return { type: "tableOfContentsEntry", original };
}

function parseSectionHeader(original: string): InputItem | void {
  const matcher = original.match(
    /^## \*\*(\d+(\.\d+)+) ([A-ZÆØÅÜ0-9, -]+)\*\* {#.+}$/,
  );
  if (matcher) {
    const [, sectionId, , title] = matcher;
    return { type: "section", sectionId, title, original };
  }
}

function parseChapter(original: string): InputItem | void {
  const matcher = original.match(/^# \*\*(\d+)\. (.*)\*\* {#.+}$/);
  if (matcher) {
    const [, chapterId, title] = matcher;
    return { type: "chapter", chapterId, title, original };
  }
}

function parseSubChapter(original: string): InputItem | void {
  const matcher = original.match(/^# \*\*(\d+(\.\d+)+) (.*)\*\* {#.+}$/);
  if (matcher) {
    const [, chapterId, , title] = matcher;
    return { type: "chapter", chapterId, title, original };
  }
}

function parseHeadline(original: string): InputItem | void {
  const matcher = original.match(/^### ([A-ZÆØÅ0-9 ,\\!-]+)$/);
  if (matcher) {
    const [, text] = matcher;
    return { type: "headline", text, original };
  }
}

function parseListHeader(text: string): InputItem | void {
  if (text.match(/^De Grønne vil:\s*$/)) return { type: "listHeader", text };
}

function parseProposalStart(original: string): InputItem | void {
  const match = original.match(/^\*\*(\d+)(\.|(\.\d+)+) VÅRE LØSNINGER\*\*$/);
  if (match) {
    const [, sectionId] = match;
    return { type: "proposalsStart", sectionId, original };
  }
}

function unmatched(original: string): InputItem {
  console.warn("unmatched", original);
  return { type: "unknown", original };
}
