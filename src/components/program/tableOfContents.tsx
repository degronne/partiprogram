import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ProgramSearch } from "./programSearch";
import {
  DocDocument,
  DocDocumentFragment,
  DocHeadline,
  DocParagraph,
  DocSection,
} from "../../data/document";
import { SearchMatch } from "../../data/search";

function ChapterChild({
  fragment,
}: {
  fragment: DocSection | DocParagraph | DocHeadline;
}) {
  if (fragment.type === "section") {
    const { chapterId, sectionId, text } = fragment;
    return (
      <li key={sectionId}>
        <Link to={`/seksjon/${chapterId}/${sectionId}`}>
          {sectionId} {text}
        </Link>
      </li>
    );
  }
  return null;
}

export function TableOfContents({ doc }: { doc: DocDocument }) {
  const [matches, setMatches] = useState<
    Map<DocDocumentFragment, SearchMatch[]>
  >(new Map());

  function itemMatchesSearch(fragment: DocDocumentFragment) {
    if (!matches.size) return true;

    if ("sectionId" in fragment) {
      return [...matches.keys()].some(
        (m) => "sectionId" in m && m.sectionId === fragment.sectionId,
      );
    }

    return [...matches.keys()].some((m) => m.chapterId === fragment.chapterId);
  }

  return (
    <>
      <ProgramSearch setMatches={setMatches} matches={matches} />
      <div className={"items"}>
        <ul>
          {doc.chapters
            .filter((s) => itemMatchesSearch(s))
            .map(({ chapterId, text, children }) => (
              <li key={chapterId}>
                <Link to={`/section/${chapterId}`}>
                  {chapterId} {text}
                </Link>
                <ul>
                  {children
                    .filter((c) => itemMatchesSearch(c))
                    .map((child) => (
                      <ChapterChild key={child.sectionId} fragment={child} />
                    ))}
                </ul>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
