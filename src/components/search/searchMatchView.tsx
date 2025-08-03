import { DocDocumentFragment } from "../../data/document";
import React, { ReactNode } from "react";
import { useSearchContext } from "./searchContext";

export function SearchMatchView({
  fragment,
}: {
  fragment: DocDocumentFragment;
}) {
  const { matches } = useSearchContext();
  const match = matches.get(fragment);
  const { text } = fragment;

  if (!match) return text;

  const boundaries = match.toSorted((a, b) => a.start - b.start);
  const fragments: ReactNode[] = [];
  let curr = 0;
  for (const { start, end } of boundaries) {
    fragments.push(<span>{text.substring(curr, start)}</span>);
    fragments.push(
      <span className={"searchMatch"}>{text.substring(start, end)}</span>,
    );
    curr = end;
  }
  fragments.push(<span>{text.substring(curr)}</span>);
  return <>{fragments}</>;
}
