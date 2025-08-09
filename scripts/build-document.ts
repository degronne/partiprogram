import { InputItem } from "./parse-markdown-line";
import { DocChapter, DocDocument, DocSection } from "../src/data/document";

export function buildDocument(items: InputItem[]) {
  const document: DocDocument = { chapters: [] };
  let currentChapter: DocChapter;
  let currentSection: DocSection | undefined;
  let sectionIndex = 1;
  let paragraphIndex = 1;
  for (const item of items) {
    const { type } = item;
    if (type === "chapter") {
      const { chapterId, text } = item;
      currentChapter = { type, chapterId, text, children: [] };
      document.chapters.push(currentChapter);
      currentSection = undefined;
      sectionIndex = 1;
      paragraphIndex = 1;
    } else if (type === "section") {
      const { sectionId, text } = item;
      const { chapterId } = currentChapter!;
      currentSection = {
        type,
        chapterId,
        sectionId,
        anchor: sectionId,
        text,
        children: [],
      };
      currentChapter!.children.push(currentSection);
    } else if (type === "numberedItem") {
      const { chapterId, sectionId } = currentSection!;
      const { itemId, text } = item;
      const anchor = `${sectionId}-${itemId}`;
      const textItem = { type, chapterId, sectionId, anchor, itemId, text };
      currentSection!.children.push(textItem);
    } else if (type === "proposalsStart") {
      const { chapterId } = currentChapter!;
      const textItem = { type, chapterId, text: "VÅRE LØSNINGER" };
      if (currentSection) {
        const { sectionId } = currentSection;
        currentSection.children.push({
          ...textItem,
          sectionId,
          anchor: `${sectionId}§${paragraphIndex++}`,
        });
      } else {
        currentChapter!.children.push({
          ...textItem,
          anchor: `§${paragraphIndex++}`,
        });
      }
    } else if (type === "paragraph" || type === "headline") {
      const { chapterId } = currentChapter!;
      const { text } = item;
      const textItem = { type, chapterId, text };
      if (currentSection) {
        const { sectionId } = currentSection;
        currentSection.children.push({
          ...textItem,
          sectionId,
          anchor: `${sectionId}§${paragraphIndex++}`,
        });
      } else {
        currentChapter!.children.push({
          ...textItem,
          anchor: `§${paragraphIndex++}`,
        });
      }
    } else if (type === "listHeader") {
      const { chapterId } = currentChapter!;
      const { text } = item;
      currentSection!.children.push({ type, chapterId, text });
    } else if (
      type !== "empty" &&
      type !== "tableOfContentsHeader" &&
      type !== "tableOfContentsEntry"
    ) {
      console.warn("Unhandled type " + item.type);
    }
  }
  return document;
}
