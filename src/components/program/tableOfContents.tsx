import React from "react";
import { Link } from "react-router-dom";
import { ProgramSearch } from "./programSearch";
import { DocChapter, DocDocument } from "../../data/document";
import { useSearchContext } from "../search/searchContext";
import { SearchMatches } from "../search/searchMatches";

export function TableOfContents({ doc }: { doc: DocDocument }) {
  return (
    <>
      <div className={"items"}>
        <ul>
          {doc.chapters.map((chapter) => (
            <TableOfContentChapter key={chapter.chapterId} chapter={chapter} />
          ))}
        </ul>
      </div>
    </>
  );
}

function TableOfContentChapter({ chapter }: { chapter: DocChapter }) {
  const { matchesInclude } = useSearchContext();
  if (!matchesInclude(chapter)) return null;
  const { chapterId, text, children } = chapter;
  return (
    <li key={chapterId}>
      <Link to={`/seksjon/${chapterId}`} onClick={() => console.log("test")}>
        {chapterId} {text}
      </Link>
      <SearchMatches fragment={chapter} />
      <ul>
        {children.filter(matchesInclude).map((child) => {
          if (child.type !== "section") return null;
          const { chapterId, sectionId, text } = child;
          return (
            <li key={sectionId}>
              <Link to={`/seksjon/${chapterId}/${sectionId}`}>
                {sectionId} {text}
              </Link>
              <SearchMatches fragment={child} />
            </li>
          );
        })}
      </ul>
    </li>
  );
}
