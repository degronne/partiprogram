import data from "./partiprogram-hierarkisk.json";

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
      number: number;
      text: string;
    };
export const partiprogram = data as SectionNode[];
