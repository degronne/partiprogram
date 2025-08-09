import data from "./output.json";

export type DocDocument = { chapters: DocChapter[] };
export type DocChapter = {
  type: "chapter";
  chapterId: string;
  sectionId?: undefined;
  anchor: string;
  text: string;
  children: (DocSection | DocParagraph | DocHeadline)[];
};
export type DocSection = {
  type: "section";
  chapterId: string;
  sectionId: string;
  anchor: string;
  text: string;
  children: (DocNumberedItem | DocHeadline | DocParagraph | DocListHeader)[];
};
type TextItem = {
  chapterId: string;
  sectionId?: string;
  text: string;
  anchor?: string;
};
export type DocNumberedItem = TextItem & {
  type: "numberedItem";
  anchor: string;
  itemId: string;
};
export type DocHeadline = TextItem & {
  type: "headline" | "proposalsStart";
  anchor: string;
};
export type DocParagraph = TextItem & { type: "paragraph"; anchor: string };
export type DocListHeader = TextItem & { type: "listHeader" };

export type DocDocumentFragment =
  | DocSection
  | DocNumberedItem
  | DocHeadline
  | DocParagraph
  | DocListHeader;

export const appDocument = data as DocDocument;
