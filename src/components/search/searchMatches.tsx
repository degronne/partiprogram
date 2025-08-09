import {
  DocChapter,
  DocDocumentFragment,
  DocSection,
} from "../../data/document";
import { useSearchContext } from "./searchContext";
import { SearchMatchView } from "./searchMatchView";
import React from "react";
import { Link } from "react-router-dom";

function SearchMatch({ fragment }: { fragment: DocDocumentFragment }) {
  const { setShowTableOfContent } = useSearchContext();
  if (fragment.type === "numberedItem") {
    return (
      <div className={fragment.type}>
        <Link
          to={`/seksjon/${fragment.chapterId}/${fragment.anchor}`}
          onClick={() => setShowTableOfContent(false)}
        >
          {fragment.itemId}.
        </Link>{" "}
        <SearchMatchView fragment={fragment} />
      </div>
    );
  }
  return (
    <div>
      <SearchMatchView fragment={fragment} />
    </div>
  );
}

export function SearchMatches({
  fragment,
}: {
  fragment: DocChapter | DocSection;
}) {
  const { matchingDirectChildren } = useSearchContext();
  const matches = matchingDirectChildren(fragment);
  if (!matches.length) return null;
  return (
    <>
      {matches.map((c) => (
        <SearchMatch key={c.anchor} fragment={c} />
      ))}
    </>
  );
}
