import { InputItem } from "./parse-markdown-line";

type Document = { chapters: Chapter[] };
type Chapter = {
  chapterId: string;
  title: string;
  children: (Section | Paragraph | Headline)[];
};
type Section = {
  type: "section";
  chapterId: string;
  sectionId: string;
  title: string;
  children: (NumberedItem | Headline | Paragraph | ListHeader)[];
};
type TextItem = { chapterId: string; sectionId?: string; text: string };
type NumberedItem = TextItem & { type: "numberedItem"; itemId: string };
type Headline = TextItem & { type: "headline" | "proposalsStart" };
type Paragraph = TextItem & { type: "paragraph" };
type ListHeader = TextItem & { type: "listHeader" };

export function buildDocument(items: InputItem[]) {
  const document: Document = { chapters: [] };
  let currentChapter: Chapter;
  let currentSection: Section | undefined;
  for (const item of items) {
    const { type } = item;
    if (type === "chapter") {
      const { chapterId, title } = item;
      currentChapter = { chapterId, title, children: [] };
      document.chapters.push(currentChapter);
      currentSection = undefined;
    } else if (type === "section") {
      const { sectionId, title } = item;
      const { chapterId } = currentChapter!;
      currentSection = { type, chapterId, sectionId, title, children: [] };
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
