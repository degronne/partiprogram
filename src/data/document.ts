import data from "./output.json";

export type DocDocument = { chapters: DocChapter[] };
export type DocChapter = {
  type: "chapter";
  chapterId: string;
  text: string;
  children: (DocSection | DocParagraph | DocHeadline)[];
};
export type DocSection = {
  type: "section";
  chapterId: string;
  sectionId: string;
  text: string;
  children: (DocNumberedItem | DocHeadline | DocParagraph | DocListHeader)[];
};
type TextItem = {
  chapterId: string;
  sectionId?: string;
  text: string;
  children?: undefined;
};
export type DocNumberedItem = TextItem & {
  type: "numberedItem";
  itemId: string;
};
export type DocHeadline = TextItem & { type: "headline" | "proposalsStart" };
export type DocParagraph = TextItem & { type: "paragraph" };
export type DocListHeader = TextItem & { type: "listHeader" };

export type DocDocumentFragment =
  | DocChapter
  | DocSection
  | DocNumberedItem
  | DocHeadline
  | DocParagraph
  | DocListHeader;

export const appDocument = data as DocDocument;
