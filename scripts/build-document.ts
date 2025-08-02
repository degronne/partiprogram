import { InputItem } from "./parse-markdown-line";
import { DocChapter, DocDocument, DocSection } from "../src/data/document";

export function buildDocument(items: InputItem[]) {
  const document: DocDocument = { chapters: [] };
  let currentChapter: DocChapter;
  let currentSection: DocSection | undefined;
  for (const item of items) {
    const { type } = item;
    if (type === "chapter") {
      const { chapterId, text } = item;
      currentChapter = { type, chapterId, text, children: [] };
      document.chapters.push(currentChapter);
      currentSection = undefined;
    } else if (type === "section") {
      const { sectionId, text } = item;
      const { chapterId } = currentChapter!;
      currentSection = { type, chapterId, sectionId, text, children: [] };
      currentChapter!.children.push(currentSection);
    } else if (type === "numberedItem") {
      const { chapterId, sectionId } = currentSection!;
      const { itemId, text } = item;
      const textItem = { type, chapterId, sectionId, itemId, text };
      currentSection!.children.push(textItem);
    } else if (type === "proposalsStart") {
      const { chapterId } = currentChapter!;
      const textItem = { type, chapterId, text: "VÅRE LØSNINGER" };
      if (currentSection) {
        const { sectionId } = currentSection;
        currentSection.children.push({ ...textItem, sectionId });
      } else {
        currentChapter!.children.push(textItem);
      }
    } else if (type === "paragraph" || type === "headline") {
      const { chapterId } = currentChapter!;
      const { text } = item;
      const textItem = { type, chapterId, text };
      if (currentSection) {
        const { sectionId } = currentSection;
        currentSection.children.push({ ...textItem, sectionId });
      } else {
        currentChapter!.children.push(textItem);
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
