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
  children: (NumberedItem | DocHeadline | DocParagraph | ListHeader)[];
};
type TextItem = { chapterId: string; sectionId?: string; text: string };
type NumberedItem = TextItem & { type: "numberedItem"; itemId: string };
export type DocHeadline = TextItem & { type: "headline" | "proposalsStart" };
export type DocParagraph = TextItem & { type: "paragraph" };
type ListHeader = TextItem & { type: "listHeader" };

export type DocDocumentFragment =
  | DocChapter
  | DocSection
  | NumberedItem
  | DocHeadline
  | DocParagraph
  | ListHeader;
