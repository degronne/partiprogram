import { DocChapter, DocSection } from "../../data/document";
import { useSearchContext } from "./searchContext";
import { SearchMatchView } from "./searchMatchView";
import React from "react";

export function SearchMatches({
  fragment,
}: {
  fragment: DocChapter | DocSection;
}) {
  const { matchingDirectChildren } = useSearchContext();
  const matches = matchingDirectChildren(fragment);
  if (!matches.length) return null;
  return (
    <ul>
      {matches.map((c) => (
        <li>
          <SearchMatchView fragment={c} />
        </li>
      ))}
    </ul>
  );
}
