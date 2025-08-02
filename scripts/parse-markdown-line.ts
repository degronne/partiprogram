export type InputItem =
  | { type: "unknown"; original: string }
  | { type: "empty"; original: string }
  | { type: "listHeader"; original: string }
  | { type: "numberedItem"; itemId: string; text: string; original: string }
  | { type: "paragraph"; text: string }
  | { type: "chapter"; chapterId: string; title: string; original: string }
  | { type: "proposalsStart"; sectionId: string; original: string }
  | { type: "headline"; title: string; original: string }
  | { type: "section"; sectionId: string; title: string; original: string }
  | { type: "tableOfContentsEntry"; original: string }
  | { type: "tableOfContentsHeader"; original: string };

export function parseMarkdownLine(original: string): InputItem {
  return (
    (original.match(/^\s*#*\s*$/) && { type: "empty", original }) ||
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
  const matcher = original.match(/^(\d+)\. (.*)$/);
  if (matcher) {
    const [, itemId, text] = matcher;
    return { type: "numberedItem", itemId, text, original };
  }
}

function parseParagraph(text: string): InputItem | void {
  const matcher = text.match(/^[a-zæøåéôü0-9 ,:./_()“”%\\-]+$/i);
  //const matcher = text.match(/^[a-zæøåé0-9 ,:./()-]*$/i);
  if (matcher) return { type: "paragraph", text };
}

function parseTableOfContentEntry(original: string): InputItem | void {
  const matcher = original.match(
    /^\[\d+((\.\d+)*|\\\.) [A-ZÆØÅÜ0-9, -]+]\(#[a-zæøåü0-9,.-]+\)$/,
  );
  if (matcher) return { type: "tableOfContentsEntry", original };
}

function parseSectionHeader(original: string): InputItem | void {
  const matcher = original.match(/^## \*\*(\d+(\.\d+)+) (.*)$/);
  if (matcher) {
    const [, sectionId, , title] = matcher;
    return { type: "section", sectionId, title, original };
  }
}

function parseChapter(original: string): InputItem | void {
  // "# **2.2 OPPVEKST OG KUNNSKAP** {#2.2-oppvekst-og-kunnskap}"
  const matcher = original.match(/^# \*\*(\d+)\\\. (.*)\*\* {#.+}$/);
  if (matcher) {
    const [, chapterId, title] = matcher;
    return { type: "chapter", chapterId, title, original };
  }
}

function parseSubChapter(original: string): InputItem | void {
  const matcher = original.match(/^# \*\*(\d+(\.\d+)+) (.*)\*\* {#.+}$/);
  if (matcher) {
    const [, chapterId, title] = matcher;
    return { type: "chapter", chapterId, title, original };
  }
}

function parseHeadline(original: string): InputItem | void {
  const matcher = original.match(/^\s*### ([A-ZÆØÅ0-9 ,\\!-]+)$/);
  if (matcher) {
    const [, title] = matcher;
    return { type: "headline", title, original };
  }
}

function parseListHeader(original: string): InputItem | void {
  if (original.match(/^De Grønne vil:\s*$/))
    return { type: "listHeader", original };
}

function parseProposalStart(original: string): InputItem | void {
  let match = original.match(/^\*\*(\d+)(\\\.|(\.\d+)+) VÅRE LØSNINGER\*\*$/);
  if (match) {
    const [, sectionId] = match;
    return { type: "proposalsStart", sectionId, original };
  }
}

function unmatched(original: string): InputItem {
  console.warn("unmatched", original);
  return { type: "unknown", original };
}
